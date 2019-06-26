import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {AuthService} from "./core/azureAd/AuthService";
import {flatMap, map} from "rxjs/operators";
import {HttpClientService} from "./core/azureAd/HttpClientService";

const SERVER_URL = "http://localhost:8070";
const HELLO_AUTH = "/rest/hello-auth-world";
const HELLO_NO_AUTH = "/rest/hello-no-auth-world";

const SCOPE_BASE = "api://translationeditor-test";

interface HttpOptions {
    scopes: string[];
}

const ADD_SCOPE_BASE = (i => {
    if (i.search(SCOPE_BASE) === -1) {
        return SCOPE_BASE + "/" + i;
    }
});

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
                    console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
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
                    console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
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
