import { SlashCommandBuilder } from '@discordjs/builders'
import { DiscordAPIError, MessageEmbed } from 'discord.js';
import Reaction from "../models/Reaction.js"
import logger from '../util/logging.js';
import ReactionMessage from "../models/ReactionMessage.js"


const deleteReaction = {
    data: new SlashCommandBuilder()
        .setName('delete-reaction')
        .setDescription('Deletes a reaction from an already created reaction message')
        .addStringOption(option => option.setName('messageid').setDescription('The target message ID').setRequired(true))
        .addStringOption(option => option.setName('existingreaction').setDescription('The Emoji to remove').setRequired(true))
        .addStringOption(option => option.setName('roleschannel').setDescription('Optional name of the channel the message is in (default reaction-roles)')),

    async execute(interaction) {
        try {

            // return from the interaction if the user doesn't have the admin role
            if (!interaction.member.roles.cache.some(role => role.name === process.env.DISCORDADMIN)) {
                interaction.reply({ content: "Only an admin can do this." })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Check that the reaction-roles channel exists or whatever channel the user specified
            const channelname = await interaction.options.getString('roleschannel') || "reaction-roles";
            const reactionsChannel = await interaction.guild.channels.cache.find(channel => channel.name === channelname);

            // Check that the message exists - if not it will throw an api error handled in the catch
            const messageId = await interaction.options.getString('messageid');
            const messageToEdit = await reactionsChannel.messages.fetch(messageId)
            const reaction = await interaction.options.getString('existingreaction');
            const guildId = interaction.guild.id


            // If it's a custom emoji we need to strip its id
            let emojiId = reaction;
            if (reaction.includes(">")) {
                emojiId = reaction.substring(
                    reaction.lastIndexOf(":") + 1,
                    reaction.lastIndexOf(">")
                )
            }

            // Check that the emoji exists in the database
            const [[reactionDatabaseId]] = await Reaction.fetchReactionByName(reaction, guildId);
            if (!reactionDatabaseId) {
                interaction.reply({ content: "I can't find that Emoji in the database. Please double check that you are removing the right one." })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // delete the emoji from the database
            const results = await Reaction.deleteById(reactionDatabaseId.id)
            logger.log({ level: 'info', message: results }) // log the database results in case I ever need it later

            // delete the reactions from the message
            await messageToEdit.reactions.cache.get(emojiId).remove()

            // reconstruct the message and replace the embed
            // Get the existing notes for the embed from the db
            const [[messageData]] = await ReactionMessage.fetchNotesById(messageId)
            const notes = messageData.notes

            // get all the reactions for the embed 
            const [allReactions] = await Reaction.fetchAllReactionsForMessage(messageId)
            // console.log(allReactions)

            // Construct a new file with the description and the reactions
            let newMessage = ``
            newMessage += `${notes}\n\n-------------------------\n\n`

            for (let item of allReactions) {
                newMessage += `${item.emoji} - <@&${item.role}>\n`
            }

            // Grab the old embedded message and create a new embed based on it - then add the reaction role field the user asked for
            const newEmbed = new MessageEmbed(messageToEdit.embeds[0])
            newEmbed.setDescription(newMessage)

            // Update the message with the new embed
            messageToEdit.edit({ embeds: [newEmbed] })

            // Tell the user it was successful
            interaction.reply({ content: "Successfully removed the emoji and updated the message." });
            setTimeout(() => { interaction.deleteReply(); }, 10000);
            return

        } catch (error) {
            // If the message doesn't exist we hit an api error which is interesting - it doesn't just return undefined
            if (error instanceof DiscordAPIError) {
                interaction.reply({ content: "That isn't a valid message or channel." })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                logger.log({ level: 'error', message: error });
                return;
            }
            logger.log({ level: 'error', message: error });
            interaction.reply({ content: `Something bad happened... I have logged it for <@${process.env.ADMIN}>` })
            setTimeout(() => { interaction.deleteReply(); }, 10000);
        }
    }
}




export default deleteReaction;