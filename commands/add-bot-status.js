import { SlashCommandBuilder } from '@discordjs/builders'
import { DiscordAPIError } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import BotStatus from '../models/BotStatus.js';
import logger from '../util/logging.js';

const possibleTypes = ["PLAYING", "STREAMING", "WATCHING", "LISTENING"];

const addbotstatus = {
    data: new SlashCommandBuilder()
        .setName('add-bot-status')
        .setDescription('Add a status to my database!')
        .addStringOption(option => option.setName('type').setDescription('The type of activity (PLAYING, STREAMING, WATCHING, LISTENING)').setRequired(true))
        .addStringOption(option => option.setName('activity').setDescription('What Merlwyb is doing').setRequired(true)),

    async execute(interaction) {
        try {

            // Only moderators and above can use this command
            // return from the interaction if the user doesn't have the admin role
            if (!interaction.member.roles.cache.some(role => [process.env.DISCORDADMIN, process.env.DISCORDMOD].includes(role.name))) {
                interaction.reply({ content: "Only an admin or moderator can do this." })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Get the type from the message
            const type = await interaction.options.getString('type')

            // Ensure that the entered type exists
            if (!possibleTypes.includes(type.toUpperCase())) return interaction.reply({
                content: "I don't recognize that status type", ephemeral: true
            })

            // Build the rest of the record
            const activity = await interaction.options.getString('activity')
            const uuid = uuidv4();
            const user = interaction.user.tag;

            // Construct the record
            // constructor (id, uuid, type, activity, added_by)
            const newStatus = new BotStatus(null, uuid, type.toUpperCase(), activity, user)

            // Save the record
            const results = await newStatus.save()

            // Let the user know it was successful
            interaction.reply({ content: "Thanks for adding a new status!" })
            setTimeout(() => { interaction.deleteReply(); }, 10000);

        } catch (error) {
            // If the message doesn't exist we hit an api error which is interesting - it doesn't just return undefined
            if (error instanceof DiscordAPIError) {
                interaction.reply({ content: `I hit an API Error. I logged it for  <@${process.env.ADMIN}>.` })
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

export default addbotstatus
