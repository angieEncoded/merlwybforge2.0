import { SlashCommandBuilder } from '@discordjs/builders'
import { DiscordAPIError, MessageEmbed } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import Reaction from "../models/Reaction.js"
import logger from '../util/logging.js';
import ReactionMessage from "../models/ReactionMessage.js"


const addreaction = {
    data: new SlashCommandBuilder()
        .setName('add-reactions')
        .setDescription('Add a reaction role to a message you set up')
        .addStringOption(option => option.setName('messageid').setDescription('The ID of the message we will attach the reaction to').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role you want to assign').setRequired(true))
        .addStringOption(option => option.setName('reaction').setDescription('The reaction you want to use').setRequired(true))
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
            // console.log(reactionsChannel)
            if (!reactionsChannel) {
                interaction.reply({ content: "That isn't a valid channel" })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // check that the message exists - note that error handling for this is in the actual error.
            // DiscordJS will throw an API error if the message isn't found
            const messageId = await interaction.options.getString('messageid');
            const messageToEdit = await reactionsChannel.messages.fetch(messageId)
            const role = await interaction.options.getRole('role');
            const reaction = await interaction.options.getString('reaction');
            const guildId = interaction.guild.id

            // check that we don't already have too many items - 20 is the max
            const [[numberOfCurrentReactions]] = await Reaction.fetchNumberOfItems(messageId)
            if (numberOfCurrentReactions.count >= 20) {
                interaction.reply("That message has hit the Discord limit for reactions. We are only allowed to have 20 unique reactions.")
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Check and make sure that the emoji isn't in use
            const [reactionResults] = await Reaction.fetchReactionByName(reaction, guildId);
            if (reactionResults.length > 0) {
                interaction.reply({ content: "That emoji is already in use. " });
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Check and make sure that the role isn't in use
            const roleId = role.id;
            const [roleResults] = await Reaction.fetchRoleByRoleId(roleId, guildId);
            if (roleResults.length > 0) {
                interaction.reply({ content: "That role is already being handled somewhere. " });
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Set some items for the database
            const uuid = uuidv4();
            const user = interaction.user.tag;

            // If it's a custom emoji we need to strip its id
            let emojiId = reaction;
            if (reaction.includes(">")) {
                emojiId = reaction.substring(
                    reaction.lastIndexOf(":") + 1,
                    reaction.lastIndexOf(">")
                )
            }

            // Save the new reaction to the database
            // constructor                  (id, uuid, guild_id, reaction_message, emoji, emoji_id, role, added_by, added_on, updated_on, modified_by, deleted)
            const newReaction = new Reaction(null, uuid, guildId, messageId, reaction, emojiId, role.id, user, null, null, user, null)
            await newReaction.save();


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

            // Update the message with the new reaction
            messageToEdit.react(reaction)

            // Tell the user it was successful
            interaction.reply({ content: "Successfully added the reaction to the database and the message." });
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
    },
};

export default addreaction
