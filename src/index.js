const { Client } = require('discord.js');
const Database = require("@replit/database")
const http = require('http');
const { prefix } = require('./config.json');
const command = require('./command');

const db = new Database()
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

db.get("token").then(token => {
	bot.login(token);
});
let connectedAmount = 0;
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Pinged: ' + connectedAmount.toString());
});

server.on('connection', () => {
    connectedAmount++;
});
server.listen(3000);