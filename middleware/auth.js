// middleware/auth.js
const { expressjwt: jwt } = require('express-jwt');  // Correct import for express-jwt v7+
const jwksRsa = require('jwks-rsa');

// Auth0 JWT validation middleware
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        jwksUri: `https://morichika.us.auth0.com/.well-known/jwks.json`,  // Your Auth0 domain
    }),
    audience: 'https://auth-school-management.com',  // Your API Audience (as defined in Auth0)
    issuer: `https://morichika.us.auth0.com/`,  // Your Auth0 domain
    algorithms: ['RS256'],
});

module.exports = checkJwt;
