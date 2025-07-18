const fs = require('fs');
const path = require('path');

class LanguageManager {
  constructor() {
    this.locales = {};
    this.userLanguages = new Map(); // Store user language preferences
    this.defaultLanguage = 'id'; // Default to Indonesian
    this.availableLanguages = ['en', 'id'];
    
    this.loadLanguages();
  }

  loadLanguages() {
    const localesDir = path.join(__dirname, 'locales');
    
    for (const lang of this.availableLanguages) {
      try {
        const filePath = path.join(localesDir, `${lang}.json`);
        const content = fs.readFileSync(filePath, 'utf8');
        this.locales[lang] = JSON.parse(content);
        console.log(`✅ Loaded language: ${lang}`);
      } catch (error) {
        console.error(`❌ Failed to load language ${lang}:`, error.message);
      }
    }
  }

  setUserLanguage(userId, language) {
    if (!this.availableLanguages.includes(language)) {
      return false;
    }
    this.userLanguages.set(userId, language);
    return true;
  }

  getUserLanguage(userId) {
    return this.userLanguages.get(userId) || this.defaultLanguage;
  }

  translate(userId, key, replacements = {}) {
    const language = this.getUserLanguage(userId);
    const locale = this.locales[language] || this.locales[this.defaultLanguage];
    
    let text = this.getNestedValue(locale, key);
    
    if (!text) {
      console.warn(`⚠️ Translation key not found: ${key} for language: ${language}`);
      return key; // Return key if translation not found
    }

    // Replace placeholders
    for (const [placeholder, value] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }

    return text;
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k]) ? o[k] : null, obj);
  }

  getAvailableLanguages() {
    return this.availableLanguages;
  }

  getLanguageName(code, userLanguage = 'id') {
    const locale = this.locales[userLanguage] || this.locales[this.defaultLanguage];
    return locale.language.languages[code] || code;
  }
}

module.exports = new LanguageManager();
