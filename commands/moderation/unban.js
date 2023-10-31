const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");


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


        run : async(client, interaction) => {
        
           const tar = interaction.options.getString("user")


        try {
            const user = await interaction.guild.members.unban(tar)
            return interaction.reply(`Succesfully unbanned user ${user.user.tag}`)
        } catch {
            return interaction.reply({
                content: "The user id is invalid or the user is not banned.",
                ephemeral: true
            })
        }
    }
}