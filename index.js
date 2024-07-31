async function elBotMan() {
    const { Client, Intents, GatewayIntentBits } = require('discord.js');
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    require('dotenv').config();
    const TOKEN = process.env.TOKEN;
    const REST = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    const fs = require('fs');

    client.once('ready', async () => {
        console.log('Logged in as ' + client.user.tag);
        let update = fs.readFileSync('update.md');
        let oldUpdate = fs.readFileSync('oldupdate.md');
        if (update.toString() !== oldUpdate.toString()) {
            try {
                console.log("Sending update message")
                fs.writeFileSync('oldupdate.md', update);
                let guild = client.guilds.cache.get('1060699179879510128');
                // botnie-updates channel
                let channel = guild.channels.cache.get('1245793343858938047');
                await channel.send("## " + update);
                console.log("Update message sent")

                let oldUpdater = fs.writeFileSync('oldupdate.md', update);
            } catch (e) {
                console.log("Error sending update message: " + e.toString());
                fs.writeFileSync('oldupdate.md', " ");
            }
        }

        console.log('Started refreshing application (/) commands.');
        client.commands = new Map();
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

    function titlecaseSentences(string) {
        return string.replace(/(^\w{1})|(\.\s+\w{1})/g, letter => letter.toUpperCase());
    }

    client.on('messageCreate', async message => {
        if (message.author.id === client.user.id) return;
        fs.exists('./stories/' + message.channel.id + '.json', async function (exists) {
            if (exists) {
                const story = JSON.parse(fs.readFileSync('./stories/' + message.channel.id + '.json'));
                // Check that the same user is not adding to the story
                if (message.author.id === story.story[story.story.length - 1].author) {
                    const guildi = client.guilds.cache.get('1232760247748399114');
                    console.log(guildi);
                    const emojii = guildi.emojis.cache.find(emoji => emoji.name === 'angry');
                    console.log(emojii);
                    await message.reply({ content: 'You cannot add to the story twice in a row!\n' + emojii.toString(), ephemeral: true });
                    await message.delete();
                    return;
                    // Check if message is more than a word
                } else if (message.content.split(' ').length > 1) {
                    const guildi = client.guilds.cache.get('1232760247748399114');
                    console.log(guildi);
                    const emojii = guild.emojis.cache.find(emoji => emoji.name === 'angry');
                    console.log(emojii);
                    await message.reply({ content: 'You can only add one word at a time!\n' + emojii.toString(), ephemeral: true });
                    await message.delete();
                    return;
                }
                story.story.push({ author: message.author.id, content: message.content });
                fs.writeFileSync('./stories/' + message.channel.id + '.json', JSON.stringify(story));
                const googleTTS = require('google-tts-api');

                if (message.content.match(/(\.|!|\?)$/) && story.story.map((entry) => entry.content).join(' ').length < 1900) {
                    const guild = client.guilds.cache.get('1232760247748399114');
                    console.log(guild);
                    const emoji = guild.emojis.cache.find(emoji => emoji.name === 'happy');
                    console.log(emoji);
                    await message.react(emoji);

                    const sentences = story.story.map((entry) => entry.content).join(' ').split('. ').map(sentence => sentence.trim() + '.');
                    const storyText = sentences.join(' ');

                    // Generate TTS audio URL
                    const audioUrl = googleTTS.getAudioUrl(storyText, {
                        lang: 'en',
                        slow: false,
                        host: 'https://translate.google.com',
                    });

                    await message.reply("## Current story\n" + titlecaseSentences(sentences.join('\n')) + `\n\nListen to the story`);
                } else if (message.content.match(/(\.|!|\?)$/)) {
                    const fs = require('fs');

                    const guild = client.guilds.cache.get('1232760247748399114');
                    console.log(guild);
                    const emoji = guild.emojis.cache.find(emoji => emoji.name === 'happy');
                    console.log(emoji);
                    await message.react(emoji);

                    // Remove the first 10 entries in the story
                    story.story.shift();
                    fs.writeFile('./stories/' + message.channel.id + '.json', JSON.stringify(story));

                    const sentences = story.story.map((entry) => entry.content).join(' ').split('. ').map(sentence => sentence.trim() + '.');
                    const storyText = sentences.join(' ');

                    // Generate TTS audio URL
                    const audioUrl = googleTTS.getAudioUrl(storyText, {
                        lang: 'en',
                        slow: false,
                        host: 'https://translate.google.com',
                    });

                    await message.reply("## Current story\n" + titlecaseSentences(sentences.join('\n')) + `\n\nListen to the story`);
                }
            } else {
                story = { story: [{ author: message.author.id, content: message.content }] };
            }
        });
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        if (!client.commands.has(commandName)) return;
        try {
            await client.commands.get(commandName).execute(interaction, client);
            lastCommand = commandName;
        } catch (error) {
            try {
                lastError = error.toString() + " - Line 347";
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            } catch (e) {
                lastError = e.toString() + "while sending error message:" + error.toString() + " - Line 352";
                console.log(lastError);
            }
        }
    });

    await client.login(TOKEN);
}

elBotMan();
