import { defHttp } from "@/utils/http/axios";
import { LoginParams } from "./model/userModel";

enum Api {
  Login = "/admin/login",
}

export function login(data: LoginParams) {
  return defHttp.post({ url: Api.Login, data });
}
