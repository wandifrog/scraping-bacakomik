const puppeteer = require('puppeteer-core')


const browser = await puppeteer.launch({headless: false}); // default is true