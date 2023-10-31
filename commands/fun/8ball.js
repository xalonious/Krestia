const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "8ball",
    description: "ask the magic 8ball a question",
    options: [
        {
            name: "question",
            description: "The question you want to ask",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run : async(client, interaction) => {
        const responses = [
            "It is certain",
            "Without a doubt",
            "You may rely on it",
            "Yes, definitely",
            "It is decidedly so",
            "As I see it, yes",
            "Most likely",
            "Yes",
            "Outlook good",
            "Signs point to yes",
            "Reply hazy, try again",
            "Better not tell you now",
            "Ask again later",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "Outlook not so good",
            "My sources say no",
            "Very doubtful",
            "My reply is no"
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];

          interaction.reply(randomResponse)
    }
}