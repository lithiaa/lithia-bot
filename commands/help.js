const languageManager = require('../languageManager');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands / Menampilkan daftar perintah yang tersedia.',
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
};
