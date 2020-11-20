const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const fs = require('fs');

const RESULTS_FOLDER_PATH = './scraping-results/'
const CONFIG_FILE = './config.json'

jsonfile.spaces = 2

const fileName = `${RESULTS_FOLDER_PATH}/data.json`
const obj = { name: 'JP' }

async function main() {
  
  console.log(1)
  await getCounterValue()
  console.log(2)
  // startBot()
}

function getCounterValue() {
  return new Promise(async resolve => {
    const { counter, ...configJson } = await jsonfile.readFile(CONFIG_FILE)
  
    const newConfigJson = {
      ...configJson,
      counter: counter + 1
    }

    console.log(configJson)
    jsonfile.writeFileSync(CONFIG_FILE, newConfigJson)
    resolve(counter)
  })
}

async function startBot() {
  const url = 'view-source:https://bacakomik.co/one-piece-chapter-001-bahasa-indonesia/'
  const url2 = 'https://www.youtube.com/watch?v=TzZ3YOUhCxo'

  const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  browser.goto(url)
  // await browser.waitFor(6000)
  // const response = await page.goto(url);
  // console.log(await response.text())
  // await page.screenshot({path: 'example.png'});

  await browser.close();
}

main()
