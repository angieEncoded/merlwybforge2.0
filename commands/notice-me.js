import Noticeme from "../models/NoticeMeSenpai.js"
import { SlashCommandBuilder } from '@discordjs/builders'
import logger from "../util/logging.js";
const noticeme = {
    data: new SlashCommandBuilder()
        .setName('notice-me-senpai')
        .setDescription('Receive a scathing reply from Merlwyb'),
    async execute(interaction) {

        try {
            const numberOfItems = await Noticeme.fetchNumberOfItems();
            // Why is is coming back nested this deeply? need to look at this again
            const count = numberOfItems[0][0].count;
            const selectedItem = Math.floor(Math.random() * count);
            const itemToDisplay = await Noticeme.fetchItem(selectedItem)
            // console.log(itemToDisplay[0][0])
            const merlwybReply = '`' + itemToDisplay[0][0].reply + '`';
            await interaction.reply({
                content: merlwybReply,
                ephemeral: false
            })
        } catch (error) {
            logger.log({ level: 'error', message: error });
        }
    },
};

export default noticeme
