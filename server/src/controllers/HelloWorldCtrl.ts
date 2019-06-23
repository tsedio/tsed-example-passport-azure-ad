import {Controller, Get, Head, Req, Res} from "@tsed/common";
import {OAuthBearer} from "../decorators/OAuthBearer";
import * as Express from "express";
import {OAuthBearerOptions} from "../protocols/BearerStrategy";

@Controller("/rest")
export class HelloWorldCtrl {

    // @Head("/hello-world")
    // helloWorld_head(@Req() request: Express.Request, @Res() response: Express.Response) {
    //     console.log(`helloWorld_head - request method: ${request.method}`);
    //     response.setHeader("Access-Control-Expose-Headers", "scope");
    //     response.setHeader("scope", "chilli");
    // }

    @Get("/hello-world")
    @OAuthBearer({"scopes": ["tester"]})
    helloWorld(@Req() request: Express.Request, @Res() response: Express.Response) {
        const scopes = request.ctx.endpoint.get(OAuthBearerOptions);
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
        return {text: "Hello world"};
    }

    @Get("/hello-auth")
    @OAuthBearer({"scopes": ["testerx"]})
    helloAuth(@Req() request: Express.Request, @Res() response: Express.Response) {
        console.log(`helloAuth - request method: ${request.method}`);
        return {text: "Authorised hello"};
    }

    @Get("/hello-head-auth")
    helloAuthPreflight(@Req() request: Express.Request, @Res() response: Express.Response) {
        console.log(`helloAuthPreflight - request method: ${request.method}`);
        response.set("scope", "bananaadmin");   //.send({scope: "macaroni"}); //.status(200).end();
        return {scope: "macaroni"};
    }
}
