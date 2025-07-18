// Script untuk mendapatkan CLIENT_ID dari bot
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error('❌ DISCORD_TOKEN tidak ditemukan di file .env');
  process.exit(1);
}

client.once('ready', () => {
  console.log('🤖 Bot Information:');
  console.log(`📛 Name: ${client.user.tag}`);
  console.log(`🆔 CLIENT_ID: ${client.user.id}`);
  console.log(`\n📝 Tambahkan baris berikut ke file .env:`);
  console.log(`CLIENT_ID=${client.user.id}`);
  
  process.exit(0);
});

client.login(TOKEN).catch(error => {
  console.error('❌ Gagal login:', error);
  process.exit(1);
});
