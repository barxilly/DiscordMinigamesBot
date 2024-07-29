async function elBotMan(){
    const { Client, Intents, GatewayIntentBits } = require('discord.js');
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    require('dotenv').config();
    const TOKEN = process.env.TOKEN;
    const fs = require('fs');

    client.once('ready', async () => {
        client.commands = new Map();
        // Get all .js files in /commands directory
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        // Loop through each file and register the command
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            const data = command.data;
            //await client.application.commands.create(data);
            client.commands.set(data.name, command);
            console.log(`Command ${data.name} registered`);
        }
        console.log('Ready!');
    });

    client.on('messageCreate', async message => {
        if (message.author.id === client.user.id) return;
        fs.exists('./stories/' + message.channel.id + '.json', async function(exists){
            if (exists){
                const story = require('./stories/' + message.channel.id + '.json');
                // Check that the same user is not adding to the story
                if (message.author.id === story.story[story.story.length - 1].author){
                    await message.reply({content:'You cannot add to the story twice in a row!', ephemeral: true});
                    await message.delete();
                    return;
                }
                story.story.push({author: message.author.id, content: message.content});
                fs.writeFileSync('./stories/' + message.channel.id + '.json', JSON.stringify(story));
                if (message.content.match(/(\.|!|\?)$/) && story.story.map((entry) => entry.content).join(' ').length > 2000){
                    await message.reply("Current story: " + story.story.map((entry) => entry.content).join(' '));
                } else if (message.content.match(/(\.|!|\?)$/)){
                    // Remove the first 10 entries in the story
                    story.story.shift();
                    fs.writeFileSync('./stories/' + message.channel.id + '.json', JSON.stringify(story));
                    await message.reply("Current story: " + story.story.map((entry) => entry.content).join(' '));
                }
            }
        });
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const {commandName} = interaction;
        if (!client.commands.has(commandName)) return;
        try {
            await client.commands.get(commandName).execute(interaction, client);
            lastCommand = commandName;
        } catch (error) {
            try {
                lastError = error.toString() + " - Line 347";
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            } catch (e) {
                lastError = e.toString() + "while sending error message:" + error.toString() + " - Line 352";
                console.log(lastError);
            }
        }
    });

    await client.login(TOKEN);
}

elBotMan();
