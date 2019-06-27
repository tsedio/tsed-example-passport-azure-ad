import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {HttpClientService} from "./core/azureAd/HttpClientService";

const SERVER_URL = "http://localhost:8070";
const HELLO_AUTH = "/rest/hello-auth-world";
const HELLO_AUTH_NO_SCOPE = "/rest/hello-auth-world-no-scope";
const HELLO_NO_AUTH = "/rest/hello-no-auth-world";
const POST_AUTH_SCOPED = "/rest/post-auth-scoped";
const POST_AUTH_NOT_SCOPED = "/rest/post-auth-not-scoped";
const POST_NO_AUTH = "/rest/post-no-auth";

@Injectable()
export class HelloWorldService {

    // constructor(private http: HttpClient, private authService: AuthService, private toast: ToasterService) {
    constructor(private httpClientService: HttpClientService, private toast: ToasterService) {
        httpClientService.setServer(SERVER_URL);
    }

    async helloAuthWorld(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.get(SERVER_URL + HELLO_AUTH, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`helloAuthWorld: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    async helloAuthWorldNoScope(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.get(SERVER_URL + HELLO_AUTH_NO_SCOPE, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`helloAuthWorldNoScope: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    async helloNoAuthWorld(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.get(SERVER_URL + HELLO_NO_AUTH, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`helloNoAuthWorld: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    async postAuthCallScoped(message: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.post(SERVER_URL + POST_AUTH_SCOPED, message, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`postAuthCallScoped: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    async postAuthCallNoScope(message: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.post(SERVER_URL + POST_AUTH_NOT_SCOPED, message, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`postAuthCallNoScope: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    async postNoAuthCall(message: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.httpClientService.post(SERVER_URL + POST_NO_AUTH, message, {scopesApplied: true})
                .subscribe((value: any) => {
                    console.log(`postNoAuthCall: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

    private handleError(error, where): any {
        let msg;
        if (error.status === 403) {
            msg = `Unauthorized: ${JSON.stringify(error)}`;
        } else {
            msg = JSON.stringify(error);
        }
        console.error(msg);
        this.toast.pop("error", where, msg);
    }
}
