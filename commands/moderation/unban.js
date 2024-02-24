const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");
require("dotenv").config()

module.exports = {
    name: "unban",
    description: "unbans a user",
    permissionsRequired: [PermissionsBitField.Flags.BanMembers],
     options: [
        {
            name: "user",
            description: "the id of the user you want to ban",
            type: ApplicationCommandOptionType.String,
            required: true
        }
     ],


     run: async (client, interaction) => {
        const tar = interaction.options.getString("user");
    
        try {
            await interaction.guild.members.unban(tar);
            const user = await client.users.fetch(tar);

            const logEmbed = new EmbedBuilder()
                .setTitle('User unbanned')
                .setDescription('Someone was unbanned from the server')
                .addFields(
                    {name: "Unbanned user", value: `${user.tag}`},
                    {name: "Unbanned by", value: `${interaction.user.tag}`}
                )
                .setColor('Green');

            const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN);
            logschan.send({ embeds: [logEmbed] });

            return interaction.reply(`Successfully unbanned user ${user.tag}`);
        } catch(error) {
            console.log(error)
            return interaction.reply({
                content: "The user ID is invalid or the user is not banned.",
                ephemeral: true
            });
        }
    }
}