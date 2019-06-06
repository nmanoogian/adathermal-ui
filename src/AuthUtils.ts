export class AuthUtils {
    static getAPIKey(): string | null {
        return localStorage.getItem("apiKey");
    }

    static setAPIKey(apiKey: string) {
        return localStorage.setItem("apiKey", apiKey);
    }

    static clearAPIKey() {
        localStorage.removeItem("apiKey");
    }
}
