function handleSignUp(e) {
    e.preventDefault();

    $.ajax({
        type: "post",
        url: 'http://localhost:3000/registrar',
        data: {
            name: $('input[name=name]').val(),
            email: $('input[name=email]').val(),
            username: $('input[name=username]').val(),
            password: $('input[name=password]').val(),
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function(response) {
            console.log(response);
        },
        fail: function(error) {
            console.log(response);
        }
    });

}

function redirect(username, token) {
    window.location.href = `chat2.html?user=$${username}&token=${token}`;
}