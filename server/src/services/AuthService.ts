import {Service} from "@tsed/di";
import {ITokenPayload, VerifyCallback} from "passport-azure-ad";
import {User} from "../models/User";
import {Req} from "@tsed/common";

require("dotenv").config();

/**
 * Customise this as required.  Remember that Azure handles most user authentication/authorization so what
 * happens here is only to provide functional benefits to the application.  The Azure auth happens in the
 * protocols / BearerStrategy class for passport-azure-ad.
 */
@Service()
export class AuthService {
    users = [];
    owner = null;

    static getClientId(): string {
        return process.env.clientId;
    }

    static getTennanttId(): string {
        return process.env.tenantId;
    }

    add(token: ITokenPayload) {
        this.users.push(token);
        this.owner = token.oid;
    }

    async authenticate(token: ITokenPayload, options: any): Promise<User> {
        if (token.tid !== AuthService.getTennanttId()) {
            throw Error("TenantId is not the same");
        }
        if (token.aud !== AuthService.getClientId()) {
            throw Error("ClientId is not the same");
        }
        return this.verifyUser(token, options);
    }

    private async verifyUser(token: ITokenPayload, options: any): Promise<User> {
        return new Promise((resolve, reject) => {

            const findById = (id, fn) => {
                for (let i = 0, len = this.users.length; i < len; i++) {
                    const user = this.users[i];
                    if (user.oid === id) {
                        console.log("Auth - Found user: ", user);
                        return fn(null, user);
                    }
                }
                return fn(null, null);
            };

            console.log(`Auth - Verify user - token: ${JSON.stringify(token)}`);
            findById(token.oid, (err, user) => {
                if (err) {
                    return reject(err);
                }
                this.owner = token.oid;
                resolve(user);
            });
        });
    };
}
