# Hacks and Cheats for Bullet Force because fuck that game
### [Why I'm doing this](https://www.youtube.com/watch?v=fN4-UGsHvww)
## Your problem, not mine

# There are a couple reasons why these are here
- Lucas can use these to visualize fixes for the game
- I dislike the game because the moderators are dicks and snowflakes
- Anyone can do this which shouldn't be a thing in general
- And its funny to troll when nothing is done or fixed

# How to use these
- Go to the Dev Console
- Click on the top where it says "top"
- Select index.html on games.crazygames.com
- And past any of the codes below in the console

![image](https://github.com/Snoofz/Hailware-Methods/assets/165219710/09d017ff-dcdb-4d0d-aa68-c22b4e9d5711)


## Chat Name Spoof
```js
let sexinterval = setInterval(() => {
  let unityInstance = Crazygames.getUnityInstance();
  unityInstance.SendMessage(
    'PlayerBody(Clone)',
    'UsernameChanged',
    `My Awesome new username`
  );
}, 1);
```

# Time Scale
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'SetTimeScale', 1.3);
```

# Spam / Auto Knife
```js
setInterval(() => { Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'DamageWithKnife'); }, 10);
```

# End Game
```js
Crazygames.getUnityInstance().SendMessage('Match Manager(Clone)', 'EndMatch');
```

# (H) Restart Match (Host Only)
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'RestartMatch');
// Or
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'ActualRestartMatch');
```

# Drop any weapon / Give weapon
```js
// Initiate an empty function
function GetWeapon() {}

fetch('https://raw.githubusercontent.com/Snoofz/Hailware-Assets/main/weaponmap.json')
.then(response => response.json())
.then(data => {
console.log(data);
const weaponMap = data;

// Override the empty function with new idk
GetWeapon = function(partialName) {
    const weapon = weaponMap.find(weapon => weapon.WeaponType.toLowerCase().includes(partialName.toLowerCase()));
    if (weapon) {
    return weapon;
    } else {
    return null;
    }
}
}).catch(error => console.error('Error fetching JSON:', error));

// Send DropGun to the unityInstance with GetWeapon which grabs the weapon ID with part of the weapon name
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'DropGun', GetWeapon("AK").weaponId);

// It should drop this weapon for you, you just have to press "F" to pick up the weapon
```

# Set deaths in MP lobby to 0
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'UpdateMPDeaths', 0);
```

# Respawn
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'Respawn');
```

# Add kill to killstreak
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'AddKillToStreak');
```

# Kick player / Disable their chat
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'KickPlayerAsMaster', "PC-AwesomeUsernameIDK");
```

# Time Scale
```js
Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'SetTimeScale', 1.3);
```

# Respawn All
```js
var Module = Crazygames.getUnityInstance().Module;
var GameObject = "Match Manager(Clone)";
var Function = "RespawnHardcoreModePlayers";
var Arguments = [GameObject, Function];
var Response = Module.ccall("SendMessage", null, ["string", "string"], Arguments);
console.log(Response);
```

# Grenade Spam
```js
var Module = gameModule;
            var GameObject = "PlayerBody(Clone)";
            var Function = "createGrenade";
            var Parameters = [
                "true",
            ]
            var ArgumentTypes = [
                "bool",
            ];
            var Arguments = [GameObject, Function, Parameters];
            var Response = Module.ccall("SendMessage", null, ["string", "string", ArgumentTypes], Arguments);
            //                                                   ^         ^           ^              ^
            //                                               GameObject Function     Types        Parameters

            spam = setInterval(function () {
                var Response = Module.ccall("SendMessage", null, ["string", "string", ArgumentTypes], Arguments);
            }, 100);
```


# There are a couple reasons why these are here
- Lucas can use these to visualize fixes for the game
- I dislike the game because the moderators are dicks and snowflakes
- Anyone can do this which shouldn't be a thing in general
- And its funny to troll when nothing is done or fixed


## Unlock all Steps
- Download [Requestly](https://chromewebstore.google.com/detail/requestly-intercept-modif/mdnleldcmiljblolnjhpnblkcekpdkpa?pli=1)
- Add a rule "Modify API Response"
- Set the URL to https://server.blayzegames.com/OnlineAccountSystem/get_account_info_json.php
- And set the Account Data from the `AccountData.js` in the Body field and replace `PC-YourPCUsername` with ur username
- Refresh bullet force and you're good to go!

## すべてのステップをアンロック
- [Requestly](https://chromewebstore.google.com/detail/requestly-intercept-modif/mdnleldcmiljblolnjhpnblkcekpdkpa?pli=1)をダウンロード
- 「API応答の修正」というルールを追加
- URLをhttps://server.blayzegames.com/OnlineAccountSystem/get_account_info_json.phpに設定
- ボディフィールドの`AccountData.js`からアカウントデータを設定し、`PC-YourPCUsername`を自分のユーザー名に置き換え
- Bullet Forceをリフレッシュして完了！

## Dev Spoof
- Download [Requestly](https://chromewebstore.google.com/detail/requestly-intercept-modif/mdnleldcmiljblolnjhpnblkcekpdkpa?pli=1)
- Add a rule "Modify API Response"
- Set the URL to https://server.blayzegames.com/OnlineAccountSystem/get-account-rolesV2.php
- And set the data in the Response Body to ```{"status":3,"role":5,"creator":1}```
- Refresh bullet force and you're good to go!

## 開発スプーフ
- [Requestly](https://chromewebstore.google.com/detail/requestly-intercept-modif/mdnleldcmiljblolnjhpnblkcekpdkpa?pli=1)をダウンロード
- 「API応答の修正」というルールを追加
- URLをhttps://server.blayzegames.com/OnlineAccountSystem/get-account-rolesV2.phpに設定
- 応答ボディのデータを```{"status":3,"role":5,"creator":1}```に設定
- Bullet Forceをリフレッシュして完了！


