// Import es6 modules
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const commands = [];
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

const clientId = process.env.CLIENT_ID;
const guildId = process.env.PRIVATE_TESTING_GUILD_ID
const token = process.env.BOT_TOKEN

// Read through all the files and register the commands
for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);
    commands.push(command.data.toJSON());
}


// Update all the slash commands in the target guild
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();