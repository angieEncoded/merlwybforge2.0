import { SlashCommandBuilder } from '@discordjs/builders'
import logger from '../util/logging.js'
import ReactionMessage from '../models/ReactionMessage.js';

const deletereactionmessage = {
    data: new SlashCommandBuilder()
        .setName('delete-reaction-message')
        .setDescription('Deletes a reaction message and reactions from the database')
        .addStringOption(option => option.setName('messageid').setDescription('The target message ID').setRequired(true))
        .addStringOption(option => option.setName('roleschannel').setDescription('Optional name of the channel the message is in (default reaction-roles)')),

    async execute(interaction) {

        try {

            // return from the interaction if the user doesn't have the admin role
            if (!interaction.member.roles.cache.some(role => role.name === process.env.DISCORDADMIN)) {
                interaction.reply({
                    content: "Only an admin can do this."
                })
                setTimeout(() => {
                    interaction.deleteReply();
                }, 10000);
                return;
            }

            // Get the message ID from the interaction and details about the requesting user for the logs
            const messageId = interaction.options.getString('messageid');
            // console.log(messageId)
            const user = {
                id: interaction.member.user.id,
                username: `${interaction.member.user.username}#${interaction.member.user.discriminator}`
            }

            // Check that the message given is a valid message in our database
            const [message] = await ReactionMessage.fetchMessage(messageId)

            // if it isn't kick the user back and log it - someone might be trying to use Merlwyb to delete something they shouldn't.
            if (!message.length > 0) {
                await interaction.reply("That message does not exist in my database. Are you sure it's a reactions message?")
                logger.log({ level: 'info', message: `User ${user.id} ${user.username} tried to delete a reactions message that doesn't exist in the database. Message ID is ${messageId}` })
                setTimeout(() => {
                    interaction.deleteReply();
                }, 10000);
                return;
            }

            // Check that the reaction-roles channel exists or whatever channel the user specified
            const channelname = await interaction.options.getString('roleschannel') || "reaction-roles";
            const reactionsChannel = await interaction.guild.channels.cache.find(channel => channel.name === channelname);
            // console.log(reactionsChannel)
            if (!reactionsChannel) {
                interaction.reply({
                    content: "That isn't a valid channel"
                })
                setTimeout(() => {
                    interaction.deleteReply();
                }, 10000);
                return;
            }

            // delete the message from the database (the reactions will cascade)
            await ReactionMessage.deleteMessageById(messageId);

            // Delete the target message
            const messageToDelete = await reactionsChannel.messages.fetch(messageId)
            messageToDelete.delete();

            // log the deletion
            logger.log({ level: 'info', message: `User ${user.id} ${user.username} deleted ${messageId}` })

            // respond to the user that the work was done
            await interaction.reply("I've successfully deleted the message from the channel and the database.")
            setTimeout(() => {
                interaction.deleteReply();
            }, 10000);

            return;
        } catch (error) {
            // If the message doesn't exist we hit an api error which is interesting - it doesn't just return undefined
            if (error instanceof DiscordAPIError) {
                interaction.reply({
                    content: "That isn't a valid message or channel."
                })
                setTimeout(() => {
                    interaction.deleteReply();
                }, 10000);
                logger.log({ level: 'error', message: error });
                return;
            }
            logger.log({ level: "error", message: error })
        }







    },
};

export default deletereactionmessage
