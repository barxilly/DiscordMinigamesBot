module.exports = {
    data: {
        name: 'endstory',
        description: 'End a story',
    },
    async execute(interaction, client) {
        await interaction.deferReply();
        if (interaction.user.id !== '806130824256421948') {
            await interaction.editReply('You do not have permission to use this command!');
        } else {
            const fs = require('fs');
            const path = require('path');
            // Delete CHANNELID.json file in /stories directory, if it exists, if not say "No story to end"
            const channel = interaction.channel;
            const channelID = channel.id;
            const filePath = path.join(__dirname, '../stories', `${channelID}.json`);
            fs.exists(filePath, function (exists) {
                if (exists) {
                    fs.rmSync(filePath);
                    interaction.editReply('Story ended!');
                } else {
                    interaction.editReply('No story to end');
                }
            });

        }
    }
}
