import { MessageEmbed } from 'discord.js'
import ReactionMessage from '../models/ReactionMessage.js';
import { SlashCommandBuilder } from '@discordjs/builders'
import logger from '../util/logging.js';
import { v4 as uuidv4 } from 'uuid';

const react = {
    data: new SlashCommandBuilder()
        .setName('create-reaction-message')
        .setDescription('Sets up a reaction roles message')
        .addStringOption(option => option.setName('title').setDescription('A title for the message'))
        .addStringOption(option => option.setName('messagenotes').setDescription('Optional message instructions'))
        .addStringOption(option => option.setName('channelname').setDescription('The channel where the message will go')),


    async execute(interaction) {

        try {
            // return from the interaction if the user doesn't have the admin role
            if (!interaction.member.roles.cache.some(role => role.name === process.env.DISCORDADMIN)) {
                interaction.reply({ content: "Only an admin can do this." })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Make sure that the channel exists before we do anything else
            const channelname = interaction.options.getString('channelname') || "reaction-roles";
            const results = interaction.guild.channels.cache.find(channel => channel.name === channelname);
            if (!results) {
                interaction.reply({
                    content: `I can't find a channel named ${channelname}. If you entered a channel name, check the spelling. If you took the defaults, please create a channel named 'reaction-roles'`
                })
                setTimeout(() => { interaction.deleteReply(); }, 10000);
                return;
            }

            // Gather input from the user and assign some defaults if they want the fast way
            const title = interaction.options.getString('title') || "Reaction Roles";
            const notes = interaction.options.getString('messagenotes') || "React below to obtain a role.";
            const user = interaction.user.tag;
            const currentChannel = interaction.channel.id;
            const guildId = interaction.guild.id
            const channelId = results.id;
            const uuid = uuidv4();

            // Set up and deploy the message we'll work with later
            const success = new MessageEmbed()
                .setColor('#36393F')
                .setTitle(title)
                .setDescription(notes)

            // Send the initial message into the channel with channelId
            const newMessage = await results.send({ embeds: [success] })
            // console.log(newMessage.id)

            // Save the data to a new record in the database and return the id of the record to the user
            // constructor(id, uuid, title, message_id, channel_id, guild_id, asking_channel, notes, deployed, added_by, modified_by, added_on, updated_on, deleted) 
            const discordMessage = new ReactionMessage(null, uuid, title, newMessage.id, channelId, guildId, currentChannel, notes, null, user, user, null, null, null)
            const [messageID] = await discordMessage.save()
            // console.log(messageID)

            // Report to the user that it's completed
            await interaction.deferReply({ ephemeral: true })
            await interaction.editReply({
                content: `I've successfully deployed the message in the reaction roles channel. Your message id is ${newMessage.id}. In order to set up reaction roles use the below command and fill in the reaction options:\n
             \`\`\`/add-reactions\`\`\``,
                ephemeral: true
            })
        } catch (error) {
            interaction.reply({
                content: `Something bad happened... I have logged it for <@${process.env.ADMIN}>`
            })
            setTimeout(() => {
                interaction.deleteReply();
            }, 10000);
            logger.log({ level: 'error', message: error });
            return;
        }
    }

};

export default react