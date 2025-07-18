const { SlashCommandBuilder } = require('discord.js');
const languageManager = require('../languageManager');

module.exports = {
  name: 'language',
  aliases: ['lang', 'bahasa'],
  description: 'Change bot language / Ubah bahasa bot',
  usage: '!language <code> | !language en/id',
  example: '!language en',
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change bot language')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Language code (en/id)')
        .setRequired(false)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Indonesia', value: 'id' }
        )),
  
  execute(message, args) {
    const userId = message.author.id;
    const prefix = process.env.PREFIX || '!';

    // Jika tidak ada argumen, tampilkan bahasa saat ini dan yang tersedia
    if (args.length === 0) {
      const currentLang = languageManager.getUserLanguage(userId);
      const currentLangName = languageManager.getLanguageName(currentLang, currentLang);
      const availableLanguages = languageManager.getAvailableLanguages();
      
      let languageList = '';
      availableLanguages.forEach(code => {
        const name = languageManager.getLanguageName(code, currentLang);
        languageList += `\`${code}\` - ${name}\n`;
      });

      return message.channel.send({
        embeds: [{
          color: 0x0099ff,
          title: languageManager.translate(userId, 'language.title'),
          description: languageManager.translate(userId, 'language.current', { language: currentLangName }),
          fields: [
            {
              name: languageManager.translate(userId, 'language.available'),
              value: languageList,
              inline: false
            },
            {
              name: languageManager.translate(userId, 'language.usage', { prefix }),
              value: `\`${prefix}language en\` - English\n\`${prefix}language id\` - Indonesia`,
              inline: false
            }
          ],
          footer: {
            text: `${message.author.username}`,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }]
      });
    }

    const newLanguage = args[0].toLowerCase();
    const availableLanguages = languageManager.getAvailableLanguages();

    // Validasi bahasa yang dipilih
    if (!availableLanguages.includes(newLanguage)) {
      return message.channel.send({
        embeds: [{
          color: 0xff0000,
          title: '❌ Error',
          description: languageManager.translate(userId, 'language.invalid', { 
            codes: availableLanguages.join(', ') 
          }),
          footer: {
            text: `${message.author.username}`,
            icon_url: message.author.displayAvatarURL()
          }
        }]
      });
    }

    // Set bahasa baru
    languageManager.setUserLanguage(userId, newLanguage);
    const newLanguageName = languageManager.getLanguageName(newLanguage, newLanguage);

    message.channel.send({
      embeds: [{
        color: 0x00ff00,
        title: languageManager.translate(userId, 'language.title'),
        description: languageManager.translate(userId, 'language.changed', { 
          language: newLanguageName 
        }),
        footer: {
          text: `${message.author.username}`,
          icon_url: message.author.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });

    console.log(`Language changed: ${message.author.username} set language to ${newLanguage}`);
  },

  async executeSlash(interaction) {
    const userId = interaction.user.id;
    const newLanguage = interaction.options.getString('code');

    // Jika tidak ada argumen, tampilkan bahasa saat ini dan yang tersedia
    if (!newLanguage) {
      const currentLang = languageManager.getUserLanguage(userId);
      const currentLangName = languageManager.getLanguageName(currentLang, currentLang);
      const availableLanguages = languageManager.getAvailableLanguages();
      
      let languageList = '';
      availableLanguages.forEach(code => {
        const name = languageManager.getLanguageName(code, currentLang);
        languageList += `\`${code}\` - ${name}\n`;
      });

      return await interaction.reply({
        embeds: [{
          color: 0x0099ff,
          title: languageManager.translate(userId, 'language.title'),
          description: languageManager.translate(userId, 'language.current', { language: currentLangName }),
          fields: [
            {
              name: languageManager.translate(userId, 'language.available'),
              value: languageList,
              inline: false
            },
            {
              name: languageManager.translate(userId, 'language.usage', { prefix: '/' }),
              value: `\`/language en\` - English\n\`/language id\` - Indonesia`,
              inline: false
            }
          ],
          footer: {
            text: `${interaction.user.username}`,
            icon_url: interaction.user.displayAvatarURL()
          },
          timestamp: new Date()
        }]
      });
    }

    // Set bahasa baru
    languageManager.setUserLanguage(userId, newLanguage);
    const newLanguageName = languageManager.getLanguageName(newLanguage, newLanguage);

    await interaction.reply({
      embeds: [{
        color: 0x00ff00,
        title: languageManager.translate(userId, 'language.title'),
        description: languageManager.translate(userId, 'language.changed', { 
          language: newLanguageName 
        }),
        footer: {
          text: `${interaction.user.username}`,
          icon_url: interaction.user.displayAvatarURL()
        },
        timestamp: new Date()
      }]
    });

    console.log(`Language changed: ${interaction.user.username} set language to ${newLanguage}`);
  }
};
