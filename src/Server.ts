import {$log, GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as Session from "express-session";
import * as CookieParser from "cookie-parser";
import * as BodyParser from "body-parser";

const compress = require("compression");
const methodOverride = require("method-override");
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
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
    identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    clientID: "fakeclientid"
    // validateIssuer: config.creds.validateIssuer,
    // issuer: config.creds.issuer,
    // isB2C: config.creds.isB2C,
    // policyName: config.creds.policyName,
    // allowMultiAudiencesInToken: config.creds.allowMultiAudiencesInToken,
    // audience: config.creds.audience,
    // loggingLevel: config.creds.loggingLevel,
    // loggingNoPII: config.creds.loggingNoPII,
    // clockSkew: config.creds.clockSkew,
    // scope: config.creds.scope
  }
})
export class Server extends ServerLoader {
  $onMountingMiddlewares(): void {
    this
      .use(GlobalAcceptMimesMiddleware)
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
