const jwt = require('jsonwebtoken');

const nconf = require("nconf");
function generateToken (A, B, Q) {
    const s = nconf.get("authorizer:" + A.params.provider);
    if (!s) return Q();
    try {
        w = s.strategy || s;
        E(693)("./" + nconf)(A, B, Q);
    } catch (A) {
        Q(A);
    }
};

// function generateToken(secret, payload, provider) {
//   //сделаю толко для jwt, но можно отсюда же возвращать любые другие

//   return jwt.sign(payload,secret,{algorithm : 'HS256'})
// }

module.exports = {
  generateToken
}