import {Controller, Get, Head, Req, Res} from "@tsed/common";
import {OAuthBearer} from "../decorators/OAuthBearer";
import * as Express from "express";
import {AuthControllerUtils} from "./core/AuthControllerUtils";

@Controller("/rest")
export class HelloWorldCtrl {

    @Get("/hello-auth-world")
    @OAuthBearer({"scopes": ["tester"]})
    helloAuthScopesWorld(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
        return {text: "hello world with scopes"};
    }

    @Get("/hello-auth-world-no-scope")
    @OAuthBearer()
    helloAuthNoScopesWorld(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
        return {text: "hello world auth but no scopes"};
    }

    @Get("/hello-no-auth-world")
    helloNoAuthWorld(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
        return {text: "hello world with no authorisation"};
    }
}
