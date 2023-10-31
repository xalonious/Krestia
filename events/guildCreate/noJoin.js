module.exports = (client, guild) => {
    if(guild.id !== "1074154728545583174") {
        guild.owner.send("I automatically left server " + guild.name + " As I am a private bot that is specifically made for Krestia. Do not try to add me to other servers.")
        guild.leave()
        console.log("Left server " + guild.name + " | 401 Unauthorized")
    }
}