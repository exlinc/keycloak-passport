module.exports = class KeycloakEnvConfig {
  constructor(inputOptions) {
    const defaultOptions = {
      host: process.env.KEYCLOAK_HOST,
      realm: process.env.KEYCLOAK_REALM,
      clientID: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      callbackURL: process.env.SITE_URL
    };
    const options = Object.assign(defaultOptions, inputOptions);
    this.update(options);
  }

  update(options) {
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
    this.authorizationURL = `${this.host}/auth/realms/${this.realm}/protocol/openid-connect/auth`;
    this.tokenURL = `${this.host}/auth/realms/${this.realm}/protocol/openid-connect/token`;
    this.userInfoURL = `${this.host}/auth/realms/${this.realm}/protocol/openid-connect/userinfo`;
  }
}