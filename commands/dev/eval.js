const { ApplicationCommandOptionType } = require("discord.js")
const { inspect } = require("util")


module.exports = {
    name: "eval",
    description: "evaluates code",
    devOnly: true,

    options: [
        {
            name: "code",
            description: "the code to evaluate",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async(client, interaction) => {
        const { options } = interaction;

        const input = options.getString('code');
        const evaluated = await eval(input);
        const out = inspect(evaluated);

        await interaction.reply({
            content: `\`\`\`${out}\`\`\``,
     
        }).catch((e) => {
            interaction.reply({
                content: `\`\`\`${e.message}\`\`\``,
            })
        })
    }
    }