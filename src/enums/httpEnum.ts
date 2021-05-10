export enum ContentTypeEnum {
  JSON = "application/json;charset=UTF-8",
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}

export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum ResultEnum {
  OK = 0,
  NO_LOGIN = 11111,
  TOKEN_EXPIRE = 11112,
  TOKEN_ERROR = 11119,
  REFRESH_EXPIRE = 11122,
  REFRESH_ERROR = 11129,
  NO_AUTHORIZE = 11300,
  SERVER_ERROR = 19000,
}
