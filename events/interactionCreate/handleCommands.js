const devs = ["531479392128598027"]
const getLocalCommands = require("../../utils/getLocalCommands")
const staffDB = require("../../schemas/staffMember")


module.exports = async(client, interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const localCommands = getLocalCommands()

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName)

        if(!commandObject) return;

        if(commandObject.devOnly) {
            if(!devs.includes(interaction.member.id)) {
                return interaction.reply("Only Xander is able to use this command.")
            }

        }

        if(commandObject.permissionsRequired?.length) {
            for(const permission of commandObject.permissionsRequired) {
                if(!interaction.member.permissions.has(permission)) {
                    return interaction.reply("You do not have permission to run that command!")
                }
            }
        }

        if(commandObject.highRankOnly) {
            const data = await staffDB.findOne({ userid: interaction.user.id})
            if(!data) return interaction.reply(`Failed to authenticate identity: you were not found in the staff database. Please run the verify command before running this command.`)
            
            if(!data.hasRankPerms) return interaction.reply("Only high ranks are able to use this command!")
        }

        await commandObject.run(client, interaction)

    } catch (error) {
        interaction.reply(`There was an error while running this command: ${error}. Check the console for more details.`)
        console.log(error)
    }
}