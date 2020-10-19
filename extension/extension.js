var isSelecting = false;
var isOn = true;
var target = "en"

$(document).ready(function () {
    chrome.storage.sync.get(['target'], function (result) {
        if(result){
            target=result.target;
        }
    });
    chrome.storage.sync.get(['onOff'], function (result) {
        if(result){
            isOn=result.onOff;
        }
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            var storageChange = changes[key];
            if (key==="target") {
                target = storageChange.newValue;
            } else {
                isOn = storageChange.newValue;
            }
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "languages.txt", false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4 &&(rawFile.status === 200 || rawFile.status == 0)){
            var allText = rawFile.responseText;
            var lines = allText.split('\n');
            for(var line = 0; line < lines.length; line++){
                let l = lines[line].split("\t")[0].trim();
                let lc = lines[line].split("\t")[1].trim();
                $("#dropdown-content").append('<button id="'+ l +'" name="'+ lc +'"><img src=./icon.png>'+ l+'</button>')
            }
        }
    }
    rawFile.send(null);

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


const corsUrl = "https://cors-anywhere.herokuapp.com/";
var audioList = [];

function speak(text){
    console.log(target)
    let source = "en"
    let rate = 1.0
    let gender = "NEUTRAL"
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let translation = JSON.parse(this.responseText)[0].reduce((acc,curr) => acc + curr[0],"")
            console.log(translation);
            var xhp = new XMLHttpRequest()
            let key = "AIzaSyCJlRQgW9Yc0Wkkmit6umSfyOXNO2OD-z8"
            // xhp.open("POST", corsUrl+"https://texttospeech.googleapis.com/v1/text:synthesize?key=" + key, true);
            xhp.open("POST", "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + key, true);
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
                    "ssml": "<speak>"+translation.replaceAll(/(。+|\.+)/g, "<break strength=\"weak\"/>")+"</speak>"
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
    // xhr.open("POST", `${corsUrl}https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`, true);
    xhr.open("POST", `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${text}`, true);
    xhr.send();
}

var f = function(){
    let text = window.getSelection().toString();
    if (text != "" && isOn) {
        speak(text);
    }
}

// function isRunning() {
//     return document.getElementById('onOff').checked === true;
// }

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