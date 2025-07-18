const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands / Menampilkan daftar perintah yang tersedia.',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  
  execute(message, args) {
    const userId = message.author.id;
    const prefix = process.env.PREFIX || '!';
    const commands = message.client.commands;

    let helpMessage = `**${languageManager.translate(userId, 'help.title')}**\n\n`;
    helpMessage += `${languageManager.translate(userId, 'help.description', { prefix })}\n\n`;

    commands.forEach(command => {
      const description = command.description || languageManager.translate(userId, 'help.noDescription');
      helpMessage += `**${prefix}${command.name}** - ${description}\n`;
    });

    message.channel.send(helpMessage).catch(console.error);
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    const prefix = process.env.PREFIX || '!';
    const commands = interaction.client.commands;

    let helpMessage = `**${languageManager.translate(userId, 'help.title')}**\n\n`;
    helpMessage += `${languageManager.translate(userId, 'help.description', { prefix })}\n\n`;
    helpMessage += `**Slash Commands:**\n`;

    commands.forEach(command => {
      const description = command.description || languageManager.translate(userId, 'help.noDescription');
      if (command.data) {
        helpMessage += `**/${command.name}** - ${description}\n`;
      }
    });

    helpMessage += `\n**Prefix Commands:**\n`;
    commands.forEach(command => {
      const description = command.description || languageManager.translate(userId, 'help.noDescription');
      helpMessage += `**${prefix}${command.name}** - ${description}\n`;
    });

    await interaction.reply(helpMessage);
  },
};
