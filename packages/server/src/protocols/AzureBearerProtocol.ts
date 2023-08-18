import {Context, Inject} from "@tsed/common";
import {Arg, OnVerify, PassportMiddleware, Protocol} from "@tsed/passport";
import {BearerStrategy, ITokenPayload} from "passport-azure-ad";
import {AuthService} from "../services/auth/AuthService";

@Protocol({
  name: "azure-bearer",
  useStrategy: BearerStrategy
})
export class AzureBearerProtocol implements OnVerify {
  @Inject()
  protected authService: AuthService;

  $onVerify(@Arg(0) token: ITokenPayload, @Context() ctx: Context) {
    // Verify is the right place to check given token and return UserInfo
    const {authService} = this;
    const {options = {}} = ctx.endpoint.get(PassportMiddleware) || {}; // retrieve options configured for the endpoint
    // check precondition and authenticate user by their token and given options
    try {
      const user = authService.verifyToken(token, options);

      if (!user) {
        authService.add(token);

        ctx.logger.info({
          event: "AZURE_BEARER_PROTOCOL_TOKEN",
          token
        });

        return token;
      }

      ctx.logger.info({
        event: "AZURE_BEARER_PROTOCOL_USER",
        token,
        user
      });

      return [user, token];
    } catch (error) {
      ctx.logger.error({
        event: "AZURE_BEARER_PROTOCOL_ERROR",
        token,
        error
      });

      throw error;
    }
  }
}
