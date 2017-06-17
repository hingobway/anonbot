# anonbot

A Discord bot facilitating anonymous messages.

## How it Works
1. Users type `;anon` in a channel. They get a message giving a target for that channel, as well as a DM with instructions.
2. Users either paste the target from the server message, or follow the instructions in their DMs to set one themselves.
3. Users type messages in their DM with anonbot, and anonbot posts those messages anonymously in the target channel.

## Admins
Anonbot has no visible logs of messages and authors--it's anonymous. But, there is a way to keep people on track. Here's what to do if you see an anonbot message that's problematic (you have to be listed as an anonbot mod in the config.ini file first):

1. Make sure you have [developer mode enabled](https://github.com/hingobway/coolbot/wiki/Enabling-Developer-Mode).
2. Right click the problematic message, and click "Copy ID".
3. In your anonbot DMs, type `blist [the user's ID]`. (Don't include brackets.)
4. Anonbot will prevent that user from being able to use anonbot anymore. See [below](#flaws-and-recommendations) for how to un-blacklist someone.

## Installation

1. [Download the code](https://github.com/hingobway/anonbot/archive/master.zip) or clone the repository.
2. Install [node.js](https://nodejs.org/en/download) on your computer.
3. Open a terminal window in the folder where you put the source, and type the following command:

       npm install
4. [Go here](https://discordapp.com/developers/applications/me) and create a new Bot User.
5. Duplicate `config.tmp.ini` and rename the duplicate `config.ini`.
6. Open `config.ini` and paste your token, as well as the IDs for any mods you'd like to have.
7. In terminal, type the following:

       node .

You're done! In this mode, the bot will go offline as soon as you close that terminal window. See the next section for a workaround.

## Flaws and Recommendations

- AnonBot can currently only send text messages. **No images** yet, but **links and formatting** will go through.
- Currently the only way to un-blacklist someone is manually. To do this, [figure out their ID](https://discordapp.com/oauth2/authorize?client_id=318830952669249538&scope=bot&permissions=125952) and then find and remove that ID from the `blacklist.txt` file.
- Setting targets is still very confusing, and may be difficult for some users to do. Simply tell them to paste the target from their response message. **You also may want to pin the target for each channel to make it easier for people.**
- The way node functions automatically, you can't have programs running in the background very easily. Fortunately, there are ways around this. Below is my favorite.
  1. Open terminal in the source folder, and type the following command:

         npm install -g pm2
  2. Make sure you're still in the folder, and that you aren't running the bot in another window. Then, run the following command:

         pm2 start index.js --name="anonbot"
        Unfortunately, you'll still have to run this every time your computer restarts. There is a way around this as well, but it's a little in-depth for this. [Click here](http://npm.im/pm2-windows-startup) for more info.
  3. The bot should now be running in the background. Here are a few useful commands now that you know that:

To view the bot logs:

    pm2 logs anonbot
To restart the bot:

    pm2 restart anonbot

[Questions, requests, or problems?](https://github.com/hingobway/anonbot/issues/new)
