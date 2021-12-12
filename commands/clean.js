import { SlashCommandBuilder } from '@discordjs/builders'
import logger from '../util/logging.js';

// Clean out old messages indescriminantly
const clean = {
    data: new SlashCommandBuilder()
        .setName('clean')
        .setDescription('Admin delete of last 100 messages'),
    async execute(interaction) {
        // console.log(interaction)
        if (interaction.member.roles.cache.some(role => role.name === process.env.DISCORDADMIN)) {
            await interaction.channel.bulkDelete(100, { filterOld: true });
            await interaction.reply({
                content: "Housekeeping Done",
                ephemeral: false
            })
            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);

        } else {
            // display a message if they do not. 
            await interaction.reply("Sorry, I can't delete messages without authorization from an admin.")
            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);
            logger.log({ level: 'info', message: "user without admin privileges tried to execute clean" });
        }
    },
};

export default clean
