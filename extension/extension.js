var lang = "English";
var isSelecting = false;

$(document).ready(function () {
    chrome.storage.sync.get(['value'], function (result) {
        if(result){
            lang=result.value;
        }
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            var storageChange = changes[key];
            lang = storageChange.newValue;
            // console.log('Storage key "%s" in namespace "%s" changed. ' +
            //     'Old value was "%s", new value is "%s".',
            //     key,
            //     namespace,
            //     storageChange.oldValue,
            //     storageChange.newValue);
        }
    });
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

const map = {"English":"en","Mandarin Chinese":"zh-TW","Japanese":"ja","Spanish":"es"}
const corsUrl = "https://cors-anywhere.herokuapp.com/";
var audioList = [];

function speak(text){
    console.log("lang = "+lang)
    let source = "en"
    let target = map[lang]
    let rate = 1.0
    let gender = "NEUTRAL"
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let translation = JSON.parse(this.responseText)[0].reduce((acc,curr) => acc + curr[0],"")
            console.log(translation);
            var xhp = new XMLHttpRequest()
            xhp.open("POST", corsUrl+"https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyCLObUOnRO9nJ3iIkBbshgFUY8Hm0bMYPA", true);
            xhp.onreadystatechange=function() {
                if (this.readyState == 4 && this.status == 200) {
                    let content = JSON.parse(this.responseText)["audioContent"]
                    console.log(content.length)
                    let audio = new Audio()
                    audio.src = "data:audio/mp3;base64, "+content
                    audio.addEventListener("ended", function(){
                        console.log(audioList.length)
                        audioList.remove(this)
                        console.log(audioList.length)
                    });
                    if (audioList.length>0){
                        console.log("stopping all")
                        stopAll();
                    }
                    audioList.push(audio)
                    audio.play()
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
    xhr.open("POST", `${corsUrl}https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`, true);
    xhr.send();
}

var f = function(){
    let text = window.getSelection().toString().trim();
    if (text != "") {
        
        speak(text);
    }
}

var stopAll = function() {
    audioList.forEach((ele)=>{
        ele.pause();
        ele.src='';
        ele.play();
        console.log(audioList.length)
    });
    audioList=[];
}

document.addEventListener('mousedown',()=>isSelecting=true);
document.addEventListener('mouseup',()=>{
    if (isSelecting) f()
    isSelecting = false
});