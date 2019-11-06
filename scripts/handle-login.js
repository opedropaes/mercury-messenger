const form = document.getElementById('login-form');

if (form.attachEvent) {
	form.attachEvent("submit", handleLogin);
} else {
	form.addEventListener("submit", handleLogin);
}

function handleLogin(e) {
	e.preventDefault();

	const body = {
		username: $('input[name=username]').val(),
		password: $('input[name=password]').val()
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
		fetch('http://localhost:3000/entrar', payload)
			.then(response => {
				if (response.status == '200') {
					window.location.href = `http://localhost:5500/chat.html?username=${body.username}`;
				} else if (response.err == "UserNotFound") {
					alert("Parece que você não tem uma conta ainda! Registre-se e comece a conversar!");
				} else if (response.err == "PasswordFailed") {
					alert("Senha incorreta! Tente novamente.");
				} else if (response.err == "EmptyField") {
					alert("Todos os campos devem estar preenchidos!");
				}
				else {
					alert("Verifique os campos e tente novamente!");
				}

				console.log(response)

				return false;
			})
			.catch(err => {
				console.debug(err);
			})
	} catch (error) {
		console.debug(err);
	}

}