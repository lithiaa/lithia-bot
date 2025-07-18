const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Simple test command for slash commands',
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Simple test command'),
  
  execute(message, args) {
    message.channel.send('✅ Test command works with prefix!');
  },

  async executeSlash(interaction) {
    try {
      console.log('Test command: Starting execution');
      
      // Karena sudah di-defer di index.js, langsung edit reply
      await interaction.editReply('✅ Test slash command works!');
      console.log(`Test slash command executed by ${interaction.user.username}`);
    } catch (error) {
      console.error('Error in test slash command:', error);
      try {
        await interaction.editReply('❌ Error occurred but command received!');
      } catch (replyError) {
        console.error('Failed to send error reply:', replyError);
      }
    }
  }
};
