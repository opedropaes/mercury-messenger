function handleSignUp(e) {
    e.preventDefault();
    $("#signUpBtn").html('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');

    $.ajax({
        type: "post",
        url: 'http://localhost:3000/auth/registrar',
        data: {
            name: $('input[name=name]').val(),
            email: $('input[name=email]').val(),
            username: $('input[name=username]').val(),
            password: $('input[name=password]').val(),
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function(response) {
            const { communicator, token } = response;
            const { username } = communicator;
            redirect(username, token);
        },
        fail: function(error) {
            console.log(error);
        }
    });

}

function redirect(username, token) {
    window.location.href = `/conversas?username=${username}&token=${token}`;
}