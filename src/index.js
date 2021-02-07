require('dotenv').config()

var TelegramBot = require('node-telegram-bot-api');

var bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=`;

var request = require('request');

const getCaption = (res) =>  `Title: ${res.Title}\nYear: ${res.Year}`;

bot.onText(/\/movie (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var movie = match[1];

    request(`${url}${movie}`,async function (error, response, body){
        const res = JSON.parse(body);
        
        await bot.sendMessage(chatId, '_Looking for_ ' + movie + '...', { parse_mode: 'Markdown' });

        if (res.Response === 'False' && res.Error) {
            return bot.sendMessage(chatId, res.Error);

        } else if (!body.error && response.statusCode === 200) {
            if (res.Poster) return bot.sendPhoto(chatId, res.Poster, { caption: getCaption(res) });
            else return bot.sendMessage(chatId, getCaption(res));
        } 
    })
})