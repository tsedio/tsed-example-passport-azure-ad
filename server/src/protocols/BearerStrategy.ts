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
        // console.log("====>", req, options);
        console.log("====> OAuthBearerOptions: ", req.ctx.endpoint.get(OAuthBearerOptions));
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
                // console.log("====> endpoint", req.ctx.endpoint);
                const options = req.ctx.endpoint.get(OAuthBearerOptions); // retrieve options configured for the endpoint
                console.log("====> options", options);

                // check precondition and authenticate user by their token and given options
                const user = await authService.verify(token, options)
                    .catch(error => {
                        return done(error);
                    });

                if (!user) {
                    authService.add(token);
                    console.log("BearerStrategy - New user added automatically: ", token.oid);
                    return done(null, token);
                }
                console.log("BearerStrategy - Found user: ", JSON.stringify(token));
                return done(null, user, token);
            } catch (error) {
                return done(error);
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

