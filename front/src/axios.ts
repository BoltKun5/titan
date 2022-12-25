import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = "https://localhost:10101/api";

export class loggedApi {

  public static getAxiosInstance = (token: string | null) => {
    return axios.create({
      baseURL,
      headers: {
        "Authorization": `Basic ${token}`,
      },
    })
  }

  public static get = (url: string, options: AxiosRequestConfig<any> | undefined = undefined): Promise<AxiosResponse<any, any>> => {
    return this.getAxiosInstance(localStorage.getItem("token")).get(url, options)
  }

  public static post = (url: string, data: any | undefined = undefined, config: AxiosRequestConfig | undefined = undefined): Promise<AxiosResponse<any, any>> => {
    return this.getAxiosInstance(localStorage.getItem("token")).post(url, data, config)
  }

  public static delete = (url: string, config: AxiosRequestConfig<any> | undefined = undefined): Promise<AxiosResponse<any, any>> => {
    return this.getAxiosInstance(localStorage.getItem("token")).delete(url, config)
  }
}

export const api = axios.create({
  baseURL
})
