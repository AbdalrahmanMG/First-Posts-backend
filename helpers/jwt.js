const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/posts(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

// async function isRevoked(req, payload) {
//   if (payload.payload.isAdmin == false) {
//     console.log("not Admin");
//     return true;
//   }
//   console.log("Admin");
//   return false;
// }

module.exports = authJwt;
