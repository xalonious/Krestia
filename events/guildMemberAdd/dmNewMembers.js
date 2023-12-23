module.exports = async (client, guildMember) => {
    try {
        await guildMember.send("Thanks for joining the server! Please be sure to read the rules and join our roblox group if you haven't already! \n https://www.roblox.com/groups/16000842/Krestia-Caf#!/about")
    } catch(err) {
        return;
    }
}