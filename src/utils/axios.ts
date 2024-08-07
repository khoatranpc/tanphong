import axios, { RawAxiosRequestHeaders } from "axios";
import { Obj } from "@/global";

export interface Query {
    body?: Obj | Array<any>;
    queryParams?: Obj;
    params?: string[];
    headers?: RawAxiosRequestHeaders;
}

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API,
});
httpClient.interceptors.request.use(function (config) {
    (config.headers as Obj).Authorization = localStorage.getItem('access_token') as string;
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default httpClient;
