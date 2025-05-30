import axios from 'axios';
import * as cheerio from 'cheerio';
import translateText from './translate.js';
import mongoose from 'mongoose';
import { insertCode } from './models/test.js';
import { cars } from './models/cars.js';
import {P_codes} from './models/P_codes.js';



mongoose.connect('mongodb://localhost:27017/cars2');

async function scrapeData(car, code) {
  try {
    const response = await axios.get(`https://${code}-${car}.autotroublecode.com`);
    const $ = cheerio.load(response.data);
    const paragraphs = $('#container p');
    const text = [];

    paragraphs.each((index, element) => {
      text.push($(element).text());
    });

    await translateArray(text, car, code);
  } catch (error) {
    console.error(`Error scraping ${car} ${code}:`, error.message);
  }
}

async function translateArray(arr, car, code) {
  try {
    const translatedArr = await Promise.all(
      arr.map(element => translateText(element, "ar"))
    );

    createCodeObject(translatedArr, car, code);
  } catch (error) {
    console.error(`Translation error for ${car} ${code}:`, error.message);
  }
}

function createCodeObject(arr, car, code) {
  const codeObject = {
    code: code,
    description: arr[0],
    information: arr[1],
    solution: arr[2],
    details: arr[3]
  };

  storeCodes(codeObject, car);
}

async function storeCodes(codeObject, car) {

    insertCode(car, 'P', codeObject);
}

async function processAll() {
  let count = 0;

  for (const car of cars) {
    for (const code of P_codes) {
      await scrapeData(car, code);
    }
    ++count;
    if(count === cars.length ){
      console.log("done")
      break
    }
  }
}

processAll();
