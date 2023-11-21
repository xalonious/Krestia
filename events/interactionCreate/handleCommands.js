const devs = ["531479392128598027"];
const getLocalCommands = require("../../utils/getLocalCommands");
const staffDB = require("../../schemas/staffMember");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) return;

    if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
        return interaction.reply("Only Xander is able to use this command.");
    }

    if (commandObject.permissionsRequired?.every((permission) => !interaction.member.permissions.has(permission))) {
        return interaction.reply("You do not have permission to run that command!");
    }

    if (commandObject.highRankOnly) {
        const data = await staffDB.findOne({ userid: interaction.user.id });
        if (!data.hasRankPerms) {
            return interaction.reply("Only high ranks are able to use this command!");
        }
    }

    try {
        await commandObject.run(client, interaction);
    } catch (error) {
        interaction.reply(`There was an error while running this command: ${error}. Check the console for more details.`);
        console.log(error);
    }
};
