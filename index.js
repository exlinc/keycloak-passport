const util = require('util');
const OAuth2Strategy = require('passport-oauth2');

function Strategy(options, verify) {
  [
    'host',
    'realm',
    'clientID',
    'clientSecret',
    'callbackURL',
    'authorizationURL',
    'tokenURL',
    'userInfoURL'
  ].forEach((k) => {
    if (!options[k]) {
      throw new Error(`${k} is required`);
    }
  });

  this.options = options;
  this._base = Object.getPrototypeOf(Strategy.prototype);
  this._base.constructor.call(this, this.options, verify);
  this.name = 'Keycloak';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2._useAuthorizationHeaderForGET = true;
  this._oauth2.get(this.options.userInfoURL, accessToken, (err, body) => {
    if (err) {
      return done(err);
    }

    try {
      const json = JSON.parse(body);
      const email = json.email;
      const userInfo = {
        keycloakId: json.sub,
        fullName: json.name,
        firstName: json.given_name,
        lastName: json.family_name,
        username: json.preferred_username,
        email,
        avatar: json.avatar,
        realm: this.options.realm,
      };

      done(null, userInfo);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = Strategy;