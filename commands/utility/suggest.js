const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Suggestion = require("../../schemas/suggestion");
const formatResults = require("../../utils/formatResults");
module.exports = {
    name: "suggest",
    description: "Suggest a feature for the server",

    run: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setTitle("Create a suggestion")
            .setCustomId(`suggestion-${interaction.user.id}`);

        const textInput = new TextInputBuilder()
            .setCustomId('suggestion-input')
            .setLabel("What would you like to suggest?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const actionRow = new ActionRowBuilder()
            .addComponents(textInput)

        modal.addComponents(actionRow)

        await interaction.showModal(modal)

        const filter = (i) => i.customId === `suggestion-${interaction.user.id}`

        const modalInteraction = await interaction.awaitModalSubmit({
            filter,
            time: 1000 * 60 * 5
        }).catch((error) => {
            console.log(error)
        })

        await modalInteraction.deferReply({ ephemeral: true })

        const suggestionsChannel = interaction.guild.channels.cache.get("1177712774684610600")

        let suggestionMessage = await suggestionsChannel.send("Creating suggestion...")

        const suggestionText = modalInteraction.fields.getTextInputValue("suggestion-input")

        const newSuggestion = new Suggestion({
            authorId: interaction.user.id,
            messageId: suggestionMessage.id,
            content: suggestionText,
            upvotes: [],
            downvotes: []
        })

        await newSuggestion.save()

        modalInteraction.editReply("Suggestion created!")

        const suggestionEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) })
            .addFields(
                { name: "Suggestions", value: suggestionText },
                { name: "Status", value: "⌛ Pending" },
                { name: "Votes", value: formatResults() }
            )
            .setColor("Yellow")

        const upvoteButton = new ButtonBuilder()
            .setEmoji("👍")
            .setLabel("Upvote")
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`)

        const downvoteButton = new ButtonBuilder()
            .setEmoji("👎")
            .setLabel("Downvote")
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`)

        const approveButton = new ButtonBuilder()
            .setEmoji("✅")
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`)

        const rejectButton = new ButtonBuilder()
            .setEmoji("❌")
            .setLabel("Reject")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`)

        const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton)
        const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton)


        suggestionMessage.edit({content: null, embeds: [suggestionEmbed], components: [firstRow, secondRow]})

        await suggestionMessage.startThread({
            name: `Discussion for ${interaction.user.username}'s Suggestion `,
            autoArchiveDuration: 1440, 
            reason: "Discussion thread for the suggestion"
        });
    }
}