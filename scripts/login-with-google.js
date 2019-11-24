//Client ID: 366460579623-8rl80028rpr501mm0e0a89h024luskjp.apps.googleusercontent.com
//Client Secret: mkezEb9dAXgZRHF-uxU45fxc

$(document).ready(function () {

    let clientId =
        "366460579623-8rl80028rpr501mm0e0a89h024luskjp.apps.googleusercontent.com";

    let redirect_uri = "http://localhost:5500/username.html";
    let scope = "https://www.googleapis.com/auth/drive";
    let url = "";

    $("#login-with-google").click(function () {
        signIn(clientId, redirect_uri, scope, url);
    });

    function signIn(clientId, redirect_uri, scope, url) {
        url =
            "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" +
            redirect_uri +
            "&prompt=consent&response_type=code&client_id=" +
            clientId +
            "&scope=" +
            scope +
            "&access_type=offline";

        window.location = url;
    }

});
