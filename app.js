require('dotenv/config')
let tmi = require("tmi.js"),
    http = require('http');
    function randomInt(max) {
        return Math.floor(Math.random() * max);
    }

let options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "DaalBotT",
        password: process.env.TMI
    },
    channels: ["DaalSAVAGE786", "QuimbyAlert", "daalbott", "PatheticChris"]
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
    let isMod = tags['user-type'] === 'mod';
    let isBroadcaster = channel.slice(1) === tags.username;
    let isModUp = isMod || isBroadcaster;
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

    // TODO: Make ban command

    if(command === 'quimbyisbad') {
        client.say(channel, `Take that back RIGHT NOW`)
    }

    if (command === 'ping') {
        send('Pong!')
    }

    if (command === 'vibecheck') {
        let limit = parseInt(args)
        const vibe = randomInt(limit)
        if (message.replace(/[ ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>.]/g, '') === '$vibecheck') {
            client.say(channel, `Invalid Syntax! the syntax is "$vibecheck <limit>"`)
            return
        }
        if (message.endsWith('--settings')) {
            send(`Options: limit (NUMBER)`)
        } else {
            if (message.endsWith('-qube')) {
                send(`The qube has a ${vibe + 10}/${limit} vibe`)
            } else {
        client.say(channel, `You have a ${vibe}/${limit} vibe`)
            }
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