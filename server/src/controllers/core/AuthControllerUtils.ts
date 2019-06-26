import {Req, Res} from "@tsed/common";
import * as Express from "express";
import {OAuthBearerOptions} from "../../protocols/BearerStrategy";

export class AuthControllerUtils {
    static handleAuthentication(@Req() request: Express.Request, @Res() response: Express.Response) {
        const scopes = request.ctx.endpoint.get(OAuthBearerOptions) || {"scopes": []};
        console.log(`helloWorld - request method: ${request.method}`);
        console.log(`====> check endpoint scopes: ${scopes}, ${JSON.stringify(scopes)}, ${typeof scopes}`);
        response.setHeader("Access-Control-Expose-Headers", "scopes");
        response.setHeader("scopes", JSON.stringify(scopes));
        if (request.method.toUpperCase() === "HEAD") {
            // we don't want to do any of the possibly intensive work if all this is is a HEAD request,
            // especially if the authorisation at the given scope is required
            console.log(`helloWorld - HEAD so end early`);
            response.end();
            // return;
        }
    }
}
