const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'activedevbadge',
  aliases: ['devbadge', 'adb'],
  description: 'Get Active Developer Badge / Dapatkan Badge Developer Aktif',
  data: new SlashCommandBuilder()
    .setName('activedevbadge')
    .setDescription('Get Active Developer Badge'),
  
  execute(message, args) {
    const userId = message.author.id;
    const response = languageManager.translate(userId, 'activedevbadge.response');
    
    message.channel.send({
      embeds: [{
        color: 0x5865F2,
        title: '🏆 Active Developer Badge',
        description: response,
        fields: [
          {
            name: '🔗 Link',
            value: '[Get Active Developer Badge](https://discord.com/developers/active-developer)',
            inline: false
          },
          {
            name: '📋 Requirements',
            value: '• Bot must be in at least 1 server\n• Bot must respond to application commands\n• Eligible after using this command',
            inline: false
          }
        ],
        footer: {
          text: `Requested by ${message.author.username}`,
          icon_url: message.author.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    const response = languageManager.translate(userId, 'activedevbadge.response');
    
    await interaction.reply({
      embeds: [{
        color: 0x5865F2,
        title: '🏆 Active Developer Badge',
        description: response,
        fields: [
          {
            name: '🔗 Link',
            value: '[Get Active Developer Badge](https://discord.com/developers/active-developer)',
            inline: false
          },
          {
            name: '📋 Requirements',
            value: '• Bot must be in at least 1 server\n• Bot must respond to application commands\n• Eligible after using this command',
            inline: false
          }
        ],
        footer: {
          text: `Requested by ${interaction.user.username}`,
          icon_url: interaction.user.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });

    console.log(`Active Developer Badge: ${interaction.user.username} (${interaction.user.id}) requested badge`);
  }
};
