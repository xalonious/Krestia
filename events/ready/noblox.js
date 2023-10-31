const noblox = require("noblox.js")

module.exports = (client) => {
    noblox.setCookie(process.env.COOKIE).then((user) => console.log(`✅  | Logged in as ${user.UserName}`));
}