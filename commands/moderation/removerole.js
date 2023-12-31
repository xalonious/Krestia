const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
module.exports = {
    name: "removerole",
    description: "removes a role from a user",
    permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
    options: [
        {
            name: "member",
            description: "The member to remove the role from",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "role",
            description: "The role to remove",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],

    run: async(client, interaction) => {

        await interaction.deferReply();

        const role = interaction.options.getRole("role");
        const member = interaction.options.getMember("member");

        if(interaction.member.roles.highest.position <= role.position) return interaction.editReply({ content: "You cannot remove a role that is above your highest role."})


        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.editReply({ content: "You cannot remove a role from someone with a higher role than you"})

        if(!member.roles.cache.has(role.id)) return interaction.reply({ content: `${member.user.username} does not have the role ${role.name}`})


        member.roles.remove(role);

        interaction.editReply({ content: `Successfully removed the role ${role.name} from ${member.user.username}.` })
    }
}