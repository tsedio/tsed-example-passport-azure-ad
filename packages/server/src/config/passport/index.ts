const {
  clientId = "clientID", // FIXME CHANGE THE default CLIENT_ID
  tenantId,
  UseScopeLevelAuth,
  Scopes
} = process.env;

const level: "info" | "warn" | "error" = "info";
// Application specific scopes.  Define in .env file if to use scopes and what the scopes are
const scopes = UseScopeLevelAuth === "true" && Scopes ? (Scopes as string).split(",") : null;

export const passportConfig = {
  disableSession: true,
  protocols: {
    "azure-bearer": {
      settings: {
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
        useScopeLevelAuth: process.env.UseScopeLevelAuth,
        // clockSkew: config.creds.clockSkew,
        scopes,
        tenantId
      }
    }
  }
};
