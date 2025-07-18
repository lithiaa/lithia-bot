const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'ping',
  description: 'Replies with Pong! / Membalas dengan Pong!',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong and latency'),
  
  execute(message, args) {
    const userId = message.author.id;
    const latency = Date.now() - message.createdTimestamp;
    const response = languageManager.translate(userId, 'ping.response', { latency });
    message.channel.send(response);
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    const latency = Date.now() - interaction.createdTimestamp;
    const response = languageManager.translate(userId, 'ping.response', { latency });
    await interaction.reply(response);
  },
};
