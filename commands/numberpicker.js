const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'numberpicker',
  aliases: ['np', 'pick', 'random'],
  description: 'Picks a random number from specified range / Memilih nomor acak dari rentang yang ditentukan',
  usage: '!numberpicker <min> <max>',
  example: '!numberpicker 1 100',
  data: new SlashCommandBuilder()
    .setName('numberpicker')
    .setDescription('Picks a random number from specified range')
    .addIntegerOption(option =>
      option.setName('min')
        .setDescription('Minimum number')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('max')
        .setDescription('Maximum number')
        .setRequired(true)),
  
  execute(message, args) {
    const userId = message.author.id;
    const prefix = process.env.PREFIX || '!';

    // Validasi apakah user memberikan 2 argumen
    if (args.length !== 2) {
      const error = languageManager.translate(userId, 'numberpicker.errors.wrongFormat.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.wrongFormat.description', { prefix });
      const footer = languageManager.translate(userId, 'numberpicker.errors.wrongFormat.footer');
      
      return message.channel.send({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }]
      });
    }

    // Parse angka dari argumen
    const min = parseInt(args[0]);
    const max = parseInt(args[1]);

    // Validasi apakah input adalah angka yang valid
    if (isNaN(min) || isNaN(max)) {
      const error = languageManager.translate(userId, 'numberpicker.errors.invalidInput.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.invalidInput.description', { prefix });
      const footer = languageManager.translate(userId, 'numberpicker.errors.invalidInput.footer');
      
      return message.channel.send({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }]
      });
    }

    // Validasi apakah min tidak lebih besar dari max
    if (min >= max) {
      const error = languageManager.translate(userId, 'numberpicker.errors.invalidRange.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.invalidRange.description', { 
        min, max, prefix 
      });
      const footer = languageManager.translate(userId, 'numberpicker.errors.invalidRange.footer');
      
      return message.channel.send({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }]
      });
    }

    // Validasi rentang maksimal untuk mencegah spam
    const range = max - min;
    if (range > 1000000) {
      const error = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.description');
      const footer = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.footer');
      
      return message.channel.send({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }]
      });
    }

    // Generate nomor acak
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Kirim hasil dengan embed yang menarik
    const title = languageManager.translate(userId, 'numberpicker.title');
    const description = languageManager.translate(userId, 'numberpicker.description', { 
      min, max, result: randomNumber 
    });
    const rangeInfo = languageManager.translate(userId, 'numberpicker.rangeInfo');
    const totalPossibilities = languageManager.translate(userId, 'numberpicker.totalPossibilities', { 
      count: range + 1 
    });
    const selectedNumber = languageManager.translate(userId, 'numberpicker.selectedNumber');
    const pickedFor = languageManager.translate(userId, 'numberpicker.pickedFor', { 
      username: message.author.username 
    });

    message.channel.send({
      embeds: [{
        color: 0x00ff00,
        title: title,
        description: description,
        fields: [
          {
            name: rangeInfo,
            value: totalPossibilities,
            inline: true
          },
          {
            name: selectedNumber,
            value: `**${randomNumber}**`,
            inline: true
          }
        ],
        footer: {
          text: pickedFor,
          icon_url: message.author.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });

    // Log ke console untuk debugging
    console.log(`Number picker: ${message.author.username} got ${randomNumber} from range ${min}-${max}`);
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    const min = interaction.options.getInteger('min');
    const max = interaction.options.getInteger('max');

    // Validasi apakah min tidak lebih besar dari max
    if (min >= max) {
      const error = languageManager.translate(userId, 'numberpicker.errors.invalidRange.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.invalidRange.description', { 
        min, max, prefix: '/' 
      });
      const footer = languageManager.translate(userId, 'numberpicker.errors.invalidRange.footer');
      
      return await interaction.reply({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }],
        ephemeral: true
      });
    }

    // Validasi rentang maksimal untuk mencegah spam
    const range = max - min;
    if (range > 1000000) {
      const error = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.title');
      const description = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.description');
      const footer = languageManager.translate(userId, 'numberpicker.errors.rangeTooBig.footer');
      
      return await interaction.reply({
        embeds: [{
          color: 0xff0000,
          title: error,
          description: description,
          footer: { text: footer }
        }],
        ephemeral: true
      });
    }

    // Generate nomor acak
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Kirim hasil dengan embed yang menarik
    const title = languageManager.translate(userId, 'numberpicker.title');
    const description = languageManager.translate(userId, 'numberpicker.description', { 
      min, max, result: randomNumber 
    });
    const rangeInfo = languageManager.translate(userId, 'numberpicker.rangeInfo');
    const totalPossibilities = languageManager.translate(userId, 'numberpicker.totalPossibilities', { 
      count: range + 1 
    });
    const selectedNumber = languageManager.translate(userId, 'numberpicker.selectedNumber');
    const pickedFor = languageManager.translate(userId, 'numberpicker.pickedFor', { 
      username: interaction.user.username 
    });

    await interaction.reply({
      embeds: [{
        color: 0x00ff00,
        title: title,
        description: description,
        fields: [
          {
            name: rangeInfo,
            value: totalPossibilities,
            inline: true
          },
          {
            name: selectedNumber,
            value: `**${randomNumber}**`,
            inline: true
          }
        ],
        footer: {
          text: pickedFor,
          icon_url: interaction.user.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });

    // Log ke console untuk debugging
    console.log(`Number picker: ${interaction.user.username} got ${randomNumber} from range ${min}-${max}`);
  }
};
