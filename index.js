const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

async function elBotMan() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    const TOKEN = process.env.TOKEN;

    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}`);
        await handleUpdateMessage(client);
        await refreshCommands(client);
        console.log('Ready!');
    });

    client.on('messageCreate', async message => {
        if (message.author.id === client.user.id) return;

       
        if (message.content.includes("Diggin")) {
           
            const randomChance = Math.floor(Math.random() * 5) + 1;
           
            if (randomChance === 1) {
                const poopEmoji = '💩';
                await message.react(poopEmoji);
            }
        }

        await handleStoryMessage(client, message);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        await handleCommandInteraction(client, interaction);
    });

    await client.login(TOKEN);
}

async function handleUpdateMessage(client) {
    const update = fs.readFileSync('update.md').toString();
    const oldUpdate = fs.readFileSync('oldupdate.md').toString();

    if (update !== oldUpdate) {
        try {
            console.log("Sending update message");
            fs.writeFileSync('oldupdate.md', update);

            const guild = client.guilds.cache.get('1060699179879510128');
            const channel = guild.channels.cache.get('1245793343858938047');
            await channel.send(`## ${update}`);
            console.log("Update message sent");
        } catch (e) {
            console.error(`Error sending update message: ${e}`);
            fs.writeFileSync('oldupdate.md', " ");
        }
    }
}

async function refreshCommands(client) {
    console.log('Started refreshing application (/) commands.');
    client.commands = new Map();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        console.log(`Command ${command.data.name} registered`);
    }
}

async function handleStoryMessage(client, message) {
    const storyFilePath = `./stories/${message.channel.id}.json`;

    if (fs.existsSync(storyFilePath)) {
        const story = JSON.parse(fs.readFileSync(storyFilePath));

        if (message.author.id === story.story[story.story.length - 1].author) {
            await sendErrorMessage(client, message, 'You cannot add to the story twice in a row!');
            return;
        }

        if (message.content.split(' ').length > 1) {
            await sendErrorMessage(client, message, 'You can only add one word at a time!');
            return;
        }

        story.story.push({ author: message.author.id, content: message.content });
        fs.writeFileSync(storyFilePath, JSON.stringify(story));

        const guild = client.guilds.cache.get('1232760247748399114');
        const emoji = guild.emojis.cache.find(emoji => emoji.name === 'happyliz');
        if (message.content.match(/[\.\?\!]/)) {
            await handleStoryCompletion(client, message, story);
        }
        await message.react(emoji);

        
    } else {
    }
}

async function sendErrorMessage(client, message, errorMessage) {
    const guild = client.guilds.cache.get('1232760247748399114');
    const emoji = guild.emojis.cache.find(emoji => emoji.name === 'angry');
    await message.reply({ content: `${errorMessage}\n${emoji}`, ephemeral: true });
    await message.delete();
}

async function handleStoryCompletion(client, message, story) {
    const sentences = story.story.map(entry => entry.content).join(' ').split('. ').map(sentence => sentence.trim());
    const storyText = sentences.join(' ');

    const googleTTS = require('google-tts-api');
    const audioUrl = googleTTS.getAudioUrl(storyText, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
    });

    await message.reply(`## Current story\n${titlecaseSentences(sentences.join('\n'))}\n\n[Listen to the story](${audioUrl})`);

    if (storyText.length >= 1900) {
        story.story.shift();
        fs.writeFileSync(`./stories/${message.channel.id}.json`, JSON.stringify(story));
    }
}

async function handleCommandInteraction(client, interaction) {
    const { commandName } = interaction;

    if (!client.commands.has(commandName)) return;

    try {
        await client.commands.get(commandName).execute(interaction, client);
    } catch (error) {
        console.error(`Error executing command ${commandName}: ${error}`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

function titlecaseSentences(string) {
    // Split the string into sentences, capitalize the first letter of each sentence, lowercase the rest of the sentence, stitch it back together. Sentences can end with ., !, or ?
    const sentences = string.split(/(?<=[.!?])\s+/);
    const titlecaseSentences = sentences.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase());
    return titlecaseSentences.join(' ');
}

elBotMan();