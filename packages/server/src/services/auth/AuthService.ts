import {Constant, Injectable, InjectContext} from "@tsed/di";
import {ITokenPayload} from "passport-azure-ad";
import {Context} from "@tsed/common";
import {TenantIdError} from "./errors/TenantIdError";
import {ClientIdError} from "./errors/ClientIdError";
import {InsufficientScopePermissions} from "./errors/InsufficientScopePermissions";

require("dotenv").config();

/**
 * Customise this as required.  Remember that Azure handles most user authentication/authorization so what
 * happens here is only to provide functional benefits to the application.  The Azure auth happens in the
 * protocols / BearerStrategy class for passport-azure-ad.
 */
@Injectable()
export class AuthService {
  @InjectContext()
  protected $ctx: Context;

  @Constant("passport.protocols.azure-bearer.settings")
  private settings: {
    scopes: string[],
    identityMetadata: string;
    clientID: string;
    validateIssuer: any;
    audience: string;
    loggingLevel: string;
    loggingNoPII: boolean;
    tenantId: string;
    useScopeLevelAuth: boolean;
  };

  #owner: string | null = null;

  add(token: ITokenPayload) {
    this.#owner = token.oid!;
  }

  verifyToken(token: ITokenPayload, options: { scopes?: string[] }): ITokenPayload {
    if (token.tid !== this.settings.tenantId) {
      throw new TenantIdError();
    }

    if (token.aud !== this.settings.clientID) {
      throw new ClientIdError();
    }

    this.$ctx.logger.info({
      event: "VERIFY_TOKEN",
      options,
      useScopeLevelAuth: this.settings.useScopeLevelAuth
    });

    const {scopes} = options;

    if (!scopes) {
      // This is the case when on the endpoint is "@OAuthBearer()" ie. no scope
      return token;
    }

    if (!(scopes && scopes.length && token.scp && this.tokenInGivenOrApplicationScope(token.scp, scopes))) {
      const requiredScope = scopes.length ? scopes[0] : null;

      throw new InsufficientScopePermissions(requiredScope, token.scp!);
    }


    return token;
  }

  /**
   * The scope passed in the bearer token should be confirmed as the one on the endpoint.  It also needs to allow
   * for the preflight HEAD requests that will use the application scope that all users must have.  It should be
   * the first scope listed in the environment variable 'Scopes', and these are available in this.scopes.
   *
   * @param tokensScope that comes in the bearer token and should have come from the
   *          \@OAuthBearer({scopes: [<token>, ..]}) on endpoint. It will be undefined if env.UseScopeLevelAuth
   *          is false.
   * @param endpointScopes are the scopes that came from the @OAuthBearer({scopes:[<tokens>, ..]}
   */
  private tokenInGivenOrApplicationScope(tokensScope: string, endpointScopes: string[]): boolean {
    let allScopes = endpointScopes.slice();
    allScopes.push(this.settings.scopes[0]);

    return !tokensScope || allScopes.find(t => t === tokensScope) !== undefined;
  }
}
