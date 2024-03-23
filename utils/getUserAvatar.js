const noblox = require("noblox.js")

module.exports = async(userId) => {
    const avatar = await noblox.getPlayerThumbnail(userId, 420, "png", false)
    if(avatar === "https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_420x420.png") {
        return "https://img.favpng.com/0/16/15/woman-question-mark-female-png-favpng-JRuwedyFNNkcVvpqzN1dGbTEw.jpg"
    }
    return avatar;
}