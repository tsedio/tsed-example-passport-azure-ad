import {Injectable} from "@angular/core";
import {Logger, LogLevel, UserAgentApplication} from "msal";
import {ToasterService} from "angular2-toaster";
import {HttpClient} from "@angular/common/http";
import {AuthenticationParameters} from "msal/src/AuthenticationParameters";

const Uri = "http://localhost:4201";

/**
 * Azure Auth using Microsoft Auth Login
 *
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
 *
 * Roles to be setup as per
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-enterprise-app-role-management
 *
 * Then add the roles as claims to the scopes sent to acquireTokenSilent() in retrieveToken() below.
 *
 * Auth information for your tennant can be found at
 * https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration
 */
@Injectable()
export class AuthService {
    private msal = null;
    idToken;
    clientId = "<insert client id from Azure App Registration>"

    constructor(private toast: ToasterService, private http: HttpClient) {
    }

    private async setup(): Promise<void> {
        return new Promise(async (resolve) => {

            const loggerCallback = (logLevel, message, containsPii) => {
                console.log(`Auth: [${logLevel} ${message}`);
            };
            const singleMessage = (location) => {
                return (message) => {
                    console.log(`Auth - ${location}: ${message}`);
                };
            };
            const logger = new Logger(
                loggerCallback,
                {correlationId: "1234", level: LogLevel.Info, piiLoggingEnabled: true});

            this.msal = new UserAgentApplication(
                {
                    auth: {
                        clientId: this.clientId,
                        authority: "https://login.microsoftonline.com/organizations",    //
                        redirectUri: Uri + "/login",
                    },
                    cache: {
                        cacheLocation: "localStorage",
                        storeAuthStateInCookie: true
                    },
                    system: {
                        logger
                    }
                }
            );

            console.log(`client setup - msal: ${JSON.stringify(this.msal)}`);
            resolve();
        });
    }

    async signIn() {
        return new Promise(async (resolve, reject) => {
            if (!this.msal) {
                await this.setup();
            }
            const scopes: AuthenticationParameters = {scopes: ["user.read"]};   // api://translationeditor-test/ted.translations.search']};
            this.msal.loginPopup(scopes).then(authResponse => {
                    this.idToken = authResponse.idToken.rawIdToken;
                    console.log(`loginPopup - idToken: ${JSON.stringify(this.idToken)}`);
                    return resolve(this.idToken);
                },
                error => {
                    const msg = `error from loginPopup: ${error}`;
                    console.error(msg);
                    this.toast.pop("error", "sign in", msg);
                    // throw error;
                    return reject(error);
                });
        });
    }

    async retrieveToken(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            // if the user is already logged in you can acquire a token, if not log them in first
            if (!this.msal && !this.msal.getAccount()) {
                await this.signIn();
            }
            // return resolve(this.idToken);
            // TODO CHANGE THIS TO SOMETHING ELSE BEFORE COMMITTING
            const scopes: AuthenticationParameters = {scopes: ["api://translationeditor-test/ted.translations.search"]};
            console.log(`Auth - Sign in with scopes: ${JSON.stringify(scopes)}`);
            return this.msal.acquireTokenSilent(scopes)
                .then(authResponse => {
                    const token = authResponse.accessToken;
                    console.log(`acquireTokenSilent- accessToken: ${token}`);
                    if (this.tokenIsExpired(authResponse.expiresOn)) {
                        // I don't know why this happens and
                        this.msal = null;
                        return this.retrieveToken();
                    }
                    return resolve(token);
                })
                .catch(error => {
                    console.error(`Caught acquireTokenSilent error: ${error}`);
                    return this.msal.acquireTokenPopup(scopes)
                        .then(authResponse => {
                            const token = authResponse.accessToken;
                            console.log(`acquireTokenPopup- accessToken: ${token}`);
                            return resolve(token);
                        })
                        .catch(err => {
                            return reject(new Error(`Error - something weird going on: ${err}`));
                        });
                });
        });
    }

    private tokenIsExpired(expiresOn: string): boolean {
        const now = new Date();
        const expiresOnDate = new Date(expiresOn);
        const expired = now.getTime() - expiresOnDate.getTime() > 0;

        console.log(`Check if tokenIsExpired - expiry: ${expiresOn} date: ${new Date()} - has expired?: ${expired} (Code for this TBD)`);
        return false;   // Don't want to do anything until fully tested and code written
    }
}
