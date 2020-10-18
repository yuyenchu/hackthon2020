// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var write = require("./writeMp3File.js");

f = function(){
    speak(window.getSelection().toString());
}
// document.body.addEventListener('dblclick',f);

chrome.tabs.executeScript( {
    code: "document.body.addEventListener('dblclick',f);"
});

function speak(text){
    let source = "en"
    let target = "zh-TW"
    let rate = 1.0
    let gender = "NEUTRAL"
    // let text = "this is a dog. that is a cat."
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let translation = JSON.parse(this.responseText)[0].reduce((acc,curr) => acc + curr[0],"")
            console.log(translation);
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
                    "ssml": translation.replaceAll(/(。+|\.+)/g, "<break strength=\"weak\"/>")
                },
                "voice": {
                    "languageCode": target,
                    "ssmlGender": gender
                },
                "audioConfig": {
                    "audioEncoding": "MP3",
                    "speakingRate": rate
                }
            }));
        }
    };
    xhr.open("POST", `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`, true);
    xhr.send();
}
