import { SlashCommandBuilder } from '@discordjs/builders'
import { DiscordAPIError } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import Noticeme from '../models/NoticeMeSenpai.js';
import logger from '../util/logging.js';

const addnoticeme = {
    data: new SlashCommandBuilder()
        .setName('add-notice-me-senpai')
        .setDescription('Add a noticeme reply to my database!')
        .addStringOption(option => option.setName('noticemereply').setDescription('The reply you would like to add to my database').setRequired(true)),

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
            const noticeMeReply = await interaction.options.getString('noticemereply')
            const uuid = uuidv4();
            const user = interaction.user.tag;

            // Construct the record
            //constructor(id, uuid, reply, added_by) {
            const newReply = new Noticeme(null, uuid, noticeMeReply, user)

            // Save the record
            const results = await newReply.save()

            // Let the user know it was successful
            interaction.reply({ content: "Thanks for adding a new status!" })
            setTimeout(() => { interaction.deleteReply(); }, 10000);

        } catch (error) {
            // If the message doesn't exist we hit an api error which is interesting - it doesn't just return undefined
            if (error instanceof DiscordAPIError) {
                interaction.reply({ content: `Something bad happened... I have logged it for <@${process.env.ADMIN}>` })
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

export default addnoticeme
