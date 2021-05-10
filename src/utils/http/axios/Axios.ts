import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { cloneDeep } from "lodash-es";
import { CreateAxiosOptions } from "./axiosTransform";
import { RequestOptions, Result } from "./types";
import { ContentTypeEnum, RequestEnum } from "@/enums/httpEnum";
import qs from "qs";
import { errorResult } from "@/utils/http/axios/const";
import { AxiosCanceler } from "@/utils/http/axios/axiosCancel";

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
  }

  /**
   * @description 创建axios实例
   * @param config
   * @private
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * @description 重新设置axios配置
   * @param config
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return;
    }
    this.createAxios(config);
  }

  /**
   * @description 设置请求头
   * @param headers
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description 配置拦截器
   * @private
   */
  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const {
        headers: { ignoreCancelToken },
      } = config;
      const ignoreCancel =
        ignoreCancelToken !== undefined ? ignoreCancelToken : this.options.requestOptions?.ignoreCancelToken;
      !ignoreCancel && axiosCanceler.addPending(config);
      if (requestInterceptors) {
        config = requestInterceptors(config);
      }
      return config;
    }, undefined);

    requestInterceptorsCatch && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    responseInterceptorsCatch && this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }

  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];
    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, "data") ||
      config.method?.toUpperCase() == RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: "brackets" }),
    };
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "GET" }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "POST" }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "PUT" }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "DELETE" }, options);
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook) {
      conf = beforeRequestHook(conf, opt);
    }
    conf = this.supportFormData(conf);

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook) {
            const ret = transformRequestHook(res, opt);
            ret !== errorResult ? resolve(ret) : reject(new Error("request error"));
            return;
          }
          resolve((res as unknown) as Promise<T>);
        })
        .catch((e: Error) => {
          if (requestCatchHook) {
            reject(requestCatchHook(e));
            return;
          }
          reject(e);
        });
    });
  }
}
