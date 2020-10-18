function saveChanges(text) {
    localStorage.setItem('mydata', text);
    $('#selectLanguage').text(localStorage.getItem('mydata'));
    chrome.storage.sync.set({
        'value': localStorage.getItem('mydata')
    }, function () {
    });
}

$(document).ready(function () {
    if (localStorage.getItem('mydata')) {
        $('#selectLanguage').text(localStorage.mydata);
    } else {
        localStorage.setItem('mydata', $('#selectLanguage').text());
    }

    $('button').click(function () {
        if ($(this).attr('id') !== "select"){
            saveChanges($(this).text());
        }
    });

});