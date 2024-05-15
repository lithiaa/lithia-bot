const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = process.env.DISCORD_TOKEN;

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!ping') {
        message.channel.send('Pong!');
    } else if (command === '!hello') {
        message.channel.send(`Hello, ${message.author.username}!`);
    } else if (command === '!help') {
        message.channel.send('Available commands: !ping, !hello, !help');
    }
});

client.login(TOKEN);
