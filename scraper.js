require('dotenv').config()
const puppeteer = require('puppeteer');
const path = require('path')
const {
  LOGIN_MAIL,
  LOGIN_PASS,
  LOGIN_METHOD
} = process.env
const day = 1000*60*60*24

const skillsBuild = 'https://bundles.yourlearning.ibm.com/skills/professional-skills/'

const loginSelectors = {
  linkedin:{
    mail:'#username',
    pass:'#password',
    login:'#app__container > main > div.flavor > form > div.login__form_action_container.login__form_action_container--multiple-actions > button'
  },
  google:{
    mail:'#identifierId',
    pass:'#password',
    login:'#identifierNext'
  },
  ibm:{
    mail:'#username',
    pass:'#password',
    login:'#signinbutton'
  }
}
const selectors = loginSelectors[LOGIN_METHOD]

function extractURLs (elements) {
  return elements.map(element =>element.href)

}

async function getSales(){
  console.log('started')

  const browser = await puppeteer.launch({
    // headless: false,
    timeout:4000
  })
  async function doTrack (link){
    const page = await browser.newPage()
    await page.goto(link)
    await page.waitForSelector('.track-activity')
    const activities = await page.$$eval(
      '.track-activity',
      extractURLs
      )
    await page.close()
    return activities
  } 
  async function doActivity (link){
    const page = await browser.newPage()
    await page.goto(link) 
    await page.waitForSelector('.footer',{
      timeout:0
    })
    const test = await page.$(".full-activity-confirm-play")
    if(test){
      await page.close()
      return 'big test on '+link
    }
    const checked = await page.$('.checked')
    try{
      await checked.click()      
    }catch(err){
      await page.close()
      return 'done'
    }
    // const checked = await page.$$('.custom-checkbox')
    // try{
    //   await checked[0].click()      
    // }catch(err){
    //   await page.close()
    //   return 'done'
    // }
    const modal1 = await page.$eval('.modal-body',(ele=>ele.childElementCount),{
      timeout:1500,
    })
    const modal2 = await page.$eval('.modal-body',(ele=>ele.childElementCount),{
      timeout:1500,
    })
    if(modal1&&modal2){
      await page.close()
      return 'test on '+link
    }
    await page.close()
    return 'done'
  }
   

  const page = await browser.newPage() 
    await page.goto(skillsBuild)
    await page.waitForSelector(`.${LOGIN_METHOD}`)
    console.log('loaded page')

    const signin = await page.$(`.${LOGIN_METHOD}`)
    signin.click()
    await page.waitForSelector(selectors.mail)
    console.log('logging in with '+LOGIN_METHOD)

    const username = await page.$(selectors.mail)
    for(let l of LOGIN_MAIL.split('')){
      username.type(l)
    }
    if(LOGIN_METHOD==='google'){
      await page.$('#identifierNext').click()
    }
    if(LOGIN_METHOD==='ibm'){
      await page.$('#continue-button').click()
    }
    const password = await page.$(selectors.pass)
    await password.type(LOGIN_PASS)
    const login = await page.$(selectors.login)
    login.click()
    await new Promise((res)=>setTimeout(()=>{res()},3000))
    // page.goto(skillsBuild)
    await page.waitForSelector('.track-selection-content',{
      // timeout:5000
    })
    console.log("I'm in")
    const tracks = await page.$$eval(
      '.track-selection-title',
      extractURLs
      )
    console.log("Got Tracks")

    for(let track in tracks){
      const index = Number(track)+1
      console.log('doing track '+index)
      const activites = await doTrack(tracks[track])
      const result =  await Promise.all(
        activites.map(
          async(act)=>await doActivity(act)
        )
      )
      const results = result.filter(act=>act!=='done')
      console.log('track '+index+' results:\n'+results.join(
        '\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'
        ))
    }

    console.log('finished')
    browser.close()
}
getSales()
