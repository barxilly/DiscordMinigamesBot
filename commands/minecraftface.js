module.exports = {
    data: {
        name: 'minecraftface',
        description: 'Pulls a Minecraft face from a username.',
        "integration_types": [0,1],
        "contexts": [0, 1, 2],
        options: [
            {
                name: 'username',
                description: 'The username of the player.',
                type: 3,
                required: true,
            },
        ],
    },
    async execute(interaction, client) {
        const axios = require('axios');
        const username = interaction.options.getString('username');
        const url = `https://mineskin.eu/helm/${username}/100.png`;
        await interaction.deferReply();
        axios.get(url, {responseType: 'arraybuffer'}).then(response => {
            const image = Buffer.from(response.data, 'binary').toString('base64');
            const embed = {
                "type": 4,
                "data": {
                    "content": "Here is the Minecraft face for " + username,
                    "embeds": [
                        {
                            "title": username,
                            "image": {
                                "url": `data:image/png;base64,${image}`
                            }
                        }
                    ]
                }
            };
            client.api.interactions(interaction.id, interaction.token).callback.post({data: embed});
        }).catch(error => {
            console.error(error);
            interaction.editReply('Error getting Minecraft face.');
        });
    },
}