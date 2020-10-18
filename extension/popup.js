function saveChanges(text, abbr) {
    localStorage.setItem('mydata', text);
    $('#selectLanguage').text(localStorage.getItem('mydata'));
    chrome.storage.sync.set({
        'target': abbr
    }, function () {
    });
}

function strToBool(str) {
    return (str == 'true')
}

$(document).ready(function () {
    if (localStorage.getItem('mydata')) {
        $('#selectLanguage').text(localStorage.mydata);
    } else {
        localStorage.setItem('mydata', $('#selectLanguage').text());
    }

    if (localStorage.getItem('onOff')) {
        $('#onOff').prop('checked',strToBool(localStorage.getItem('onOff')));
    } else {
        localStorage.setItem('onOff', true);
    }

    $('button').click(function () {
        console.log("test")
        if ($(this).attr('id') !== "select") {
            saveChanges($(this).text(),$(this).attr("name"));
        }
    });

    $('#onOff').click(function() {
        $(this).prop('checked',!$(this).prop('checked'));
        console.log($(this).prop('checked'))
        localStorage.setItem('onOff', $(this).prop('checked'));
        chrome.storage.sync.set({
            'onOff': strToBool(localStorage.getItem('onOff'))
        }, function () {
        });
    })

});