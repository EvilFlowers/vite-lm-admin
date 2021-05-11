import { defHttp } from "@/utils/http/axios";

enum Api {
  FindAllMenus = "/findAllMenus",
}

export const getAllMenu = () => {
  return defHttp.get({ url: Api.FindAllMenus });
};
