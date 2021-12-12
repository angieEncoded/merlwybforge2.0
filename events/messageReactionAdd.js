import Reaction from "../models/Reaction.js"
import ReactionMessage from "../models/ReactionMessage.js";
import logger from "../util/logging.js"

const messageReactionAdd = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {

        // Check if the user is merlwyb and return if so
        if (user.bot) return;

        try {

            // When a reaction is received, check if the structure is partial
            if (reaction.partial) {
                // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
                try {
                    await reaction.fetch();
                } catch (error) {
                    logger.log({ level: 'error', message: error });
                    return;
                }
            }

            if (user.partial) {
                try {
                    await user.fetch();
                } catch (error) {
                    logger.log({ level: 'error', message: error });
                    return;
                }
            }


            // Check the message id and discard it if it isn't one of the messages in the database
            const messageId = reaction.message.id;
            const [isRelevant] = await ReactionMessage.fetchMessage(messageId)
            if (!isRelevant.length > 0) return

            // Get the guild ID, the reaction Emoji and check the database for the role associated 
            const guildId = reaction.message.guildId;
            let emoji = reaction._emoji.id;
            if (emoji == null) { emoji = reaction._emoji.name }
            // console.log(emoji)

            const [[results]] = await Reaction.fetchRoleByGuildIdAndReaction(guildId, emoji)
            const role = results.role;

            // Get an instance of the user and add the associated role
            const fetchedUser = reaction.message.guild.members.cache.get(user.id);
            await fetchedUser.roles.add(role) // put this in an await so it would throw the error

        } catch (error) { // Send a message into the errors channel so Merlwyb can alert the team she needs something
            logger.log({ level: 'error', message: error });

            // Find the 'bot-spam' channel for the server this reaction was issued in
            const guild = await reaction.client.guilds.cache.get(reaction.message.guildId)
            const targetChannel = process.env.BOTCHANNEL || "bot-spam" // Get the user's selected bot channel, or use bot-spam default
            const channel = await guild.channels.cache.find(channel => channel.name === targetChannel)

            // if the channel doesn't exist anywhere, just log it and return - we can't do anything else really
            if (!channel) {
                logger.log({ level: 'error', message: `${process.env.BOTCHANNEL} does not exist` });
                return
            }


            // Insufficient permissions error
            if (error.code === 50013) {
                channel.send(`I do not have the correct permissions to assign that role. Please check your configuration <@${process.env.ADMIN}>`)
                return;
            } else {
                channel.send(`Something happened I wasn't expecting. Please check the logs, <@${process.env.ADMIN}>`)
            }

        }
    },
};

export default messageReactionAdd