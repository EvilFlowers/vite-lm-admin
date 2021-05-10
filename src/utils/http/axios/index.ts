import { AxiosTransform, CreateAxiosOptions } from "./axiosTransform";
import { RequestOptions, Result } from "./types";
import { AxiosResponse } from "axios";
import { errorResult } from "./const";
import { ContentTypeEnum, RequestEnum, ResultEnum } from "@/enums/httpEnum";
import { ElMessage } from "element-plus";
import { AuthEnum } from "@/enums/authEnum";
import { getToken } from "@/utils/auth";
import { VAxios } from "@/utils/http/axios/Axios";
import { deepMerge } from "@/utils";

const prefix = "";

/**
 * @description 数据处理
 */
const transform: AxiosTransform = {
  /**
   * @description 处理响应数据
   * @param res
   * @param options
   */
  transformRequestHook: async (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformRequestResult } = options;
    if (!isTransformRequestResult) {
      return res.data;
    }
    const { data: resData } = res;
    if (!resData) {
      return errorResult;
    }

    const { code, data, msg } = resData;

    const hasSuccess = resData && Reflect.has(resData, "code") && code === ResultEnum.OK;
    if (!hasSuccess) {
      if (msg) {
        ElMessage.error(msg);
      }
      await Promise.reject(new Error(msg));
      return errorResult;
    }

    if (code === ResultEnum.OK) {
      return data;
    } else {
      if (msg) {
        ElMessage.error(msg);
        await Promise.reject(new Error(msg));
      } else {
        const message = "请求错误";
        ElMessage.error(message);
        await Promise.reject(new Error(message));
      }
      return errorResult;
    }
  },

  /**
   * @description 请求之前处理config
   * @param config
   * @param options
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;

    if (joinPrefix) {
      config.url = `${prefix}${config.url}`;
    }

    if (apiUrl) {
      config.url = `${apiUrl}${config.url}`;
    }
    // const params = config.params || {};
    /*if (config.method?.toUpperCase() === RequestEnum.GET) {

    }*/
    return config;
  },

  /**
   * @description 请求拦截器处理
   * @param config
   */
  requestInterceptors: (config) => {
    const token = getToken();
    if (token) {
      config.headers[AuthEnum.AUTHORIZATION_TOKEN] = token;
    }
    return config;
  },

  /**
   * @description 响应错误处理
   * @param error
   */
  responseInterceptorsCatch: (error) => {
    console.log(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // 请求超时时间
        timeout: 10 * 1000,
        // 接口前缀
        prefixUrl: prefix,
        // 请求头
        headers: { "Content-Type": ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 接口地址
          apiUrl: "",
          // 是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios();
