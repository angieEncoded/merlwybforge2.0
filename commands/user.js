import { SlashCommandBuilder } from '@discordjs/builders'

const user = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user information'),
    async execute(interaction) {
        await interaction.deferReply({ ephermeral: true })
        await interaction.editReply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    },
};

export default user;