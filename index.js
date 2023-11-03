const { Client, GatewayIntentBits} = require('discord.js');
require('dotenv').config()
const { AutoPoster } = require('topgg-autoposter')
const fs = require('fs')
const path = require('path')
const { version } = require('./package.json')
const log = require('./modules/logger')

const SimplDB = require('simpl.db')
const db = new SimplDB({
    collectionsFolder: __dirname + '/collections'
})
const Users = db.createCollection('users', {"ld": null, "notifications": {"daily": {"date": null}}, "coins": 0, aboutme: null, reps: 0, banned: false})

process.title = 'Mewn'

const client = new Client ({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    presence: {
        activities: [{
            name: `Versão ${version}`,
            type: 2
        }],
    }
})
exports.client = client
exports.Users = Users

require("./notifiers/daily.js")(client)

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
    console.error(err)
    console.error(origin)
    log.error(__filename, `${err}: ${origin}`)
});

process.on('unhandledRejection', (err, origin) => {
    console.error(err)
    console.error(origin)
    log.error(__filename, `${err}: ${origin}`)
});

client.login(process.env.TOKEN)
