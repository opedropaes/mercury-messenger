const form = document.getElementById('signup-form');

if (form.attachEvent) {
    form.attachEvent("submit", handleSignUp);
} else {
    form.addEventListener("submit", handleSignUp);
}

async function handleSignUp(e) {
    e.preventDefault();

    const body = {
        name: sessionStorage.getItem('name'),
        email: sessionStorage.getItem('email'),
        username: $('input[name=username]').val(),
    };

    const payload = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    try {
        fetch('http://localhost:3000/auth/registrar', payload)
            .then((response) => {

                response.json().then(async res => {
                    if (response.status == '200') {
                        const { communicator, token } = res;
                        const { username } = communicator;
                        redirect(username, token);
                    } else {
                        alert("Já existe uma conta com esse endereço de email! Tente outro email e outro username");
                    }
                })

                return false;
            })
            .catch(err => {
                console.debug(err);
            })
    } catch (error) {
        console.debug(err);
    }

}

function redirect(username, token) {
    window.location.href = `http://localhost:5500/chat.html?username=${username}&token=${token}`;
}