function postEmailToServer() {
    var emailAddress = document.getElementById("emailInput").value;

    // do post
    $.get("http://135.0.25.246:2999", {email: emailAddress}, function (data, status) {
        if (status !== 'success') {
            alert("Connection Refused, Please try again.");
        } else if (data === 'true') {
            alert("Email saved");
        } else if (data === 'false') {
            alert("Email failed to save");
        }
    });
}


$(".input-upright").keyup(function (e) {
    if (e.keyCode == 13) {
        postEmailToServer()
    }
});