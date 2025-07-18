// Script untuk force register slash commands
const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID || '1395656056474173601'; // Fallback value

if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

console.log(`🔧 Using CLIENT_ID: ${CLIENT_ID}`);

// Load semua commands dari folder ./commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) {
    commands.push(command.data.toJSON());
    console.log(`✅ Loaded slash command: ${command.data.name}`);
  }
}

if (commands.length === 0) {
  console.log('⚠️ Tidak ada slash commands untuk diregistrasi');
  process.exit(0);
}

// Deploy commands
async function deployCommands() {
  try {
    console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
    console.log('📋 Commands to register:');
    commands.forEach(cmd => {
      console.log(`  • /${cmd.name} - ${cmd.description}`);
    });
    
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    // First, delete all existing commands to force refresh
    console.log('🗑️ Clearing existing commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log('✅ Existing commands cleared');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now register the new commands
    console.log('📤 Registering new commands...');
    const data = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );
    
    console.log(`✅ Successfully registered ${data.length} application (/) commands.`);
    console.log('📋 Registered commands:');
    data.forEach(cmd => {
      console.log(`  • /${cmd.name} - ${cmd.description}`);
    });
    
    console.log('\n🎉 Commands should be available in Discord within a few minutes!');
    
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
    
    if (error.code === 50035) {
      console.error('💡 Invalid Form Body - pastikan CLIENT_ID benar');
      console.error(`   CLIENT_ID yang digunakan: ${CLIENT_ID}`);
    } else if (error.code === 50001) {
      console.error('💡 Missing Access - pastikan bot memiliki permission');
    } else if (error.code === 401) {
      console.error('💡 Unauthorized - pastikan DISCORD_TOKEN benar');
    }
  }
}

deployCommands();
