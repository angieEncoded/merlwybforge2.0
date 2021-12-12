import logger from "../util/logging.js"

const InteractionCreate = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle commands
        if (interaction.isCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                logger.log({ level: 'error', message: error });
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

            //console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction in the commands block.`);
        }

    }
};

export default InteractionCreate;
