const Suggestion = require("../../schemas/suggestion");
const formatResults = require("../../utils/formatResults");
module.exports = async(client, interaction) => {
    if(!interaction.isButton() || !interaction.customId) return;

    const [type, suggestionId, action] = interaction.customId.split(".")

    if(!type || !suggestionId || !action) return;
    if(type !== "suggestion") return;



    await interaction.deferReply({ ephemeral: true });

    const targetSuggestion = await Suggestion.findOne({ suggestionId })
    const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId)
    const targetMessageEmbed = targetMessage.embeds[0]


    if(action === "approve") {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return await interaction.editReply("You do not have permission to approve suggestions.")

        targetSuggestion.status = "approved"

        targetMessageEmbed.data.color = 0x84e660
        targetMessageEmbed.fields[1].value = "✅ Approved"


        await targetSuggestion.save()

        interaction.editReply("Suggestion approved!")

        targetMessage.edit({
            embeds: [targetMessageEmbed],
            components: [targetMessage.components[0]]
        })

        return;
    }

    if(action === "reject") {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return await interaction.editReply("You do not have permission to reject suggestions.")

        targetSuggestion.status = "rejected"

        targetMessageEmbed.data.color = 0xff6161
        targetMessageEmbed.fields[1].value = "❌ Rejected"

        await targetSuggestion.save()

        interaction.editReply("Suggestion rejected!")


        targetMessage.edit({
            embeds: [targetMessageEmbed],
            components: [targetMessage.components[0]]
        })

        return;
    }


    if(action === "upvote") {
        const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id)

        if(hasVoted) return await interaction.editReply("You have already voted on this suggestion.")

        targetSuggestion.upvotes.push(interaction.user.id)

        await targetSuggestion.save()

        interaction.editReply("Upvoted suggestion!")

        targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes)

        targetMessage.edit({ embeds: [targetMessageEmbed] })

        return;
    }


    if(action === "downvote") {
        const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id)

        if(hasVoted) return await interaction.editReply("You have already voted on this suggestion.")

        targetSuggestion.downvotes.push(interaction.user.id)

        await targetSuggestion.save()

        interaction.editReply("Downvoted suggestion!")

        targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes)

        targetMessage.edit({ embeds: [targetMessageEmbed] })

        return;
    }

}