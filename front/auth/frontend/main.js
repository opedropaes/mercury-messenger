//Client ID: 589383680033-km9ntn36jvgtcskn9v413t8gb3s1bo6d.apps.googleusercontent.com
//Client Secret: QCFn6pN7pMUOfH0eoeLI5e_l

$(document).ready(function() {
  // client id of the project

  var clientId =
    "589383680033-km9ntn36jvgtcskn9v413t8gb3s1bo6d.apps.googleusercontent.com";

  // redirect_uri of the project

  var redirect_uri = "http://localhost:80/public/chat.html";

  // scope of the project

  var scope = "https://www.googleapis.com/auth/drive";
  //var scope2 = "https://www.googleapis.com/auth/userinfo.profile";

  // the url to which the user is redirected to

  var url = "";

  // this is event click listener for the button

  $("#login").click(function() {
    // this is the method which will be invoked it takes four parameters
    //console.log(scope2);
    signIn(clientId, redirect_uri, scope, url);
  });

  function signIn(clientId, redirect_uri, scope, url) {
    // the actual url to which the user is redirected to

    url =
      "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" +
      redirect_uri +
      "&prompt=consent&response_type=code&client_id=" +
      clientId +
      "&scope=" +
      scope +
      "&access_type=offline";

    // this line makes the user redirected to the url

    window.location = url;
  }
});
