const languageManager = require('../languageManager');

module.exports = {
  name: 'ping',
  description: 'Replies with Pong! / Membalas dengan Pong!',
  execute(message, args) {
    const userId = message.author.id;
    const latency = Date.now() - message.createdTimestamp;
    const response = languageManager.translate(userId, 'ping.response', { latency });
    message.channel.send(response);
  },
};
