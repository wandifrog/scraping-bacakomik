const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const fs = require('fs');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const RESULTS_FOLDER_PATH = './scraping-results/'
const CONFIG_FILE = './config.json'

var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();


const options = {
  headless: true,
  // slowMo: 2000
}
const episodeCounter = 10

async function main() {
  // const counter = await getCounterValue()
  startBot()
}

global.asd = 123

async function startBot() {
  const url = 'https://bacakomik.co/one-piece-chapter-001-bahasa-indonesia/'
  const url2 = 'view-source:https://bacakomik.co/one-piece-chapter-001-bahasa-indonesia/'

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // await page.goto(url, { waitUntil: 'networkidle2' })
  const bacakomik = await page.goto(url, { waitUntil: 'networkidle2' })

  
  // cheerio
  // const asd = cheerio.load(bacakomik.text())  
  // console.log(222, asd('div', '#chimg'))
  
  // await page.waitForSelector('#chimg')
  // const result = await page.$$('#chimg')
  try { 
    // WORKS #1
    // const html = await bacakomik.text()
    // const { document } = (new JSDOM(html)).window;
    // const arr = []
    // document.querySelector('#chimg').childNodes.forEach((item) => {
    //   arr.push(item.src)
    // })
    // console.log(arr)

    // WORKS #2
    const images = await page.evaluate(() => Array.from(document.querySelector('#chimg').childNodes).map(x => x.src))
    console.log(images)

    // let data = await bacakomik.evaluate(() => {
    //   const title = document
    //   return title
    // })
    // console.log(123, data)
    
  } catch (error) {
    console.log('CATCH', error)
    await browser.close()
  }


  await browser.close();
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

function getCounterValue() {
  return new Promise(async resolve => {
    const { counter, ...configJson } = await jsonfile.readFile(CONFIG_FILE)
    const newConfigJson = {
      ...configJson,
      counter: counter + 1
    }
    jsonfile.writeFileSync(CONFIG_FILE, newConfigJson)
    resolve(counter)
  })
}

main()
