const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'debug',
  description: 'Debug command to test slash command functionality',
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Debug slash command'),
  
  execute(message, args) {
    message.channel.send('🔍 Debug prefix command works!');
  },

  async executeSlash(interaction) {
    console.log('🔍 Debug slash command started');
    
    try {
      console.log('  └─ Sending immediate reply');
      await interaction.reply({
        content: '🔍 Debug slash command executed successfully!',
        ephemeral: false
      });
      console.log('  └─ Reply sent successfully');
    } catch (error) {
      console.error('❌ Debug slash command error:', error);
      console.error('  └─ Stack trace:', error.stack);
    }
  }
};
