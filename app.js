import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

// Tell Discord what we intend to do with the bot
const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        // DiscordJS.Intents.FLAGS.GUILD_PRESENCES
    ],
    partials: ['CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'REACTION']
})

// Store the commands as a discord collection
client.commands = new DiscordJS.Collection();

// Read the directory and add javascript files to the collection
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Set up the commands in each of the files - converted this to es6 modules
for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// Events handler - also converted this to es6 modules
for (const file of eventFiles) {
    const { default: event } = await import(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


// Log in with the bot using the token
client.login(process.env.BOT_TOKEN);