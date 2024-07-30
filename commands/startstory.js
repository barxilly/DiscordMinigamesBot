module.exports = {
    data: {
        name: 'startstory',
        description: 'Start a story',
    },
    async execute(interaction, client) {
        await interaction.deferReply();
        if (interaction.author.username !== 'eccdev'){
            await interaction.editReply('You do not have permission to use this command!');
            return;
        }
        const fs = require('fs');
        const path = require('path');
        // Create CHANNELID.json file in /stories directory
        const channel = interaction.channel;
        const channelID = channel.id;
        // If /stories directory does not exist, create it
        if (!fs.existsSync(path.join(__dirname, '../stories'))){
            fs.mkdirSync(path.join(__dirname, '../stories'));
        }
        const filePath = path.join(__dirname, '../stories', `${channelID}.json`);
        fs.writeFileSync(filePath, JSON.stringify({story: [{author: 0, content: 'Story started!'} ]}));

        await interaction.editReply('Story started!');
    }
}
