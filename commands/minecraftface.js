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
        const username = interaction.options.getString('username');
        const url = `https://mineskin.eu/helm/${username}/100.png`;
        await interaction.reply({content: url});
    },
}