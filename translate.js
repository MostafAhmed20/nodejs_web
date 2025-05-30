import dotenv from 'dotenv';
dotenv.config();
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

// Initialize the client
const translate = new Translate();

/**
 * Translates text to a target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'es', 'fr')
 * @param {string} [sourceLang] - Optional source language code
 * @returns {Promise<string>} Translated text
 */
 async function translateText(text, targetLang, sourceLang) {
  try {
    const [translation] = await translate.translate(text, {
      from: sourceLang,
      to: targetLang,
    });
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}


export default translateText