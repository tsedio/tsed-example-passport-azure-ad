import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster";
import {AuthService} from "./AuthService";

const SERVER_URL = "http://localhost:8070";
const HELLO = "/rest/hello-world";

@Injectable()
export class HelloWorldService {

    constructor(private http: HttpClient, private authService: AuthService, private toast: ToasterService) {
    }

    async httpOptions(): Promise<any> {
        if (!SERVER_URL) {
            throw new Error(`httpOptions - server is not defined`);
        }
        const bearer = await this.authService.retrieveToken();
        return {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": SERVER_URL,
                Authorization: "Bearer " + bearer
            })
        };
    }

    /**
     * Return the human translate for the given data if any.
     * @param data of form - {language: eg. vi, english: english text to lookup an existing human translate for}
     * @return [error, value] where they are mutually exclusive.  Check for any error first.
     */
    async helloWorld(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {

            await this.http.get<any>(SERVER_URL + HELLO, await this.httpOptions() as object)
                .subscribe((value: any) => {
                    return resolve(value);
                }, (error) => {
                    this.handleError(error, "helloWorld");
                    reject(error);
                });
        });
    }

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
