const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
module.exports = {
    name: "addrole",
    description: "adds a role to a user",
    permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
    options: [
        {
            name: "member",
            description: "The member to add the role to",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "role",
            description: "The role to add",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],

    run: async(client, interaction) => {

        await interaction.deferReply();

        const role = interaction.options.getRole("role");
        const member = interaction.options.getMember("member");

        if(interaction.member.roles.highest.position <= role.position) return interaction.editReply({ content: "You cannot add a role that is above your highest role."})


        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.editReply({ content: "You cannot add a role to someone with a higher role than you"})

        if(member.roles.cache.has(role.id)) return interaction.reply({ content: `${member.user.username} already has the role ${role.name}`})


        member.roles.add(role);

        interaction.editReply({ content: `Successfully added the role ${role.name} to ${member.user.username}.` })
    }
}