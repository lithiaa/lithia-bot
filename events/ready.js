require('dotenv').config(); // Memuat variabel dari .env

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot telah siap! Masuk sebagai ${client.user.tag}`);
    console.log(`Prefix yang digunakan adalah: ${process.env.PREFIX}`);
  },
};
