function saveChanges() {
    if ($('#myonoffswitch').is(':checked')) {
        localStorage.mydata = 'y';
    } else {
        localStorage.mydata = 'n';
    }
    chrome.storage.sync.set({
        'value': localStorage.mydata
    }, function () {

    });
}

$(document).ready(function () {
    if (localStorage.getItem('mydata')) {
        if (localStorage.mydata == 'n') {
            $('myonoffswitch').attr('checked', false);
        } else {
            $('myonoffswitch').attr('checked', true);
        }
    } else {
        if ($('#myonoffswitch').is(':checked')) {
            localStorage.setItem('mydata', 'y');
        } else {
            localStorage.setItem('mydata', 'n');
        }
    }

    $('#myonoffswitch').click(function () {
        saveChanges();
    });

});