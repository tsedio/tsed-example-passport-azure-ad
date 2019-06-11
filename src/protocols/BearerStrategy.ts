import {Req, ServerSettingsService} from "@tsed/common";
import {registerFactory} from "@tsed/di";
import {AuthService} from "../services/AuthService";
import {BearerStrategy as PassportBearerStrategy, ITokenPayload, VerifyCallback} from "passport-azure-ad";
import * as Passport from "passport";

export const BearerStrategy = Symbol.for("BearerStrategy");
export const OAuthBearerOptions = Symbol.for("OAuthBearerOptions");

// Just to check if the authenticate is fired correctly
class CustomBearerStrategy extends PassportBearerStrategy {
  authenticate(req: Req, options?: object) {
    console.log("====>", req, options);
    console.log("====>", req.ctx.endpoint.get(OAuthBearerOptions));
    return super.authenticate(req, options);
  }
}

registerFactory({
  provide: BearerStrategy,
  deps: [AuthService, ServerSettingsService],
  useFactory: (authService: AuthService, settings: ServerSettingsService) => {
    const verify = async (req: Req, token: ITokenPayload, done: VerifyCallback) => {
      // Verify is the right place to check given token and return userinfo
      try {
        console.log("====> endpoint", req.ctx.endpoint);
        console.log("====> options", req.ctx.endpoint.get(OAuthBearerOptions));
        const options = req.ctx.endpoint.get(OAuthBearerOptions); // retrieve options configured for the endpoint

        // check precondition and authenticate user by his token and given options
        const user = await authService.authenticate(token, options);

        if (!user) {
          authService.add(token);
          return done(null, token);
        }

        return done(null, user, token);
      } catch (er) {
        return done(er);
      }
    };

    const strategy = new CustomBearerStrategy({
      ...settings.get("azureBearerOptions"),
      passReqToCallback: true  // !!!! IMPORTANT
    }, verify);

    Passport.use(strategy);

    return strategy;
  }
});

