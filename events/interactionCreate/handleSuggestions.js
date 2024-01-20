const Suggestion = require("../../schemas/suggestion");
const formatSuggestionResults = require("../../utils/formatSuggestionResults");
module.exports = async(client, interaction) => {
    if(!interaction.isButton() || !interaction.customId) return;

    const [type, suggestionId, action] = interaction.customId.split(".")

    if(!type || !suggestionId || !action) return;
    if(type !== "suggestion") return;



    await interaction.deferReply({ ephemeral: true });

    const targetSuggestion = await Suggestion.findOne({ suggestionId })
    const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId)
    const targetMessageEmbed = targetMessage.embeds[0]

    const permRoles = ["1089484325931720734", "1089485004654006272"]
    const hasPerms = interaction.member.roles.cache.some(role => permRoles.includes(role.id))

    const hasUpvoted = targetSuggestion.upvotes.includes(interaction.user.id);
    const hasDownvoted = targetSuggestion.downvotes.includes(interaction.user.id);


    if(action === "approve") {
        if(!hasPerms) return await interaction.editReply("You do not have permission to approve suggestions.")

        targetMessageEmbed.data.color = 0x84e660
        targetMessageEmbed.fields[1].value = "✅ Approved"


        interaction.editReply("Suggestion approved!")

        targetMessage.edit({
            embeds: [targetMessageEmbed],
            components: []
        })

        await targetSuggestion.deleteOne()

        return;
    }

    if(action === "reject") {
        if(!hasPerms) return await interaction.editReply("You do not have permission to reject suggestions.")

        targetMessageEmbed.data.color = 0xff6161
        targetMessageEmbed.fields[1].value = "❌ Rejected"


        interaction.editReply("Suggestion rejected!")


        targetMessage.edit({
            embeds: [targetMessageEmbed],
            components: []
        })

        await targetSuggestion.deleteOne()

        return;
    }


    if(action === "upvote") {

        if(hasUpvoted) {
            return interaction.editReply("You have already upvoted this suggestion.")
        }

        if(hasDownvoted) {
            targetSuggestion.downvotes = targetSuggestion.downvotes.filter(id => id !== interaction.user.id)
        }

        targetSuggestion.upvotes.push(interaction.user.id)

        await targetSuggestion.save()

        interaction.editReply("Upvoted suggestion!")

        targetMessageEmbed.fields[2].value = formatSuggestionResults(targetSuggestion.upvotes, targetSuggestion.downvotes)

        targetMessage.edit({ embeds: [targetMessageEmbed] })

        return;
    }


    if(action === "downvote") {

        if(hasDownvoted) {
            return interaction.editReply("You have already downvoted this suggestion.")
        }

        if(hasUpvoted) {
            targetSuggestion.upvotes = targetSuggestion.upvotes.filter(id => id !== interaction.user.id)
        }

        targetSuggestion.downvotes.push(interaction.user.id)

        await targetSuggestion.save()

        interaction.editReply("Downvoted suggestion!")

        targetMessageEmbed.fields[2].value = formatSuggestionResults(targetSuggestion.upvotes, targetSuggestion.downvotes)

        targetMessage.edit({ embeds: [targetMessageEmbed] })

        return;
    }

}