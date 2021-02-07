import TelegramBot from 'node-telegram-bot-api';
import request from 'request';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=`;

const getCaption = (res) =>  `Title: ${res.Title}\nYear: ${res.Year}`;

bot.onText(/\/movie (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const movie = match[1];

    request(`${apiUrl}${movie}`, async (error, response, body) => {
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