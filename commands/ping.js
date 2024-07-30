module.exports = {
    data: {
        name: 'ping',
        description: Math.random().toString(36).substring(7),
        "integration_types": [0, 1],
        "contexts": [0, 1, 2],
    },
    async execute(interaction, client) {
        await interaction.deferReply();
        if (interaction.user.id !== '806130824256421948') {
            await interaction.editReply('You do not have permission to use this command!');
        } else {
            await interaction.editReply(`Pong!`);
        }
    },
};

