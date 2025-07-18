const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const languageManager = require('./languageManager');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PREFIX = process.env.PREFIX || '!';

// Koleksi commands
client.commands = new Collection();
const slashCommands = [];

// Load semua commands dari folder ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  
  // Jika command memiliki slash command data, tambahkan ke array
  if (command.data) {
    slashCommands.push(command.data.toJSON());
  }
}

// Register slash commands
async function registerSlashCommands() {
  try {
    console.log('🔄 Started refreshing application (/) commands.');
    
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: slashCommands },
    );
    
    console.log('✅ Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
}

// Event saat bot siap
client.once('ready', async () => {
  console.log(languageManager.translate('system', 'bot.online', { tag: client.user.tag }));
  await registerSlashCommands();
});

// Event untuk slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    if (command.executeSlash) {
      await command.executeSlash(interaction);
    } else {
      // Fallback: convert interaction to message-like object for backward compatibility
      const fakeMessage = {
        author: interaction.user,
        channel: interaction.channel,
        guild: interaction.guild,
        reply: (content) => interaction.reply(content),
        send: (content) => interaction.reply(content)
      };
      
      const args = [];
      // Get options from slash command
      if (interaction.options) {
        interaction.options.data.forEach(option => {
          args.push(option.value.toString());
        });
      }
      
      await command.execute(fakeMessage, args);
    }
  } catch (error) {
    console.error(error);
    const errorMsg = languageManager.translate(interaction.user.id, 'bot.error');
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMsg, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMsg, ephemeral: true });
    }
  }
});

// Event saat pesan dibuat
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    const errorMsg = languageManager.translate(message.author.id, 'bot.error');
    message.channel.send(errorMsg);
  }
});

client.login(TOKEN);
