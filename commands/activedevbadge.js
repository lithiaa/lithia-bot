const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'activedevbadge',
  aliases: ['devbadge', 'adb'],
  description: 'Get Active Developer Badge / Dapatkan Badge Developer Aktif',
  data: new SlashCommandBuilder()
    .setName('activedevbadge')
    .setDescription('Get Active Developer Badge from Discord'),
  
  execute(message, args) {
    const userId = message.author.id;
    
    try {
      message.channel.send({
        embeds: [{
          color: 0x5865F2,
          title: '🏆 Active Developer Badge',
          description: '🎉 **Congratulations!** You can now claim your Active Developer Badge!\n\nThis command interaction qualifies you for the Discord Active Developer Badge.',
          fields: [
            {
              name: '🔗 Claim Your Badge',
              value: '[Click here to get your badge](https://discord.com/developers/active-developer)',
              inline: false
            },
            {
              name: '📋 Requirements Met',
              value: '✅ Bot is active\n✅ Command executed successfully\n✅ Eligible for badge',
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
      
      console.log(`Active Developer Badge: ${message.author.username} (${message.author.id}) used prefix command`);
    } catch (error) {
      console.error('Error in activedevbadge execute:', error);
      message.channel.send('🎉 Active Developer Badge command executed! Visit https://discord.com/developers/active-developer to claim your badge!');
    }
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    
    try {
      // Defer reply to prevent timeout
      await interaction.deferReply();
      
      await interaction.editReply({
        embeds: [{
          color: 0x5865F2,
          title: '🏆 Active Developer Badge',
          description: '🎉 **Congratulations!** You can now claim your Active Developer Badge!\n\nThis slash command interaction qualifies you for the Discord Active Developer Badge.',
          fields: [
            {
              name: '🔗 Claim Your Badge',
              value: '[Click here to get your badge](https://discord.com/developers/active-developer)',
              inline: false
            },
            {
              name: '📋 Requirements Met',
              value: '✅ Bot is active\n✅ Slash command executed successfully\n✅ Eligible for badge',
              inline: false
            },
            {
              name: '💡 How to Claim',
              value: '1. Visit the link above\n2. Login with your Discord account\n3. Verify your eligibility\n4. Claim your badge!',
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

      console.log(`Active Developer Badge: ${interaction.user.username} (${interaction.user.id}) used slash command`);
      
    } catch (error) {
      console.error('Error in activedevbadge executeSlash:', error);
      
      try {
        if (interaction.deferred) {
          await interaction.editReply('🎉 Active Developer Badge command executed! Visit https://discord.com/developers/active-developer to claim your badge!');
        } else {
          await interaction.reply('🎉 Active Developer Badge command executed! Visit https://discord.com/developers/active-developer to claim your badge!');
        }
      } catch (replyError) {
        console.error('Failed to send error message:', replyError);
      }
    }
  }
};
