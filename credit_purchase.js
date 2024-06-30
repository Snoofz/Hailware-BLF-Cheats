let blfUsername = "PC-Brutility";
let blfHash = "7A51F3C2127C1B70D6478A23133129F2B65D4F88AA9F61D411B0FF08B25930A6DDFFB30C761075E356D5C6C3AF4A4419C606F89AAEFFFEFD37FD35229EFCDDB0";
let case_type = "credit";
let isPC = true;

setInterval(() => {
fetch("https://server.blayzegames.com/OnlineAccountSystem/buy_case.php?requiredForMobile=1770212018", {
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
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": `username=${blfUsername}&password=${blfHash}&case_type=${case_type}&amount=1&username=${blfUsername}&password=${blfHash}`,
  "method": "POST"
}).then(res => res.text()).then(res => {
   if (blfUsername.includes("PC-")) { isPC = true } else { isPC = false; }

   if (isPC) {
      console.log(`[BLF Killer]: Purchased 1 ${case_type} case on account '${blfUsername}' (PC User)`);
   } else {
      console.log(`[BLF Killer]: Purchased 1 ${case_type} case on account '${blfUsername}' (Mobile User)`);
   }
});
}, 10);