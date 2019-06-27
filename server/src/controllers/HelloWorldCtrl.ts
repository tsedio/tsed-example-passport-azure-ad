import {BodyParams, Controller, Get, Head, Post, Req, Res} from "@tsed/common";
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

    @Head("/post-auth-scoped")
    @OAuthBearer({scopes: ["tester"]})
    postAuthHead(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
    }

    @Post("/post-auth-scoped")
    postAuth(@Req() request: Express.Request, @Res() response: Express.Response
        , @BodyParams() message: any) {
        return {text: "Auth w Scopes: " + message.text};
    }

    @Head("/post-auth-not-scoped")
    @OAuthBearer()
    postAuthNotScopedHead(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
    }

    @Post("/post-auth-not-scoped")
    postAuthNotScoped(@Req() request: Express.Request, @Res() response: Express.Response
        , @BodyParams() message: any) {
        return {text: "Auth wout Scopes: " + message.text};
    }

    @Head("/post-no-auth")
    postNoAuthHead(@Req() request: Express.Request, @Res() response: Express.Response) {
        AuthControllerUtils.handleAuthentication(request, response);
    }

    @Post("/post-no-auth")
    postNoAuth(@Req() request: Express.Request, @Res() response: Express.Response
        , @BodyParams() message: any) {
        return {text: "No Auth: " + message.text};
    }
}
