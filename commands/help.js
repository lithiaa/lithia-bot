module.exports = {
  name: 'help',
  description: 'Displays a list of available commands.',
  execute(message, args) {
    const prefix = process.env.PREFIX || '!';
    const commands = message.client.commands;

    let helpMessage = `**📜 Available Commands:**\n\n`;
    helpMessage += `Use \`${prefix}<command>\` to run a command.\n\n`;

    commands.forEach(command => {
      helpMessage += `**${prefix}${command.name}** - ${command.description || 'No description provided.'}\n`;
    });

    message.channel.send(helpMessage).catch(console.error);
  },
};
