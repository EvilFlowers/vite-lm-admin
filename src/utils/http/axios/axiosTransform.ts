import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RequestOptions, Result } from "./types";

export interface CreateAxiosOptions extends AxiosRequestConfig {
  prefixUrl?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * @description 请求之前处理config
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
  /**
   * @description 请求响应数据处理
   */
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;
  /**
   * @description 请求失败处理
   */
  requestCatchHook?: (e: Error) => Promise<any>;
  /**
   * @description 请求拦截器
   */
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  /**
   * @description 响应拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;
  /**
   * @description 请求拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;
  /**
   * @description 响应拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
