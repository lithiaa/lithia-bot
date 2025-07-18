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

// Validasi environment variables
if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.warn('⚠️ CLIENT_ID tidak ditemukan di file .env');
  console.warn('💡 Bot akan berjalan tanpa slash commands');
  console.warn('💡 Jalankan "npm run get-id" untuk mendapatkan CLIENT_ID');
} else {
  console.log('✅ Environment variables loaded successfully');
  console.log(`📋 CLIENT_ID: ${CLIENT_ID}`);
}

console.log(`🔧 PREFIX: ${PREFIX}`);

// Koleksi commands
client.commands = new Collection();
const slashCommands = [];

// Load semua commands dari folder ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('🔄 Loading commands...');
for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
    
    // Jika command memiliki slash command data, tambahkan ke array
    if (command.data) {
      slashCommands.push(command.data.toJSON());
      console.log(`  └─ Slash command registered: /${command.data.name}`);
    }
  } catch (error) {
    console.error(`❌ Error loading command ${file}:`, error);
  }
}

console.log(`📊 Total commands loaded: ${client.commands.size}`);
console.log(`📊 Total slash commands: ${slashCommands.length}`);

// Register slash commands
async function registerSlashCommands() {
  if (!CLIENT_ID) {
    console.log('⚠️ CLIENT_ID tidak tersedia, melewati registrasi slash commands');
    return;
  }

  if (slashCommands.length === 0) {
    console.log('⚠️ Tidak ada slash commands untuk diregistrasi');
    return;
  }

  try {
    console.log(`🔄 Started refreshing ${slashCommands.length} application (/) commands.`);
    
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    const data = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: slashCommands },
    );
    
    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
    if (error.code === 50035) {
      console.error('💡 Pastikan CLIENT_ID benar dan bot memiliki permission yang sesuai');
    }
  }
}

// Event saat bot siap
client.once('ready', async () => {
  console.log(languageManager.translate('system', 'bot.online', { tag: client.user.tag }));
  console.log(`🆔 Actual CLIENT_ID: ${client.user.id}`);
  
  if (CLIENT_ID && CLIENT_ID !== client.user.id) {
    console.warn(`⚠️ CLIENT_ID di .env (${CLIENT_ID}) tidak sama dengan bot ID (${client.user.id})`);
    console.warn('💡 Update CLIENT_ID di file .env dengan nilai yang benar');
  }
  
  if (CLIENT_ID) {
    await registerSlashCommands();
  } else {
    console.log('⏭️ Melewati registrasi slash commands karena CLIENT_ID tidak tersedia');
    console.log(`💡 Untuk menggunakan slash commands, tambahkan ke .env: CLIENT_ID=${client.user.id}`);
  }
});

// Event untuk slash commands
client.on('interactionCreate', async (interaction) => {
  console.log(`🔍 Interaction received: ${interaction.type} | Command: ${interaction.commandName || 'N/A'}`);
  
  if (!interaction.isChatInputCommand()) {
    console.log('  └─ Not a chat input command, ignoring');
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    try {
      await interaction.reply({ 
        content: `❌ Command \`${interaction.commandName}\` not found.`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Failed to send error reply:', error);
    }
    return;
  }

  console.log(`✅ Executing slash command: ${interaction.commandName} by ${interaction.user.username}`);

  try {
    if (command.executeSlash) {
      await command.executeSlash(interaction);
      console.log(`✅ Successfully executed slash command: ${interaction.commandName}`);
    } else {
      console.log('  └─ No executeSlash method, using fallback');
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
      console.log(`✅ Successfully executed fallback for: ${interaction.commandName}`);
    }
  } catch (error) {
    console.error(`❌ Error executing command ${interaction.commandName}:`, error);
    const errorMsg = languageManager.translate(interaction.user.id, 'bot.error');
    
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMsg, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMsg, ephemeral: true });
      }
    } catch (replyError) {
      console.error('Failed to send error message:', replyError);
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
