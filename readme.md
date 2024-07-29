# Discord Minigames and Fun Bot

This is a discord bot that has a few minigames and fun commands. It is written in Javascript and uses the discord.js library.

## Commands

### One Word Story

- `/startstory` - Start a new one word story in whatever channel you are in.

  - After starting a story, you can add words to the story by typing them in chat.

- `/endstory` - End the current one word story.

### Minecraft Ideas

- `/minecraftidea` - Get a random minecraft idea.

### Realm Code

- `/realm` - Get the code for the realms server.
  - To use this command, you need to append your `.env` file with the following content:

    ```env
    REALM=YOUR_REALM_CODE // The realm code, not including realms.gg/
    REALMROLE=YOUR_REALM_ROLE // The role that can access the realm code, set to E if you want everyone to be able to access it
    ```

## Installation

1. Clone the repository

2. Add a `.env` file in the root directory with the following content:

    ```env
    TOKEN=YOUR_TOKEN
    ```

3. Install the dependencies

    ```bash
    npm i
    ```

4. Run the bot

    ```bash
    npm start
    ```
