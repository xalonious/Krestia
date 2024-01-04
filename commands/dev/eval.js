const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")

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
        const code = interaction.options.getString("code")

        let output;

        try {
            output = await eval(code)
        } catch(error) {
            output = error.toString()
        }

        let replyString = `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n\n**Output:**\n\`\`\`js\n${output}\n\`\`\``

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(replyString)

        if(interaction.replied) {
            await interaction.editReply({ content: ``, embeds: [embed]})
        } else await interaction.reply({ embeds: [embed]})
    }
}