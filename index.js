const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const fs = require('fs')
const cheerio = require('cheerio')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const ONE_PIECE_FOLDER_PATH = './one-piece/'
const CONFIG_FILE = './config.json'

let counter = 0
let numberOfChapters = 5
let duplicateChapterPostfix = 2

const fileOptions = { spaces: 2, EOL: '\r\n' }
const browserOptions = {
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
  const url2 = 'https://bacakomik.co/one-piece-chapter-985-bahasa-indonesia/'

  const browser = await puppeteer.launch(browserOptions)
  const page = await browser.newPage()

  try {
    await getChapter(page, url2)

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
  const snap = await page.evaluate(() => {
    const currentUrl = document.URL
    const title = document.querySelector('.entry-title').textContent
    const images = Array.from(document.querySelector('#chimg').childNodes).map(x => x.src && x.src).filter(y => y)
    const nextChapterUrl = document.querySelector('.nextprev').lastElementChild.href
    return { currentUrl, title, images, nextChapterUrl }
  })

  const { currentUrl, title, images, nextChapterUrl } = snap
  const chapterNumber = title.match(/\d{3}/)[0]
  const filePath = ONE_PIECE_FOLDER_PATH + `chapter-${chapterNumber}.json`
  const fileData = { url: currentUrl, title, images }

  if (fs.existsSync(filePath)) {
    const newFilePath = ONE_PIECE_FOLDER_PATH + `chapter-${chapterNumber}-${duplicateChapterPostfix}.json`
    jsonfile.writeFileSync(newFilePath, fileData, fileOptions)
    duplicateChapterPostfix++
  } else {
    jsonfile.writeFileSync(filePath, fileData, fileOptions)
    duplicateChapterPostfix = 2
  }

  await getChapter(page, nextChapterUrl)
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

function getCounterValue() {
  return new Promise((resolve, reject) => {
    (async function () {
      const { counter, ...configJson } = await jsonfile.readFile(CONFIG_FILE)
      const newConfigJson = {
        ...configJson,
        counter: counter + 1
      }
      jsonfile.writeFileSync(CONFIG_FILE, newConfigJson, fileOptions)
      resolve(counter)
    })()
  })
}
