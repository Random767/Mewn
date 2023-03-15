const { Client, GatewayIntentBits} = require('discord.js');
require('dotenv').config()
const { AutoPoster } = require('topgg-autoposter')
const fs = require('fs')
const path = require('path')
const log = require('./modules/logger')
process.title = 'Mewn'

const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ]
})
exports.client = client

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.exec(...args));
	} else {
		client.on(event.name, (...args) => event.exec(...args));
	}
}

if(process.env.TOPGG_TOKEN){
    AutoPoster(process.env.TOPGG_TOKEN, client)
}

process.on('uncaughtException', (err, origin) => {
    log.error(`${err}: ${origin}`)
    process.exit(1)
});

client.login(process.env.TOKEN)
