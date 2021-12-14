import { DiscordAPIError } from 'discord.js'
import ReactionMessage from '../models/ReactionMessage.js';
import logger from '../util/logging.js'

export const preflightDelete = async (guildId, interaction) => {

    // Get the instance of the guild
    const guild = await interaction.client.guilds.cache.get(guildId)
    // console.log(guild)

    // Get all the messages for this guild id from the database
    const [databaseRecords] = await ReactionMessage.fetchAllMessagesByGuildId(guildId)

    // Loop through all the stored messages
    for (let databaseItem of databaseRecords) {
        // console.log(databaseItem)
        // For each message, get the channel and then get the message
        const currentMessageChannel = databaseItem.channel_id
        const channelInstance = await guild.channels.cache.find(channel => channel.id === currentMessageChannel)

        // If the message doesn't exist, delete it from the database
        try {
            const messageExists = await channelInstance.messages.fetch(databaseItem.message_id)
            if (messageExists) continue;
        } catch (error) {
            // If we got to this api error we know the message doesn't exist and we can delete it from the database
            if (error instanceof DiscordAPIError) {
                console.log(databaseItem.id)
                await ReactionMessage.deleteMessageById(databaseItem.id);
            } else {
                // Then something we didn't expect happened.
                logger.log({ level: 'error', message: `In the preflight check\n ${error}` })
            }
        }
    }

}