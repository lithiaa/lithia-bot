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
      // Defer reply immediately to prevent timeout
      await interaction.deferReply();
      
      // Then edit the reply
      await interaction.editReply('✅ Test slash command works!');
      console.log(`Test slash command executed by ${interaction.user.username}`);
    } catch (error) {
      console.error('Error in test slash command:', error);
      try {
        if (interaction.deferred) {
          await interaction.editReply('❌ Error occurred but command received!');
        } else {
          await interaction.reply('❌ Error occurred but command received!');
        }
      } catch (replyError) {
        console.error('Failed to send error reply:', replyError);
      }
    }
  }
};
