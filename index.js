const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const fs = require('fs')
const cheerio = require('cheerio')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const ONE_PIECE_FOLDER_PATH = './one-piece/'
const CONFIG_FILE = './config.json'

global.counter = 0
global.numberOfChapters = 5

const options = {
  headless: true,
  // headless: false,
  // slowMo: 150
}

main()
function main() {
  startBot()
}

async function startBot() {
  const url = 'https://bacakomik.co/one-piece-chapter-001-bahasa-indonesia/'
  const url2 = 'view-source:https://bacakomik.co/one-piece-chapter-001-bahasa-indonesia/'

  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  try {
    await getChapter(page, url)

  } catch (error) {
    console.log('CATCH', error)
    await browser.close()
  }

  await browser.close()
}

async function getChapter(page, url) {
  if (counter >= numberOfChapters) return
  counter++

  await page.goto(url, { waitUntil: 'networkidle2' })

  // await page.waitForSelector('#chimg')
  // const result = await page.$$('#chimg')

  // cheerio
  // const asd = cheerio.load(bacakomik.text())  
  // console.log(222, asd('div', '#chimg'))

  // WORKS #1
  // const html = await bacakomik.text()
  // const { document } = (new JSDOM(html)).window
  // const arr = []
  // document.querySelector('#chimg').childNodes.forEach((item) => {
  //   arr.push(item.src)
  // })
  // console.log(arr)

  // WORKS #2
  const { currentUrl, title, nextChapterUrl, images } = await page.evaluate(() => {
    const currentUrl = document.URL
    const title = document.querySelector('.entry-title').textContent
    const nextChapterUrl = document.querySelector('.nextprev').lastElementChild.href
    const images = Array.from(document.querySelector('#chimg').childNodes).map(x => x.src && x.src).filter(y => y)
    return { currentUrl, title, nextChapterUrl, images }
  })
  // const { currentUrl, title, nextChapterUrl, images } = snap
  const chapterNumber = title.match(/\d{3}/)[0]

  const filePath = ONE_PIECE_FOLDER_PATH + `chapter-${chapterNumber}.json`
  const fileData = { url: currentUrl, title, images }
  const fileOptions = { spaces: 2, EOL: '\r\n' }
  jsonfile.writeFileSync(filePath, fileData, fileOptions)

  await getChapter(page, nextChapterUrl)
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

function getCounterValue() {
  return new Promise(async (resolve, reject) => {
    try {
      const { counter, ...configJson } = await jsonfile.readFile(CONFIG_FILE)
      const newConfigJson = {
        ...configJson,
        counter: counter + 1
      }
      jsonfile.writeFileSync(CONFIG_FILE, newConfigJson)
      resolve(counter)
    } catch (error) {
      reject(error)
    }
  })
}
