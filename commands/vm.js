const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'vm',
  description: 'Simple VM test command',
  data: new SlashCommandBuilder()
    .setName('vm')
    .setDescription('VM test command'),
  
  execute(message, args) {
    message.channel.send('VM prefix OK');
  },

  async executeSlash(interaction) {
    console.log('VM command: Started execution');
    console.log('VM command: Interaction type:', interaction.type);
    console.log('VM command: Command name:', interaction.commandName);
    console.log('VM command: User:', interaction.user.username);
    console.log('VM command: Already deferred:', interaction.deferred);
    
    try {
      console.log('VM command: About to edit reply...');
      await interaction.editReply('VM slash OK ✅');
      console.log('VM command: Reply sent successfully');
    } catch (error) {
      console.error('VM command: Error occurred:', error);
      console.error('VM command: Error stack:', error.stack);
    }
  }
};
