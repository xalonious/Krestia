module.exports = (client, interaction) => {
    if (!interaction.isButton()) return;

    const { customId, member } = interaction;

    const roles = {
        "he/him": "1089488704298557471",
        "she/her": "1089488681770962944",
        "they/them": "1089488716705300510",
        "other": "1089489029474562151",
        "announcements": "1091074387777687612",
        "alliances": "1089490246590283816",
        "events": "1089490252021891204",
        "sessions": "1089490248876163072",
        "giveaway": "1089490247508836483",
        "development": "1089490257470292058",
        "qotd": "1089490233516642434",
        "deadchat": "1178451425865519315"
    };


    if (!Object.keys(roles).includes(customId)) return;

    const role = interaction.guild.roles.cache.get(roles[customId]);
    if (!role) return;

    if (member.roles.cache.has(role.id)) {
        member.roles.remove(role);
        interaction.reply({ content: "Role removed successfully.", ephemeral: true });
    } else {
        member.roles.add(role);
        interaction.reply({ content: "Role added successfully.", ephemeral: true });
    }
};
