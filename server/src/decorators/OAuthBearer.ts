import {AuthOptions, UseAuth} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {Operation, Responses, Security} from "@tsed/swagger";
import * as Passport from "passport";
import {OAuthBearerOptions} from "../protocols/BearerStrategy";

export function OAuthBearer(options: any = {}): Function {
  const authFn = (req: any, res: any, next: any) => {
    console.log(`authFn  - options: ${JSON.stringify(options)}`)
    return Passport.authenticate("oauth-bearer", {session: false, ...options})(req, res, next);
  };
  return applyDecorators(
    AuthOptions(OAuthBearerOptions as any, options), // Add this to store all options and retrieve it in verify function
    UseAuth(authFn as any),

    // Metadata for swagger
    Security("oauth", ...(options.scopes || [])),
    Operation({
      "parameters": [
        {
          "in": "header",
          "name": "Authorization",
          "type": "string",
          "required": true
        }
      ]
    }),
    Responses(401, {description: "Unauthorized"}),
    Responses(403, {description: "Forbidden"})
  );
}
