export interface RequestOptions {
  // post请求的时候添加参数到url
  joinParamsToUrl?: boolean;
  // 格式化提交参数时间
  formatDate?: boolean;
  // 需要对返回数据进行处理
  isTransformRequestResult?: boolean;
  // 将prefix添加到url
  joinPrefix?: boolean;
  // 接口地址
  apiUrl?: string;
  // 是否加入时间戳
  joinTime?: boolean;
  // 忽略重复请求
  ignoreCancelToken?: boolean;
}

export interface Result<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}
