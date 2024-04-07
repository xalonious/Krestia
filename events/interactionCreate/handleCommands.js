const { EmbedBuilder } = require("discord.js");
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
        if (!data?.hasRankPerms) {
            return interaction.reply("Only high ranks are able to use this command!");
        }
    }

    try {
        await commandObject.run(client, interaction);
    } catch (error) {

        if(error.message === 'Unknown interaction') return;

        const errChannelID = '1226530851131621468';
          const channel = client.channels.cache.get(errChannelID);   
        

          const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTimestamp()
          .setFooter({ text: 'Error Reported At' })
          .setTitle('Command Execution Error')
          .setDescription('An error occurred while executing a command.')
          .addFields(
            { name: '> •   Command', value: `\`\`\`${interaction.commandName}\`\`\`` },
            { name: '> •   Triggered By', value: `\`\`\`${interaction.user.username}\`\`\`` },
            { name: '> •   Error Stack', value: `\`\`\`${error.stack}\`\`\`` },
            { name: '> •   Error Message', value: `\`\`\`${error.message}\`\`\`` }
          );

          channel.send({ embeds: [embed] })



        if(interaction.replied || interaction.deferred) {
            interaction.followUp(`There was an error while running this command. An error report has been sent to the log channel.`);
        } else interaction.reply(`There was an error while running this command. An error report has been sent to the log channel.`);
        
    }
};
