import { Obj } from "@/global";
import httpClient, { Query } from "./axios";
import { Method } from 'axios';

export default async function actionRequest(uri: string, method: Method, request?: Query) {
    try {
        let response;
        let parseUri = uri;
        const listReqParams = request?.params;
        if (listReqParams && !parseUri.includes('$params')) {
            throw new Error('Missing $params item');
        }
        else if (listReqParams && parseUri.includes('$params')) {
            listReqParams.forEach((_, idx) => {
                parseUri = parseUri.replace('$params', (listReqParams)[idx] as string);
            });
        }
        switch (method) {
            case "GET":
                response = httpClient.get(parseUri as string, { params: request?.params }).then(
                    (response) => {
                        return response;
                    },
                    (error) => {
                        return error.response;
                    }
                );
                break;
            case "POST":
                response = httpClient.post(parseUri as string, request?.body, { ...request?.headers ? { headers: request?.headers } : {} }).then(
                    (response) => {
                        return response;
                    },
                    (error) => {
                        return error.response;
                    }
                );
                break;
            case "PUT":
                response = httpClient.put(parseUri as string, request?.body, { params: request?.params, ...request?.headers ? { headers: request?.headers } : {} }).then(
                    (response) => {
                        return response;
                    },
                    (error) => {
                        return error.response;
                    }
                );
                break;
            case "DELETE":
                response = httpClient.delete(parseUri as string, { params: request?.queryParams }).then(
                    (response) => {
                        return response;
                    },
                    (error) => {
                        return error.response;
                    }
                );
                break;
        }
        return await response;
    } catch (error) {
        return {
            data: {
                isLoading: false,
                message: (error as Obj).message as string,
                success: false,
            },
        }
    }
}