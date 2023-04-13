const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const cheerio = require('cheerio');

// Replace with your Telegram bot token
const botToken = '6258175288:AAEe76JEBl6mkzAEXANo5Jo9Qs428Gj4T8I';

// Create a new Telegram bot instance
const bot = new TelegramBot(botToken, {polling: true});

// Function to fetch website data
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

// Function to extract relevant information from website data
function extractInfoFromWebsiteData(websiteData) {
  // Use Cheerio library to parse the HTML and extract relevant information
  const $ = cheerio.load(websiteData);
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content');
  const metaKeywords = $('meta[name="keywords"]').attr('content');

  // You can implement additional logic here to extract other relevant information from the website data

  // Return the extracted information as an object or array
  const extractedInfo = {
    title,
    metaDescription,
    metaKeywords
  };
  return extractedInfo;
}

// Listen for incoming messages from Telegram users
bot.onText(/\/monitor (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const websiteUrl = match[1]; // Extract the website URL from the command message

  fetchWebsiteData(websiteUrl)
    .then(websiteData => {
      const extractedInfo = extractInfoFromWebsiteData(websiteData);

      // Send the extracted information as a reply to the Telegram user
      bot.sendMessage(chatId, `Title: ${extractedInfo.title}\nDescription: ${extractedInfo.metaDescription}\nKeywords: ${extractedInfo.metaKeywords}`);
    })
    .catch(error => {
      console.error(error); // Handle any errors that may occur during the website data fetching process

      // Send an error message to the Telegram user
      bot.sendMessage(chatId, 'Failed to fetch website data. Please check the URL and try again.');
    });
});
