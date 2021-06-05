const { Client } = require('discord.js');
const { token, prefix } = require('./config.json');
const command = require('./command');

const bot = new Client();

bot.once('ready', () => {
    console.log(`${bot.user.username} is ready`);
});

bot.on('message', async msg => {
    if(msg.author.bot) return;

    if(!msg.content.startsWith(prefix)) return;
    const args = msg.content.substr(prefix.length).split(/[ ]+/);
    const cmd = args[0].toLowerCase();

    await command(cmd, args, msg, bot);
});

bot.login(token);