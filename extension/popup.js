function saveChanges(text) {
    localStorage.setItem('mydata', text);
    $('#selectLanguage').text(localStorage.getItem('mydata'));
    chrome.storage.sync.set({
        'value': localStorage.mydata
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
        saveChanges($(this).text());
    });

});