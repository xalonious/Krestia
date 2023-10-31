
module.exports = {
    name: "ping",
    description: "Returns bot latency",

    run: async(client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping} ms`)
    }
}