import { SlashCommandBuilder } from '@discordjs/builders'

const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! (useful for telling whether I can respond)'),
    async execute(interaction) {
        await interaction.reply(`Pong`);
    },
};

export default ping
