async function elBotMan(){
    const { Client, Intents, GatewayIntentBits } = require('discord.js');
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    require('dotenv').config();
    const TOKEN = process.env.TOKEN;
    
    client.once('ready', () => {
        console.log('Ready!');
    });

    client.on('messageCreate', message => {
        if (message.content === 'ping') {
            message.reply('pong');
        }
    });
}