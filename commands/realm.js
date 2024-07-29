module.exports = {
    data: {
        name: 'realm',
        description: 'Gives the code to the community realm.',
        "integration_types": [0,1],
        "contexts": [0, 1, 2],
    },
    async execute(interaction, client) {
        require('dotenv').config();
        const REALM = process.env.REALM;
        const REALMROLE = process.env.REALMROLE;

        if (REALM === undefined || REALMROLE === undefined){
            await interaction.reply('The realm code is not set up. If you are the bot owner, please set the REALM and REALMROLE environment variables.');
        } else {
            const role = interaction.guild.roles.cache.find(role => role.name === REALMROLE);
            if (role === undefined){
                await interaction.reply('The realm role is not set up. If you are the bot owner, please set the REALMROLE environment variable.');
            } else if (interaction.member.roles.cache.has(role.id) || REALMROLE === "E"){
                await interaction.reply('The community realm code is: ' + REALM);
            } else {
                await interaction.reply('You do not have access to the realm code.');
            }
        }
    },
};

