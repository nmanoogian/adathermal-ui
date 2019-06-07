import * as axios from "axios";
import * as t from "io-ts";
import {AuthUtils} from "../AuthUtils";
import {Nothing} from "../models/Nothing";

export type ApiResult<T> = { success: true, value: T } | { success: false, message: string };

export class API {
    public static readonly apiRoot = "https://thunder.ngrok.io/thermal";

    static headers(): any {
        return {"X-API-KEY": AuthUtils.getAPIKey()};
    }

    static resultFromResponse<T>(response: axios.AxiosResponse<any>, ioType: t.Type<T, any, unknown>): ApiResult<T> {
        if (response.status >= 200 && response.status < 300) {
            return ioType.decode(response.data).fold<ApiResult<T>>(
                vErrors => ({success: false, message: vErrors.map(e => e.message).join(", ")}),
                value => ({success: true, value: value}),
            );
        } else {
            return {success: false, message: String(response.data) || "Unknown error"};
        }
    }

    static resultFromError<T>(error: any): ApiResult<T> {
        return {success: false, message: String(error) || "Unknown error"};
    }

    static checkAuth(authString: string, callback: (result: ApiResult<Nothing>) => void) {
        axios.default.get(`${this.apiRoot}/`, {headers: {"X-API-KEY": authString}})
            .then(r => callback(API.resultFromResponse(r, Nothing.ioType)))
            .catch(e => callback(API.resultFromError(e)));
    }

    static printText(text: string, callback: (result: ApiResult<Nothing>) => void) {
        axios.default.post(`${this.apiRoot}/print`, {body: text}, {headers: API.headers()})
            .then(r => callback(API.resultFromResponse(r, Nothing.ioType)))
            .catch(e => callback(API.resultFromError(e)));
    }

    static printImage(fileData: Blob, callback: (result: ApiResult<Nothing>) => void) {
        const formData = new FormData();
        formData.append("file", fileData);
        axios.default.post(`${this.apiRoot}/print-image`, formData, {headers: API.headers()})
            .then(r => callback(API.resultFromResponse(r, Nothing.ioType)))
            .catch(e => callback(API.resultFromError(e)));
    }

    static printImageURL(imageUrl: string, callback: (result: ApiResult<Nothing>) => void) {
        axios.default.post(`${this.apiRoot}/print-image-url`, {url: imageUrl}, {headers: API.headers()})
            .then(r => callback(API.resultFromResponse(r, Nothing.ioType)))
            .catch(e => callback(API.resultFromError(e)));
    }
}
