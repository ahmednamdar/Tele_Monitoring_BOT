const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const cheerio = require('cheerio');


const botToken = '6258175288:AAEe76JEBl6mkzAEXANo5Jo9Qs428Gj4T8I';


const bot = new TelegramBot(botToken, {polling: true});


function fetchWebsiteData(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

function extractInfoFromWebsiteData(websiteData) {
  
  const $ = cheerio.load(websiteData);
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content');
  const metaKeywords = $('meta[name="keywords"]').attr('content');



  const extractedInfo = {
    title,
    metaDescription,
    metaKeywords
  };
  return extractedInfo;
}

bot.onText(/\/monitor (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const websiteUrl = match[1]; 

  fetchWebsiteData(websiteUrl)
    .then(websiteData => {
      const extractedInfo = extractInfoFromWebsiteData(websiteData);

      bot.sendMessage(chatId, `Title: ${extractedInfo.title}\nDescription: ${extractedInfo.metaDescription}\nKeywords: ${extractedInfo.metaKeywords}`);
    })
    .catch(error => {
      console.error(error); 

      
      bot.sendMessage(chatId, 'Failed to fetch website data. Please check the URL and try again.');
    });
});
