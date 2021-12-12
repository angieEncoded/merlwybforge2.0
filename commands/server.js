import { SlashCommandBuilder } from '@discordjs/builders'

const server = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server information'),
    async execute(interaction) {
        await interaction.deferReply({ ephermeral: true })
        await interaction.editReply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated on: ${interaction.guild.createdAt}`);
    },
};

export default server


