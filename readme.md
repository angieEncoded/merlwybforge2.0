# MerlwybForge 2.0

- MerlwybForge is version 2 of the Merlwyb Senpai bot that I originally wrote for The Sanctum. That guild has long since disbanded and reformed under a new banner, Crystal Haven Gaming. I designed this bot to serve two Final Fantasy communities, the first of which is Gryphon's Hammer Forge, a small content-focused server run by a close friend. The bot will also eventually serve the Crystal Haven Gaming community server once she is stress-tested and verified stable.

## Notes about the bot's structure

- I followed the DiscordJS docs for most of the development. This is using v13 of DiscordJS. 
- The most notable deviation is that I am using ES6 modules and the docs are still using CommonJS.
    - I made this design choice because I work with React and I'm comfortable in ES6 module use. 
    - If you have questions about module use or issues with anything in her code, please open a discussion on the matter. I'll do my best to clear up whatever I can
- Merlwyb exclusively uses the new application commands (slash) syntax. Version 1.0 used prefixes. 
    - NOTE - most of the code for 1.0 has been lost so there is no historical record here of her 1.0 commands. I recreated this entirely from my personal, handwritten notes on her original development and all of her code was written from scratch
    - Since there were major, MAJOR changes from v12 to v13 I probably would have had to do this anyway even if I still had that old code. 
- I made the design decision to use a native SQL driver rather than an ORM, specifically the mysql2 package. This is a personal choice - while I appreciate the ease of use of ORMs like Sequelize and more recently my work with Django, I feel they teach the wrong thing and the level of abstraction sometimes hinders rather than helps. I prefer having control over the queries and tables created.


### Basic expectations in order to use this project
- Familiarity with Javascript
- Familiarity with Git and Github
- Familiarity with SQL-type databases
- Familiarity with DiscordJS
- Familiarity with your OS environment 


## How to install this bot on your own machine and in your server
- I developed her on Windows, but she will work equally well in a linux environment if you want to set up one
- This instruction manual will start with her required files and tell you exactly how to set up her environment
- If there are any questions or you feel you can explain something better in these docs, feel free to create a PR. I have a particular interest in good documentation, considering I am almost exclusively self-taught and have seen a LOT of projects with documentation that could be improved.

## What you need to run it
- You will need NodeJS 16.6+ since she is using DiscordJS v13
- You will need a database. I use MariaDB but any SQL database should work with some adjustments to the mysql2 package
    - You will find the SQL to create the tables she is expecting and some starter data in the sql folder
    - The files can be run at the command line or imported using a tool like HeidiSQL
- You will need a bot application in your own Discord Account at the Developer portal.
- You will need to assign her a role in your Discord that is above any roles you want her to be able to manage. 
- You will need to either make use of the dotenv environment file she is configured to use or set the following environment variables manually in whatever environment she will run in:
    - REQUIRED variables
```
BOT_TOKEN=
CLIENT_ID=
DBHOST=
DBUSERNAME=
DBPASSWORD=
DBNAME=
ADMIN=
DISCORDADMIN=
DISCORDMOD=
BOTCHANNEL=
```

- DISCORDADMIN is whatever role is allowed access to her 'higher' functions. This is usually the Administration team in your Discord
- DISCORDMOD is whatever role is allowed to access her 'mid-level' functions. This is usually a team of Moderators, but it can really be any role you assign to people that you trust to add things to her database. The DISCORDADMIN role has access to these functions as well so you do not need to set a DISCORDMOD role if you don't want to allow anyone but DISCORDADMIN to use this
- ADMIN should be the discord id of whoever she should ping when she has a problem.
- BOTCHANNEL is the name of the channel she can send her alert messages into - if she has a problem with permissions she will alert the ADMIN by ping in this channel - the default is bot-spam

- Some additional variables needed for command deployment depending on how you want to develop your version of the bot

```
CLIENT_ID=
GUILD_ID=
PRIVATE_TESTING_GUILD_ID=
BOT_TOKEN
```

- Place these in the .env file in the deployment folder to manage where she sends her slash commands. 
    - This is how I controlled which guild commands in development were sent to
        - Commands deployed globally filter down within an hour
        - Commands deployed to a specific guild, for example your testing guild, immediately deploy where you can test and debug before releasing them globally for general use
- run ```node deploy-SELECTED-COMMAND-FILE``` to register the commands - they are intuitively named
    - I had two testing servers, a main testing one and a private testing one. You may have only one, or none depending on whether you simply want to use her existing developed features or you want to develop your own new features based on her.
    - the global commands file will deploy her commands globally to all servers she is in - this would be the minimal file you want to run in order to use her in your main server

## More details on how to configure Merlwyb for use in your server

### Set up NodeJS

- Install NodeJS 16.6 or above - the defaults are fine, I use the defaults. You don't need the additional tools for C stuff in order to use this package, so you can skip the Chocolatey install. 
- Clone the repository from this github page
- Run npm install in her root directory to set up all her packages and deps
    - I recommend additionally installing VSCode and Git for Windows. 
        - I use VSCode for development and the Git Bash shell for my terminal

### Set up MariaDB or your choice of SQL database

- I am using MariaDB 10.6
    - You could alternatively use another sql-type database such as MySQL or Sqlite, but the SQL files I provided are specific to MariaDB 10.6 with InnoDB engine. If you have problems running this on another SQL-type database I may or may not be able to help. I'll do my best.
        - Some of the tables have different character sets in order to properly store the emojis. These were deliberately configured and if you change them the database might not properly store the emojis
- Once you have your chosen DB system, create a database for her with a name of your choice
- Create a user account for her to be able to read and write to that database
    - NOTE - the mysql2 package uses prepared statements by default to protect against SQL injection.
    - All the queries are written in such so-called prepared statements
- Then you can run the SQL files in /sql/tables to set up the tables she expects.
    - Run them at the command line or use your front-end administration tool of choice. I use and support the HeidiSQL project. 
- I have also provided some 'starter' data in /sql/starter-data for you to apply to her database, if you wish. This consists of bot statuses and some replies to her /notice-me-senpai command. 
- Fill out the .env file

### Create the bot application on Discord

- Create a bot application on the Discord Developer portal by going to the [Discord Developer Portal](https://discord.com/developers/docs/intro) and clicking on Applications
- Click on New Application and give your bot a name. On the next screen you could configure other things about your bot like a small profile and a picture. 
    - The most important thing you need from this screen is the Application ID which this program expects as an environment variable called CLIENT_ID
    - See below for an example .env file you could copy and use
- Click on Bot in the left panel and click the Add Bot button to turn this application into a bot
    - The most important thing on this screen is the Token and the Intents. Copy the token and place this in your .env file as TOKEN (see below for the .env file details) and turn on Privileged Intents, Server Member Intents, and Message Content Intents. 
        - Merlwyb is using all the new DiscordJS features so we are required by Discord to write in our intents. 
- Now you can click on OAuth2 and the URL generator. 
    - At a minimum, she needs the bot and applications.commands scopes so click those
    - And under permissions minimally she needs Manage Roles, Read Messages\View Channels, Send Messages, Manage Messages, Embed Links, Read Message History, Use External Emojis, Add Reactions, and Use Slash Commands
    - Once you have selected the permissions you want her to be able to use, copy the generated URL. It will look similar to this
    ```https://discord.com/api/oauth2/authorize?client_id=YOURBOTSCLIENTIDGOESHERE&permissions=545394781431&scope=bot%20applications.commands```
    - NOTE - this is the url I use, and it has additional permissions which you will be presented with when you use the link to add the bot to the server. You may not want her to have all these permissions, and you should be sure you know what you are doing before you add these permissions to your server. Bots are EXTREMELY powerful. 
    - Copy the URL into a browser window and follow the instructions to add the new bot to your server. 
- Now you have all the Discord-related information she will need to run. 

### Run your new bot!
- Fill out the rest of the .env file \(or set up your environment variables according to the documentation for your OS\)
- Once you have all these things filled out, you are ready to bring her online. 
    - There are multiple ways to bring her online. Locally I use the nodemon package to run my applications, when I am developing 
        - Install this globally on your system with ```npm install -g nodemon```
            - Note, sometimes there are some path issues with Nodemon. Make sure that you set up the path to the nodemon directory if it didn't automatically set itself up.
- If you are setting her up on a Linux server, I will provide below an example file that will configure her for systemd systems. I tend to use Red Hat based linux servers and so I will provide basic instructions for that, but any distro that uses systemd can use these instructions with a few modifications, I'm sure.

- Example service file
    - Create a file in the /etc/systemd/system folder called something like node_online.service
        - ```sudo nano /etc/systemd/system/node_online.service```
    - Place, at a minimum, the contents below
```
[Unit]
Description=Node Online Service
After=network.target

[Service]
Type=simple
User=userAccount
WorkingDirectory=path/to/app/folder
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=appName
ExecStart=/usr/bin/node Path/to/app/app.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
- If you want, you can place the environment variables inside the \[Service\] section instead of using the .env file in her root directory
- The format is 
```
Environment=ENVIRONMENTVARIABLENAME=ENVIRONMENTVARIABLEVALUE
```
- Once you have created this file, register it with the system with ```sudo systemctl daemon-reload```
- Enable the service so systemd starts to manage it ```sudo systemctl enable node_online```
- Control the service with the following commands:

```systemctl start node_online```

```systemctl status node_online```

```systemctl stop node_online```

- Once you start her up, if she crashes for whatever reason, the system will start her back up again automatically. 

- If you want to see why she crashed, she'll likely have details in her logs, and additionally the server should have some details in the journal:

```journalctl -u node_online.service```

### Additional Help
- If you need some additional help, I have a collection of notes here on github that covers a variety of topics including linux configuration and installation. My notes were written alongside my development of web apps, but the underlying NodeJS system is the same regardless of whether it's a web app or a quasi-command-line tool such as this one. 
- Again, anything that could be improved in this documentation is welcomed in a PR. 

## Merlwyb's Commands

### Basic Commands
- Current working basic commands:
    - ```/ping```
        - everybody's first command!
    - ```/server``` 
        - responds with information on the server
    - ```/user```
        - responds with your user information
    - ```/clean```
        - If you have the ADMIN role, this will clean up the last 100 messages in the channel. I found this helpful during development to clean up my spam. 
        - Note that this will not clean up messages older than 14 days. 
    - ```/notice-me-senpai```
        - This was a historical 'fun' command that she had from the old days. When you run this command, Merlwyb will issue a (usually) scathing reply from her arsenal of quotes stored in a back end database. This was part of the old functions that needed to be converted to slash commands + es6 + actually put in a database. Originally, I just had it sitting in a hard-coded array. 
    - ```/add-bot-status```
        - This will allow anyone with the DISCORDMOD or DISCORDADMIN role a status to Merlwyb's database. She requires a "type" - PLAYING, STREAMING, WATCHING, LISTENING - and a string detailing the activity. 
    - ```/add-notice-me```
        - This will allow anyone with the DISCORDMOD or DISCORDADMIN role to add to her database of (usually) scathing replies. She requires merely a string with how you think she might respond to someone asking for her attention.

### Advanced Commands
- Reaction roles - available to DISCORDADMIN
    - In order to use the Reaction Roles, you will first need to set up a message through the bot 
        - Use ```/create-reaction-message``` in order to create a new message for Merlwyb to add reactions to
        - This command takes three optional parameters - a title, the name of the channel you want to deploy the message in, and any notes you want as a part of the message
        - She will construct an empty Embed message and deploy it in the channel you specified, or reaction-roles if you took the defaults
        - Her defaults are as follows:
            - title: "Reaction Roles"
            - channel: "reaction-roles"
            - notes: "React below to obtain a role."
        - Once you have created the message, she will save a record in the database and provide you with feedback about how to take the next step in a response only you can see (ephemeral: true)
    - The next step is to add the reaction roles to the message you want her to be able to work with
        - use ```/add-reaction``` to create a new reaction to add to the message. 
        - You will need the message id, which Merlwyb will return to you upon creation of a new message, or you can use the 'more' menu on the existing message to obtain the message ID from Discord
        - You must provide Merlwyb with a message id, the role you want to assign and the reaction emoji you want. Merlwyb has access to any Discord emoji in any server she lives in and can use both Discord's default emojis and custom emojis (such as the ones you might manually upload for FFXIV)
        - Once you have issued the command with the parameters she wants, she will add the reaction to the message and store it in the database along with the message it is assigned to. 
    - The final step is to inform your users that they can now use reaction roles! When a user clicks on the reaction, Merlwyb will assign the user the target role. 
    - The user can click the icon again to remove the role from themselves.
    - In order to remove a reaction from an existing message, issue the ```/delete-reaction``` command with the message ID and the reaction you wish to remove. Merlwyb will remove all the reactions and edit her post to reflect the new set of reactable roles
    - If you wish to delete the message entirely, then issue the ```/delete-reaction-message``` command with the appropriate message id.
        - Merlwyb will delete the message and the associated reactions from the database. 


### Standard features
- Merlwyb will change her status, pulling one randomly from her database every hour. See 'Basic Commands' for information on how to add additional statuses for her.

### Logging
- Merlwyb is logging using Winston and winston-daily-rotate-file. Her error logs are stored in her root path in a folder called logs. 
- In order to see her logs in your terminal during development, go into the /util/logging.js file and make sure that ```new winston.transports.Console(),``` is uncommented and she will log errors to the terminal for you

## Final thoughts
- I hope that this project helps some folks with getting their own bots online. When I first started developing, I found that tutorials were often lacking in the most robust and useful features of the bots. That may be out of necessity - working with a back end database is perhaps a more advanced use of javascript and requires additional knowledge. So I built this project and decided to open-source it so that the knowledge is in one place and can be forked\improved\collaborated on. 
- Development of new features by me will be limited to what my specific group requires and requests, but the sky is the limit for what this bot could potentially do, and of course I'll consider any general requests that might make her more useful to more people.
- Thanks for checking out this project, and I hope to see many of you in-game!

~ Josie Revisited, also known as Last Hero on the Coeurl server, and Josie the 'Flight Attendant' if you've ever heard my callouts in Baldesion Arsenal.