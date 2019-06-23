import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {AuthService} from "./AuthService";
import {first, filter, map, catchError, tap} from "rxjs/operators";

const SERVER_URL = "http://localhost:8070";
const HELLO = "/rest/hello-world";
const AUTH = "/rest/hello-auth";
const HEAD_AUTH = "/rest/hello-head-auth";

interface HttpOptions {
    scopes: string[];
}

@Injectable()
export class HelloWorldService {

    constructor(private http: HttpClient, private authService: AuthService, private toast: ToasterService) {
    }

    async httpOptions(options: HttpOptions = {scopes: []}): Promise<any> {
        if (!SERVER_URL) {
            throw new Error(`httpOptions - server is not defined`);
        }
        console.log(`httpOptions - given scopes: ${JSON.stringify(options.scopes)}`);
        const bearer = await this.authService.retrieveToken(options.scopes);
        return {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": SERVER_URL,
                Authorization: "Bearer " + bearer,
            })
        };
    }

    async helloWorld(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let scopes = undefined;
            await this.http.head<any>(SERVER_URL + HELLO, {observe: "response", ...await this.httpOptions() as object})
            // .subscribe((response: any) => {
            //     scopes = response.headers.get("scopes");
            //     console.log(`helloWorld HEAD - scopes: ${JSON.stringify(scopes)}`);
            // }, (error) => {
            //     this.handleError(error, "helloWorld");
            //     reject(error);
            // });
            // console.log(`helloWorld - scopes: ${JSON.stringify(scopes)}`);
                .pipe(map(response => {
                        const scopesIn = response.headers.get("scopes");
                        const scopes = typeof scopesIn === "string" ? JSON.parse(scopesIn) : scopesIn
                        console.log(`  mscopes: ${scopes}`);
                        return scopes.scopes;
                    }),
                    map(async requestScopes => {
                        const scopes = requestScopes.join(" ");
                        console.log(`  helloWorld observabale - scopes: ${JSON.stringify(scopes)}`);
                        return this.http.get<any>(SERVER_URL + HELLO, {
                            observe: "response", ...await this.httpOptions({scopes}) as object
                        });
                        // .subscribe((value: any) => {
                        //     console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
                        //     return resolve(value);
                        // }, (error) => {
                        //     this.handleError(error, "helloWorld");
                        //     reject(error);
                        // });
                    }))
                .subscribe((value: any) => {
                    console.log(`SERVER_URL + HELLO get: ${JSON.stringify(value)}`);
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
            ;
        });
    }

    /*
    async;
    helloAuth();
    :
    Promise < any > {
        return new Promise<any>(async (resolve, reject) => {

            await this.http.head<any>(SERVER_URL + HEAD_AUTH, {observe: "response", ...await this.httpOptions() as object})
                .subscribe((value: any) => {
                    console.log(`helloAuth head - value: ${JSON.stringify(value)}`);
                    // return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloAuth head");
                    reject(error);
                });

            await this.http.get<any>(SERVER_URL + AUTH, {observe: "response", ...await this.httpOptions() as object})
                .subscribe((value: any) => {
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloAuth");
                    reject(error);
                });
        });
    }
    */

    private handleError(error, where) {
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
