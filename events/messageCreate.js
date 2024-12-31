require('dotenv').config(); // Memuat variabel dari .env

const PREFIX = process.env.PREFIX;

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // Abaikan pesan dari bot atau pesan yang tidak dimulai dengan prefix
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    // Memisahkan command dan argumen
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Cari command berdasarkan nama
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('Terjadi kesalahan saat mengeksekusi perintah.');
    }
  },
};
