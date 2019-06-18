import {$log, GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as Session from "express-session";
import * as CookieParser from "cookie-parser";
import * as BodyParser from "body-parser";
import * as cors from "cors";

const compress = require("compression");
const methodOverride = require("method-override");
const rootDir = __dirname;

require("dotenv").config();

type levelType = "info" | "warn" | "error";
const level: levelType = "info";

// In a local dev environment add these to a .env file (but don't commit it)
// In Azure add these as application settings
const clientId = process.env.clientId;
const tenantId = process.env.tenantId;

// Application specific scopes
const scopes = ["ted.translations.search"];

@ServerSettings({
    rootDir,
    acceptMimes: ["application/json"],
    port: process.env.PORT || "8070",
    httpsPort: process.env.HTTPSPORT || "8001",
    logger: {
        debug: false,
        logRequest: true,
        requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
    },
    componentsScan: [
        `${rootDir}/protocols/**/*.ts`,
        `${rootDir}/services/**/*.ts`,
        `${rootDir}/middlewares/**/*.ts`
    ],
    swagger: {
        path: "/api-docs"
    },
    calendar: {
        token: true
    },
    passport: {},
    azureBearerOptions: {
        identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
        clientID: clientId,
        validateIssuer: true,
        // issuer: config.creds.issuer,
        // isB2C: config.creds.isB2C,
        // policyName: config.creds.policyName,
        // allowMultiAudiencesInToken: config.creds.allowMultiAudiencesInToken,
        audience: clientId,
        loggingLevel: level,
        loggingNoPII: false,
        // clockSkew: config.creds.clockSkew,
        scope: scopes
    }
})
export class Server extends ServerLoader {
    $onMountingMiddlewares(): void {
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cors({origin: "*"}))
            .use(CookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(BodyParser.json())
            .use(BodyParser.urlencoded({
                extended: true
            }))
            .use(Session({
                secret: "mysecretkey",
                resave: true,
                saveUninitialized: true,
                cookie: {
                    path: "/",
                    httpOnly: false,
                    secure: false,
                    maxAge: null
                }
            }));
    }

    $onReady() {
        $log.debug("Server initialized");
    }

    $onServerInitError(error): any {
        $log.error("Server encounter an error =>", error);
    }
}
