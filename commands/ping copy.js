module.exports = {
    data: {
        name: 'ping',
        description: Math.random().toString(36).substring(7),
        "integration_types": [0,1],
        "contexts": [0, 1, 2],
    },
    async execute(interaction, client) {
        await interaction.reply(`Pong!`);
    },
};

