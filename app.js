require('dotenv/config')
let tmi = require("tmi.js"),
    http = require('http');
    function randomInt(max) {
        return (Math.floor(Math.random() * max) /**+ 1*/);
    }
const fs = require('fs');
const config = require('./config.json');
const channels = fs.readFileSync('./channels.list').toString().split('\n');

let options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: config.client.name,
        password: process.env.TMI
    },
    channels: channels
}

let client = new tmi.client(options);
client.connect();

client.on('hosted', (channel, username) => {
    client.say(channel, `${username} is now hosting ${channel}`)
})

client.on('raided', (channel, username, viewers) => {
    client.say(channel, `${username} Has started a raid`)
})

client.on('slowmode', channel => {
    client.say(channel, 'Slowmode is now active!')
})

// Todo: Turn on msg

client.on('message', (channel, tags, message, self) => {
    const channelName = channel.slice(1)
    let isModUp = tags['user-type'] === 'mod';
    let isBroadcaster = channel.slice(1) === tags.username;
    let isMod = isModUp || isBroadcaster;
    function send(text) {
        client.say(channel, text)
    }
    if (message.slice(1).toLowerCase().startsWith('piny')) {
        send('Piny | He/They | Bi | bit.ly/m/Piny')
    }

    if (message === 'bye') {
        send(`Cya ${tags.username}!`)
    }
	if(self || !message.startsWith('$')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'echo') {
		client.say(channel, `${args.join(' ')}`);
	}

    if (channelName === 'quimbyalert') {
        // Quimby custom commands
        if (command === 'permit') {
            const user = args[0]
            const permit = message.replace(user, '').replace(command, '').slice(1)
            let success = randomInt(3)
            if (success == 1) {
                send(`${user} was approved for ${permit}`)
            } else {
                send(`${user} was not approved for a permit for ${permit}`)
            }
        }
    }

    if(command === 'quimbyisbad') {
        client.say(channel, `Take that back RIGHT NOW`)
    }

    if (command === 'ping') {
        send('Pong!')
    }

    if (command === 'vibecheck') {
        let limit = parseInt(args)
        const vibe = randomInt(limit)
        if (message.replace(/[ ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>.-]/g, '') === '$vibecheck') {
            client.say(channel, `Invalid Syntax! the syntax is "$vibecheck <limit>"`)
            return
        }
        if (message.endsWith('--settings')) {
            send(`Options: limit (NUMBER)`)
        } else {
            if (message.endsWith('-qube')) {
                if (channelName === 'quimbyalert') {
                send(`The qube has a ${vibe + 10}/${limit} vibe`)
                } else {
                    send(`This option is not allowed on ${channelName}'s channel!`)
                }
            } else {
        client.say(channel, `You have a ${vibe}/${limit} vibe`)
            }
        }
    }

    if (command === 'addquote') {
        if (isMod || config.Owners.includes(tags.username)) {
            const quote = message.replace(/addquote/, '').slice(2)
            try {
            if (fs.existsSync(`./settings/${channelName}`)) {
                if (fs.existsSync(`./settings/${channelName}/quotes`)) {
                    const oldQuoteAmount = fs.readdirSync(`./settings/${channelName}/quotes`).length;
                    const newQuoteAmount = oldQuoteAmount + 1
                    fs.writeFileSync(`./settings/${channelName}/quotes/${newQuoteAmount}.quote`, quote)
                    send(`Created quote '${quote}' with the id ${newQuoteAmount}`)
                } else {
                    fs.mkdirSync(`./settings/${channelName}/quotes`)
                    const oldQuoteAmount = 0;
                    const newQuoteAmount = oldQuoteAmount + 1
                    fs.writeFileSync(`./settings/${channelName}/quotes/${newQuoteAmount}.quote`, quote)
                    send(`Created quote '${quote}' with the id ${newQuoteAmount}`)
                }
            } else {
                fs.mkdirSync(`./settings/${channelName}`);
                send('Please run the command again we are setting up this channels settings at the moment.');
            }
        } catch {
            send('Something went wrong!')
            console.log('So uhh we have a issue here')
        }
        } else {
            send('You need to be a mod or a bot owner to run this command')
        }
    }

    if (command === 'quote') {
        try {
            if (fs.existsSync(`./settings/${channelName}`) && fs.existsSync(`./settings/${channelName}/quotes`)) {
                const quoteAmount = fs.readdirSync(`./settings/${channelName}/quotes`).length;
                if (quoteAmount == 0) {
                    send(`No quotes were found for ${channelName}.`)
                } else {
                    if (message.match(/[1234567890]/)) {
                        console.log('Int check passed')
                        const lookupIdStr = message.replace(/[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijjklmnopqrstuvwxyz<>.,'#:;]/g, '')
                        const lookupId = parseInt(lookupIdStr);
                        if (!lookupId > quoteAmount) {
                            const quote = fs.readFileSync(`./settings/${channelName}/quotes/${lookupId}.quote`).toString();
                            send(quote)
                        } else {
                            send(`Invalid Id!`)
                        }
                    } else {
                        console.log('Int check failed')
                        const quoteId = randomInt(quoteAmount)
                        if (!fs.existsSync(`./settings/${channelName}/quotes/${quoteId}.quote`)) {
                            return send('Something went wrong while grabbing quote')
                        }
                        const quote = fs.readFileSync(`./settings/${channelName}/quotes/${quoteId}.quote`);
                        send(quote)
                    }
                }
            } else {
                send(`We could not find any data for ${channelName}.`)
            }
        } catch {
            send('Something went wrong')
        }
    }

    if (command === 'dice') {
        const P = (randomInt(9) + 1)
        const C = (randomInt(9) + 1)

        send(`You roll the dice and get ${P}`);
        setTimeout(() => {
           send(`I roll ${C}`);
           if (P > C) {
            setTimeout(() => {
                send(`Fine you win`)
            }, 2000);
           } else {
            setTimeout(() => {
            send(`Good luck next time`)
            }, 2000)
           }
        }, 2000);
    }
});

let server = http.createServer(); 
server.listen(80);