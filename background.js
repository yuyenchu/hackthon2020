var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var write = require("./writeMp3File.js");

let source = "en"
let target = "zh-TW"
let text = "dog"
var xhr = new XMLHttpRequest();
xhr.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText)[0][0][0]);
        var xhp = new XMLHttpRequest();
        xhp.open("POST", "https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyCLObUOnRO9nJ3iIkBbshgFUY8Hm0bMYPA", true);
        xhp.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) {
                let content = JSON.parse(this.responseText)["audioContent"];
                console.log(content);
                // write(content);
                let audio = new Audio();
                audio.src = "data:audio/mp3;base64, "+content;
                audio.play();
            }
        }
        xhp.send(JSON.stringify({
            "input": {
                "text": JSON.parse(this.responseText)[0][0][0]
            },
            "voice": {
                "languageCode": target,
                "ssmlGender": "NEUTRAL"
            },
            "audioConfig": {
                "audioEncoding": "MP3"
            }
        }));
    }
  };
xhr.open("POST", `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`, true);
xhr.send();
