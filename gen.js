const fs = require("fs");

function genName() {
    let name = `${Math.floor(Math.random() * 99)}`

    return name;
}

function genPass() {
    let unicodeChars = ["@", "!", "#", "-", "*", "$", "%", "^", "&", "+", "_", ".", ",", "<", ">"];
    let pass = `${unicodeChars[Math.floor(Math.random() * unicodeChars.length)]}${Math.floor(Math.random() * 99999)}${unicodeChars[Math.floor(Math.random() * unicodeChars.length)]}`

    return pass;
}

class DeletionQueue {
    constructor(rateLimit, interval) {
        this.rateLimit = rateLimit; // Max number of deletions per interval
        this.interval = interval; // Interval in milliseconds
        this.queue = [];
        this.activeDeletions = 0;
        this.processQueue();
    }

    enqueue(task) {
        this.queue.push(task);
    }

    async processQueue() {
        if (this.activeDeletions < this.rateLimit && this.queue.length > 0) {
            const task = this.queue.shift();
            this.activeDeletions++;
            await task();
            this.activeDeletions--;
        }
        setTimeout(() => this.processQueue(), this.interval / this.rateLimit);
    }
}

const deleteQueue = new DeletionQueue(5, 1000);

class RateLimit {
    constructor(interval_ms) {
      this.interval_ms = interval_ms;
      this.canSpend = true;
  
      this.interval = setInterval(() => {
        this.canSpend = true;
      }, this.interval_ms);
    }
  
    spend() {
      if (this.canSpend) {
        this.canSpend = false;
        return true;
      } else {
        return false;
      }
    }
  
    destroy() {
      clearInterval(this.interval);
    }
  }

const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder  } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.once('ready', () => {
    console.log('Ready!');
});

const grabifyLinks = [
    "grabify.link",
    "bmwforum.co",
    "leancoding.co",
    "spottyfly.com",
    "spottyfly.tk",
    "yoütu.be",
    "yoütübe.co",
    "quickmessage.io",
    "shrekis.life",
    "shrekis.life",
    "headshot.monster",
    "gaming-at-my.best",
    "progaming.monster",
    "yourmy.monster",
    "screenshare.host",
    "screenshare.site",
    "checkurl.info",
    "dataresolver.org",
    "dataresolver.info",
    "blinky.site",
    "spottyfly.ga",
    "geotrack.ga",
    "geoiplog.xyz",
    "iplogger.org",
    "2no.co",
    "ipgrab.org",
    "blasze.com",
    "grabify.in",
    "ip-grabber.com",
    "ipgraber.ru",
    "iplis.ru",
    "skidpaste.org",
    "anonclicks.com",
    "logintracking.org",
    "lnks.co",
    "trackurl.in",
    "weebly.co",
    "viraloca.com",
    "linktrack.info",
    "miplogger.com",
    "privatehost.us",
    "cyberhubs.xyz",
    "hideurl.in",
    "youshort.me",
    "fortify.cx",
    "shorturl.gg",
    "linkify.site",
    "zuffo.org",
    "l00k.com",
    "cloudfare.net",
    "cmc.partners",
    "letsupload.cc",
    "whoviewed.me",
    "streamvids.net",
    "badguys.us",
    "catpic.biz",
    "mypichost.net",
    "short.pe",
    "biturl.io",
    "rb.gy",
    "anonymiz.com",
    "anonimizer.me",
    "myalias.pw",
    "1short.org",
    "shorturl.is",
    "link.zip",
    "wtf.pl",
    "iplogger.co",
    "iplog.io",
    "gyazo.in",
    "pizdec.ru",
    "microify.com",
    "gram.ir",
    "link2fu.me"
];

function normalizeText(text) {
    return text.normalize('NFKC'); // Normalize Unicode characters
}

client.login(require("./config.json").BOT_TOKEN);

function totalXPForRank(targetRank) {
    let xpCount = 26600;
  
    for (let rank = 8; rank <= targetRank; rank++) {
      xpCount += 6600 + (rank - 7) * 1000;
    }
  
    return xpCount;
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (!message.author.rateLimits) {
        message.author.rateLimits  = {
            generator: new RateLimit(10000),
            clear: new RateLimit(3500),
            image: new RateLimit(1000),
        }
    }

    if (message.attachments.size > 0) {
        if (!message.author.rateLimits.image.spend()) return deleteQueue.enqueue(() => message.delete());
    }

    const messageContent = normalizeText(message.content.toLowerCase());

    const containsGrabifyLink = grabifyLinks.some(link => messageContent.includes(link));
    const containsDiscordInvite = messageContent.includes('discord.gg') || messageContent.includes('discord.com/invite');

    if (containsDiscordInvite) {
        if (message.member.permissions.has("Administrator")) return;
        try {
        message.delete()
            .then(() => {
                message.author.send('You were timed out for advertising a discord server. Sorry.');
                client.channels.cache.get("1253929840646553641").send(`${message.author.username} was timed out for advertising a discord server! Content -> ${message.content.toString()}`)
                message.member.timeout(600000, "Advertising a discord server");
            })
            .catch(console.error);
        } catch (err) {
            message.reply('You have DMs off retard. Be sure you have them on.');
        }
        return;
    }

    if (containsGrabifyLink) {
        message.delete()
            .then(() => {
                message.author.send('Your message contained a known IP logging link and was removed for security reasons.');
            })
            .catch(console.error);
        return;
    }

    if (message.content.startsWith(">cmds")) {
        let embed = new EmbedBuilder()
        .setTitle("My awesome commands")
        .addFields({name: "Normie Commands", value: "`>webui`"}, {name: "Admin Stuff", value: "`>wlremove, >whitelist, >clear`"}, {name: "Cool kid stuff", "value": "`>generate`"})

        message.reply({embeds: [embed]})
    }

    if (message.content.startsWith(">wlremove")) {
        let args = message.content.split(" ");
        if (!message.member.permissions.has("Administrator")) return;
        if (args[1] !== "generator" && args[1] !== "unlocktool" && args[1] !== "devspoof") return message.reply("Please choose a whitelist removal option -> generator, unlocktool, devspoof");
        if (!message.mentions.members.first()) return message.reply("Please mention a member to remove access!");
        let role = null;
        let member = null;

        switch (args[1]) {
            case "generator":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253974051777675334");

                member = message.mentions.members.first();
                member.roles.remove(role);
                message.reply(`${member.user.username}'s access was removed from <#1253938544854962238>!`);
                break;
            case "unlocktool":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253973379732602961");

                member = message.mentions.members.first();
                member.roles.remove(role);
                message.reply(`${member.user.username}'s access was removed from <#1253953466527776798>!`);
                break;
            case "devspoof":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253973755894566912");

                member = message.mentions.members.first();
                member.roles.remove(role);
                message.reply(`${member.user.username}'s access was removed from <#1253954972974845963>!`);
                break;
        }
    }

    if (message.content.startsWith(">whitelist")) {
        let args = message.content.split(" ");
        if (!message.member.permissions.has("Administrator")) return;
        if (args[1] !== "generator" && args[1] !== "unlocktool" && args[1] !== "devspoof" && args[1] !== "cheatengine") return message.reply("Please choose a whitelist option -> generator, unlocktool, devspoof, cheatengine");
        if (!message.mentions.members.first()) return message.reply("Please mention a member to grant access!");
        let role = null;
        let member = null;

        switch (args[1]) {
            case "generator":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253974051777675334");

                member = message.mentions.members.first();
                member.roles.add(role);
                message.reply(`${member.user.username} was granted access to <#1253938544854962238>!`);
                break;
            case "unlocktool":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253973379732602961");

                member = message.mentions.members.first();
                member.roles.add(role);
                message.reply(`${member.user.username} was granted access to <#1253953466527776798>!`);
                break;
            case "devspoof":
                role = client.guilds.cache.get("1253926681056383006").roles.cache.get("1253973755894566912");

                member = message.mentions.members.first();
                member.roles.add(role);
                message.reply(`${member.user.username} was granted access to <#1253954972974845963>!`);
                break;
            case "cheatengine":
                member = message.mentions.members.first();
                let reply = message.reply(`${member.user.globalName} was given the cheat engine script! <@${member.id}> check DMs!`);
                const attachment = new AttachmentBuilder("./BLFHax.CT");

                let embed = new EmbedBuilder()
                .setTitle("How to set up")
                .setDescription(`
1. Open bullet force on your browser
2. Press Shift + Esc
3. Grab the games.crazygames.com under the bullet force
4. Open Calculator and click on the programmer tab
5. Put in the process id from games.crazygames.com in the DEC field
6. Click on HEX and copy the hex and remove any spaces on it
7. Open cheat engine and drag the cheat in
8. Go to the computer icon and go to the tab "processes" and press CTRL + F and paste the hex and select the process that comes up
9. Use the hax
                    `).setColor("Blurple");
                member.send({embeds: [embed]})
                member.send({ files: [attachment] })
                    .catch(error => {
                        console.error(error);
                        message.channel.send('There was an error trying to send the image!');
                    });
                    setTimeout(async () => {
                        (await reply).delete();
                    }, 20000);
                    return;
        }
    }

    if (message.content.startsWith(">webui")) {
        if (!message.author.rateLimits.image.spend()) return;
        message.reply("https://github.com/Snoofz/web-ui-library");
    }

    if (message.content.startsWith(">rank-to-xp")) {
        let rank = message.content.split(" ")[1];
        if (!rank) return message.reply("Please provide a valid rank (1 - 200)");

        if (parseInt(rank) == 0 || parseInt(rank) > 200) return message.reply("Please provide a valid rank (1 - 200)");
        message.reply(`Rank ${rank}'s calculated XP is ${totalXPForRank(parseInt(rank))}`);
    }

    if (message.content.startsWith(">smite")) {
        if (!message.author.rateLimits.image.spend()) return;

        let reason = "";
        if (message.content.includes("“") && message.content.includes("”")) {
            reason = message.content.split('“')[1].split('”')[0];
        } else {
            reason = message.content.split('"')[1].split('"')[0];
        }

        let member = message.mentions.members.first();

        if (!message.member.permissions.has("Administrator")) {
            const attachment = new AttachmentBuilder("./4876231.jpg");

            message.reply({ files: [attachment] })
                .catch(error => {
                    console.error(error);
                    message.channel.send('There was an error trying to send the image!');
                });

                return;
        }

        if (!member) return message.reply("Please mention a member to ban!");
        if (!reason) return message.reply("Please provide a reason for ban");
        if (member.permissions.has("Administrator")) return message.reply("No banning my exquisite administrators, nigga");

        try {
            member.send(`You have been banned by ${message.author.displayName} from Hailware Mods for ${reason}! You may appead by DMing / Sending a friend request to Snoofz.`);
        } catch (err) {
            console.log("User has dms off but will still be banned");
        }
        member.ban();
        message.reply(`${member.user.username} has been smited for ${reason}!`);
    }

    if (message.content.startsWith(">backshot")) {
        if (!message.author.rateLimits.image.spend()) return;
        let member = message.mentions.members.first();
    
        if (!member) return message.reply("Please mention a member to backshot!");
    
        try {
            const attachment = new AttachmentBuilder("./backshots.gif");
            await message.reply({
                content: `${message.author.displayName} gave ${member.displayName} the greatest backshots of all time!`,
                files: [attachment]
            });
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error trying to send the image!');
        }
    
        return;
    }
    
    if (message.content.startsWith(">kick")) {
        if (!message.author.rateLimits.image.spend()) return;

        let reason = "";
        if (message.content.includes("“") && message.content.includes("”")) {
            reason = message.content.split('“')[1].split('”')[0];
        } else {
            reason = message.content.split('"')[1].split('"')[0];
        }
        let member = message.mentions.members.first();

        if (!message.member.permissions.has("Administrator")) {
            const attachment = new AttachmentBuilder("./4876231.jpg");

            message.reply({ files: [attachment] })
                .catch(error => {
                    console.error(error);
                    message.channel.send('There was an error trying to send the image!');
                });

                return;
        }

        if (!member) return message.reply("Please mention a member to ban!");
        if (!reason) return message.reply("Please provide a reason for ban");
        if (member.permissions.has("Administrator")) return message.reply("No kicking my exquisite administrators, nigga");
        member.send(`You have been kicked by ${message.author.displayName} from Hailware Mods for ${reason}! You may rejoin when you decide to think about your actions nigga`);
        member.kick();
        message.reply(`${member.user.username} has been kicked in the ass for ${reason}!`);
    }

    if (message.content.startsWith(">generate")) {
        let errors = {
            1: "Username is already registered",
            2: "Invalid character was found in the username and the database denied it"
        }
        if (!message.author.rateLimits.generator.spend()) return;
        let args = message.content.split(" ");

        if (message.channel.id !== "1253938544854962238") {
            const attachment = new AttachmentBuilder("https://media.tenor.com/9aKfn1tc0AYAAAAj/moderators-mod.gif");

            message.reply({ files: [attachment] })
                .catch(error => {
                    console.error(error);
                    message.channel.send('There was an error trying to send the image!');
                });
            return;
        }

        if (!args[1]) return message.reply("bro please give me a username so I can make a fucking account... Usage: >generate coolusername129 platform (pc/mobile)")
        if (!args[2]) return message.reply("Please provide a platform");

        let password = `g!${genPass()}@`;
        let username = args[1] + `${genName()}`;
        let platform = args[2].toLocaleLowerCase();
        let tmpMessage = message;
        let response = await registerAccount(username, password, platform);

        console.log(response);
        if (response.message == 3) {
            try {
                let embed = new EmbedBuilder()
                .setTitle("Account made!")
                .setDescription("Wallah")
                .addFields({name: "Username", value: username })
                .addFields({name: "Password", value: password })

                message.author.send({embeds: [embed]});
                fs.appendFileSync("./accounts.txt", `${username}:${password}:${platform}`);
                tmpMessage.reply("Account made! Check DMs");
                setTimeout(() => {
                    tmpMessage.delete();
                }, 20000);
            } catch (err) {
                message.reply('You have DMs off retard. Be sure you have them on.');
            }
        } else if (response.message == 1 || response.message == 2) {
            let embed = new EmbedBuilder()
            .setTitle("Account failed to be created!")
            .setDescription(`Error (${response.message}): ${errors[parseInt(response.message)]}`);

            message.reply({embeds: [embed]});

            message.delete();
        }
    }

    if (message.content.startsWith('>clear')) {
        if (!message.author.rateLimits.clear.spend()) return message.reply("Ratelimit test");
        if (!message.member.permissions.has("Administrator")) {
            const attachment = new AttachmentBuilder("./4876231.jpg");

            message.reply({ files: [attachment] })
                .catch(error => {
                    console.error(error);
                    message.channel.send('There was an error trying to send the image!');
                });

                return;
        }
        const args = message.content.split(' ');

        if (!isNaN(args[1])) {
            const amount = parseInt(args[1]);

            if (amount < 1 || amount > 100) {
                message.channel.send('You need to input a number between 1 and 100.');
            } else {
                message.channel.bulkDelete(amount, true)
                    .then(deletedMessages => {
                        console.log(`Bulk deleted ${deletedMessages.size} messages`);
                    })
                    .catch(error => {
                        console.error(error);
                        message.channel.send('There was an error trying to delete messages in this channel!');
                    });
            }
        } else {
            message.channel.send("Mothafucka you need to specify a god mothafuckin amount of messages to delete...");
        }
    }
});


async function registerAccount(username, password, platform) {
  if (platform == "pc") {
    plaform = "PC-";
  } else if (platform == "mobile") {
    platform = "";
  }

  let response = false;
  let a = await fetch("https://server.blayzegames.com/OnlineAccountSystem//register.php?&requiredForMobile=878717759", {
      "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "Referer": "https://games.crazygames.com/",
      },
      "body": `newAccountInfo=id%24%23%40(_field_name_value_separator_*%26%25%5e%24%23%40(_fields_separator_*%26%25%5eusername%24%23%40(_field_name_value_separator_*%26%25%5e${platform}${username}%24%23%40(_fields_separator_*%26%25%5epassword%24%23%40(_field_name_value_separator_*%26%25%5e${SHA512(password)}%24%23%40(_fields_separator_*%26%25%5eemail%24%23%40(_field_name_value_separator_*%26%25%5e${platform}${username}_%40unregistered.com%24%23%40(_fields_separator_*%26%25%5ecustominfo%24%23%40(_field_name_value_separator_*%26%25%5e%3c%3fxml%20version%3d%221.0%22%20encoding%3d%22utf-16%22%3f%3e%0a%3cAS_CustomInfo%20xmlns%3axsd%3d%22http%3a%2f%2fwww.w3.org%2f2001%2fXMLSchema%22%20xmlns%3axsi%3d%22http%3a%2f%2fwww.w3.org%2f2001%2fXMLSchema-instance%22%3e%0a%20%20%3cbfAccountInfo%3e%0a%20%20%20%20%3cshow%3efalse%3c%2fshow%3e%0a%20%20%20%20%3cmoney%3e5000%3c%2fmoney%3e%0a%20%20%20%20%3cxp%3e0%3c%2fxp%3e%0a%20%20%20%20%3cstreamer%3efalse%3c%2fstreamer%3e%0a%20%20%20%20%3cdeviceID%20%2f%3e%0a%20%20%20%20%3cclan%20%2f%3e%0a%20%20%20%20%3ccases%3e1%3c%2fcases%3e%0a%20%20%20%20%3ccases_CREDIT%3e0%3c%2fcases_CREDIT%3e%0a%20%20%20%20%3ccases_ADS%3e0%3c%2fcases_ADS%3e%0a%20%20%20%20%3ccases_OW%3e0%3c%2fcases_OW%3e%0a%20%20%20%20%3cgold_OW%3e0%3c%2fgold_OW%3e%0a%20%20%20%20%3cgold%3e0%3c%2fgold%3e%0a%20%20%20%20%3ctotalGoldBought%3e0%3c%2ftotalGoldBought%3e%0a%20%20%20%20%3chacker%3efalse%3c%2fhacker%3e%0a%20%20%20%20%3cv%3e1.0%3c%2fv%3e%0a%20%20%20%20%3cplatform%20%2f%3e%0a%20%20%20%20%3ctKills%3e100%3c%2ftKills%3e%0a%20%20%20%20%3ctDeaths%3e0%3c%2ftDeaths%3e%0a%20%20%20%20%3cmWon%3e100%3c%2fmWon%3e%0a%20%20%20%20%3cmLost%3e0%3c%2fmLost%3e%0a%20%20%20%20%3cknifeKills%3e100%3c%2fknifeKills%3e%0a%20%20%20%20%3cexplKills%3e100%3c%2fexplKills%3e%0a%20%20%20%20%3cnukes%3e0%3c%2fnukes%3e%0a%20%20%20%20%3chighStrk%3e0%3c%2fhighStrk%3e%0a%20%20%20%20%3cmostKills%3e0%3c%2fmostKills%3e%0a%20%20%20%20%3ccharacterCamos%20%2f%3e%0a%20%20%20%20%3cglovesCamos%20%2f%3e%0a%20%20%20%20%3cbulletTracerColors%20%2f%3e%0a%20%20%20%20%3ceLs%3e0%3c%2feLs%3e%0a%20%20%20%20%3cplayerID%3e0%3c%2fplayerID%3e%0a%20%20%20%20%3cnotificationMessage%20%2f%3e%0a%20%20%3c%2fbfAccountInfo%3e%0a%20%20%3cweaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e14%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e1%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e6%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e4%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e3%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e7%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e8%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e20%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e19%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e15%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e2%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e5%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e16%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e18%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e21%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e22%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e23%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e24%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e25%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e26%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e27%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e28%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e29%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e30%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e31%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e33%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e34%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e35%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e36%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e37%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e38%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e39%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e40%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e41%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e42%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e43%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e44%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e45%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e46%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e47%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e48%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e49%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e50%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e51%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e52%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e53%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e54%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e55%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e56%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e57%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e58%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e59%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e60%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e61%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e62%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e63%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e64%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e65%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e66%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e67%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%3c%2fweaponInfo%3e%0a%20%20%3cthrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e9%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e11%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e13%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%3c%2fthrowableInfo%3e%0a%20%20%3cos%3enot%20set%3c%2fos%3e%0a%20%20%3cmodel%3enot%20set%3c%2fmodel%3e%0a%20%20%3crd%3e0%3c%2frd%3e%0a%20%20%3ced%3e0%3c%2fed%3e%0a%3c%2fAS_CustomInfo%3e%24%23%40(_fields_separator_*%26%25%5eclan%24%23%40(_field_name_value_separator_*%26%25%5e%24%23%40(_fields_separator_*%26%25%5eunbanned%24%23%40(_field_name_value_separator_*%26%25%5e0%24%23%40(_fields_separator_*%26%25%5e&requireEmailActivation=false&referralPlayer=&store=BALYZE_WEB&useJSON=true`,
      "method": "POST"
  });

  let res = await a.text();
 console.log(res);
      if (res.includes("success")) {
         response = { success: true, "message": 3 };
      } else {
        if (!isValidName(username)) {
            response = { success: false, "message": 2 };
        } else {
            response = { success: false, "message": 1 };
        }
      }

  return response;
}

function isValidName(name) {
    var regex = /^[a-zA-Z-]+$/;
  
    return regex.test(name);
}

function SHA512(str) {
    function int64(msint_32, lsint_32) {
        this.highOrder = msint_32;
        this.lowOrder = lsint_32;
    }

    var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
        new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
        new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
        new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)
    ];

    var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
        new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
        new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
        new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
        new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
        new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
        new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
        new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
        new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
        new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
        new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
        new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
        new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
        new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
        new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
        new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
        new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
        new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
        new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
        new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
        new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
        new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
        new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
        new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
        new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
        new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
        new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
        new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
        new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
        new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
        new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
        new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
        new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
        new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
        new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
        new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
        new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
        new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
        new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
        new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
    ];

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    var charsize = 8;

    function utf8_encode(str) {
        return unescape(encodeURIComponent(str));
    }

    function str2binb(str) {
        var bin = [];
        var mask = (1 << charsize) - 1;
        var len = str.length * charsize;

        for (var i = 0; i < len; i += charsize) {
            bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
        }

        return bin;
    }

    function binb2hex(binarray) {
        var hex_tab = '0123456789abcdef';
        var str = '';
        var length = binarray.length * 4;
        var srcByte;

        for (var i = 0; i < length; i += 1) {
            srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
            str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
        }

        return str;
    }

    function safe_add_2(x, y) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
        msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_4(a, b, c, d) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_5(a, b, c, d, e) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function maj(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
        );
    }

    function ch(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
        );
    }

    function rotr(x, n) {
        if (n <= 32) {
            return new int64(
                (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
                (x.lowOrder >>> n) | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
                (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
                (x.highOrder >>> n) | (x.lowOrder << (32 - n))
            );
        }
    }

    function sigma0(x) {
        var rotr28 = rotr(x, 28);
        var rotr34 = rotr(x, 34);
        var rotr39 = rotr(x, 39);

        return new int64(
            rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
            rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
        );
    }

    function sigma1(x) {
        var rotr14 = rotr(x, 14);
        var rotr18 = rotr(x, 18);
        var rotr41 = rotr(x, 41);

        return new int64(
            rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
            rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
        );
    }

    function gamma0(x) {
        var rotr1 = rotr(x, 1),
            rotr8 = rotr(x, 8),
            shr7 = shr(x, 7);

        return new int64(
            rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
            rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
        );
    }

    function gamma1(x) {
        var rotr19 = rotr(x, 19);
        var rotr61 = rotr(x, 61);
        var shr6 = shr(x, 6);

        return new int64(
            rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
            rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
        );
    }

    function shr(x, n) {
        if (n <= 32) {
            return new int64(
                x.highOrder >>> n,
                x.lowOrder >>> n | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
                0,
                x.highOrder << (32 - n)
            );
        }
    }

    str = utf8_encode(str);
    strlen = str.length * charsize;
    str = str2binb(str);

    str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
    str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

    for (var i = 0; i < str.length; i += 32) {
        a = H[0];
        b = H[1];
        c = H[2];
        d = H[3];
        e = H[4];
        f = H[5];
        g = H[6];
        h = H[7];

        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                W[j] = new int64(str[j * 2 + i], str[j * 2 + i + 1]);
            } else {
                W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
            }

            T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
            T2 = safe_add_2(sigma0(a), maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add_2(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add_2(T1, T2);
        }

        H[0] = safe_add_2(a, H[0]);
        H[1] = safe_add_2(b, H[1]);
        H[2] = safe_add_2(c, H[2]);
        H[3] = safe_add_2(d, H[3]);
        H[4] = safe_add_2(e, H[4]);
        H[5] = safe_add_2(f, H[5]);
        H[6] = safe_add_2(g, H[6]);
        H[7] = safe_add_2(h, H[7]);
    }

    var binarray = [];
    for (var i = 0; i < H.length; i++) {
        binarray.push(H[i].highOrder);
        binarray.push(H[i].lowOrder);
    }
    return binb2hex(binarray);
}