import {Service} from "@tsed/di";
import {ITokenPayload, VerifyCallback} from "passport-azure-ad";
import {User} from "../models/User";
import {Logger, LogLevel, UserAgentApplication} from "msal";

require("dotenv").config();

/**
 * Customise this as required.  Remember that Azure handles most user authentication/authorization so what
 * happens here is only to provide functional benefits to the application.  The Azure auth happens in the
 * protocols / BearerStrategy class for passport-azure-ad.
 */
@Service()
export class AuthService {
    owner = null;
    scopes = process.env.Scopes ? process.env.Scopes.split(",") : [];

    static getClientId(): string {
        return process.env.clientId;
    }

    static getTenantId(): string {
        return process.env.tenantId;
    }

    add(token: ITokenPayload) {
        this.owner = token.oid;
    }

    async verify(token: ITokenPayload, options: any): Promise<User> {
        return new Promise((resolve, reject) => {

            if (token.tid !== AuthService.getTenantId()) {
                throw Error("TenantId is not the same");
            }
            if (token.aud !== AuthService.getClientId()) {
                throw Error("ClientId is not the same");
            }
            console.log(`verify - options: ${JSON.stringify(options)}, UseScopeLevelAuth: ${process.env.UseScopeLevelAuth}`);
            if (options && !options.scopes) {
                // This is the case when on the endpoint is "@OAuthBearer()" ie. no scope
                return resolve(token);
            }
            if (!(options && options.scopes && options.scopes.length > 0 && this.tokenInGivenOrApplicationScope(token.scp, options.scopes))) {
                const epScope = options && options.scopes && options.scopes.length > 0 ? options.scopes[0] : "null";
                const msg = `Scopes on endpoint: ${epScope} not same as in token: ${token.scp}`;
                console.error(msg);
                reject(msg);
            }
            return resolve(token);
        });
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
        allScopes.push(this.scopes[0]);

        return !tokensScope || allScopes.find(t => t === tokensScope) !== undefined;
    }
}
