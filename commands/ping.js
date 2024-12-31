module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute(message, args) {
    message.channel.send('Pong!!!');
  },
};
