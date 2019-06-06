import * as request from "request";
import * as t from "io-ts";
import {AuthUtils} from "../AuthUtils";
import {Nothing} from "../models/Nothing";

export type ApiResult<T> = { success: true, value: T } | { success: false, message: string };

export class API {
    public static readonly apiRoot = "https://thunder.ngrok.io/thermal";

    static headers(): request.Headers {
        return {"X-API-KEY": AuthUtils.getAPIKey()};
    }

    static resultFromResponse<T>(error: any, response: request.Response, ioType: t.Type<T, any, unknown>): ApiResult<T> {
        if (response != null && response.statusCode >= 200 && response.statusCode < 300) {
            let decodable: any = null;
            try {
                decodable = JSON.parse(response.body);
            } catch (e) {
                decodable = response.body;
            }
            return ioType.decode(decodable).fold<ApiResult<T>>(
                vErrors => ({success: false, message: vErrors.map(e => e.message).join(", ")}),
                value => ({success: true, value: value}),
            );
        } else {
            return {success: false, message: response.body || String(error) || "Unknown error"};
        }
    }

    static checkAuth(authString: string, callback: (result: ApiResult<Nothing>) => void) {
        request.get(`${this.apiRoot}/`, {headers: {"X-API-KEY" : authString}}, (error, response) => {
            callback(API.resultFromResponse(error, response, Nothing.ioType));
        });
    }

    static printText(text: string, callback: (result: ApiResult<Nothing>) => void) {
        request.post(`${this.apiRoot}/print`,
            {
                headers: API.headers(),
                json: {
                    body: text,
                },
            },
            (error, response) => {
                callback(API.resultFromResponse(error, response, Nothing.ioType));
            },
        );
    }
}
