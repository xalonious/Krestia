const akinator = require("discord.js-akinator")


module.exports = {
    name: "akinator",
    description: "Play a game of akinator",

    run : async(client, interaction) => {
        akinator(interaction, {
            useButtons: true
        })
    }
}