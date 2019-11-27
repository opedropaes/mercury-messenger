let socket = io('http://localhost:3000'); // Função obtida através do CDN do socket.io

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
}

let href = window.location.href;
let communicator = $.urlParam("username") || "pedro";
let room = "room";


socket.on('connect', () => {
    const communicatorText = document.getElementById('communicator');
    communicatorText.innerHTML = communicator + '<br><small> online</small>';

    const now = new Date();

    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    day = (day < 10) ? ('0' + day).slice(-2) : day;
    month = (month < 10) ? ('0' + month).slice(-2) : month;
    hour = (hour < 10) ? ('0' + hour).slice(-2) : hour;
    minutes = (minutes < 10) ? ('0' + minutes).slice(-2) : minutes;

    const lastSeenAt = `${hour}:${minutes} - ${day}.${month}.${year}`;
    const communicatorDisconnected = { username: communicator, lastSeenAt };

    socket.on('disconnect', () => {
        socket.emit('getDisconnected', communicatorDisconnected);
    });

    socket.on('receivedMessage', messageObject => {
        const newm = {...messageObject, modo: "receievd" }
        renderMessage(newm);
    });

});

async function deleteChild() {
    $('#messages-ul').empty();
}

async function getRoomName(communicator, user2) {

    let ASCIICodescommunicator = [];
    let ASCIICodesUser2 = [];
    let roomASCIICodes = [];
    let roomName = "";

    for (let char of communicator) {
        ASCIICodescommunicator.push(char.charCodeAt(0));
    }

    for (let char of user2) {
        ASCIICodesUser2.push(char.charCodeAt(0));
    }

    let biggerUsername = 0

    if (ASCIICodescommunicator.length > ASCIICodesUser2.length)
        biggerUsername = ASCIICodescommunicator.length;
    else
        biggerUsername = ASCIICodesUser2.length;

    for (let i = 0; i < biggerUsername; i++) {

        let ASCIICodeFromcommunicator = parseInt(ASCIICodescommunicator[i]);
        let ASCIICodeFromUser2 = parseInt(ASCIICodesUser2[i]);

        ASCIICodeFromcommunicator = (!isNaN(ASCIICodeFromcommunicator)) ? ASCIICodeFromcommunicator : 0;
        ASCIICodeFromUser2 = (!isNaN(ASCIICodeFromUser2)) ? ASCIICodeFromUser2 : 0;

        roomASCIICodes[i] = +ASCIICodeFromcommunicator + ASCIICodeFromUser2;
        roomName += JSON.stringify(roomASCIICodes[i]);
    }

    renderRoom(roomName);
}

function getOnlyRoomName(communicator, user2) {
    let ASCIICodescommunicator = [];
    let ASCIICodesUser2 = [];
    let roomASCIICodes = [];
    let roomName = "";

    for (let char of communicator) {
        ASCIICodescommunicator.push(char.charCodeAt(0));
    }

    for (let char of user2) {
        ASCIICodesUser2.push(char.charCodeAt(0));
    }

    let biggerUsername = 0

    if (ASCIICodescommunicator.length > ASCIICodesUser2.length)
        biggerUsername = ASCIICodescommunicator.length;
    else
        biggerUsername = ASCIICodesUser2.length;

    for (let i = 0; i < biggerUsername; i++) {

        let ASCIICodeFromcommunicator = parseInt(ASCIICodescommunicator[i]);
        let ASCIICodeFromUser2 = parseInt(ASCIICodesUser2[i]);

        ASCIICodeFromcommunicator = (!isNaN(ASCIICodeFromcommunicator)) ? ASCIICodeFromcommunicator : 0;
        ASCIICodeFromUser2 = (!isNaN(ASCIICodeFromUser2)) ? ASCIICodeFromUser2 : 0;

        roomASCIICodes[i] = +ASCIICodeFromcommunicator + ASCIICodeFromUser2;
        roomName += JSON.stringify(roomASCIICodes[i]);
    }

    return roomName;
}

function renderRoom(roomName) {

    const main = $('#main');

    if (main[0].childNodes[3] != undefined) {
        main[0].removeChild(main[0].childNodes[3])
        console.log(main[0].childNodes[3], "removido")
    }

    const textareaDiv = `<div class="text"><textarea placeholder="Escreva sua mensagem" id="messages-text" name="message"></textarea></div>`
    if (main[0].childNodes.length < 4) {
        main.append(textareaDiv)
    }

    const textarea = document.getElementById('messages-text');
    let message = "";

    textarea.addEventListener('keydown', (e) => {
        message = $('textarea').val();
        if (e.key == "Enter") {
            let messageObject = { author: communicator, message, room: roomName };
            renderMessage(messageObject);
            clearMessageInput();
            socket.emit('sendMessage', messageObject);
        }
    })

    deleteChild();

    const previousMessagesObject = JSON.parse(localStorage.getItem('messages'));

    console.log(roomName)

    for (item of previousMessagesObject) {
        if (roomName === item.room) {
            let messageObject = { author: item.author, message: item.message }
            renderMessage(messageObject);
        }
    }

}

function reRenderMessages() {
    const previousMessagesObject = JSON.parse(localStorage.getItem('messages'));
    const activePerson = $("#active-contact").children()[1].innerText;
    let roomName = getOnlyRoomName(communicator, activePerson);

    let roomMessages = previousMessagesObject.filter(function(e) { return e.room === roomName })

    if ($("#active-contact")[0] && roomMessages.length > $("#messages-ul").children().length) {
        let lastMessage = roomMessages[roomMessages.length - 1];
        if (lastMessage) {
            if (roomName === lastMessage.room) {
                let messageObject = { author: lastMessage.author, message: lastMessage.message }
                console.log('rendering last', messageObject)
                renderMessage(messageObject);
            }
        }
    }
}

const interv = setInterval(function() {
    reRenderMessages();
}, 1000)

async function getCommunicatorContacts() {

    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3000/users/pessoas`)
            .then(response => {
                response.json().then(contacts => {
                    resolve(contacts);
                })
            })
    })

}

function renderContacts() {
    getCommunicatorContacts()
        .then(contacts => {

            const contactsList = $("#contactsList")[0];
            let picId = 99;

            contacts.map(contact => {
                let liElement = document.createElement('li');
                let img = document.createElement('img');
                let p = document.createElement('p');
                let pTextNode = document.createTextNode(contact);

                if (contact != communicator) {
                    p.setAttribute('class', 'name');
                    img.setAttribute('class', 'avatar');
                    img.setAttribute('width', '30');
                    img.setAttribute('height', '30');
                    img.setAttribute('src', `https://picsum.photos/id/${picId}/200/200`);

                    p.appendChild(pTextNode);
                    liElement.appendChild(img);
                    liElement.appendChild(p);
                    contactsList.appendChild(liElement);
                }

                picId += 43;

            })

            let list = document.getElementById('contactsList').childNodes;

            list.forEach(contact => {
                if (contact.nodeName != '#text') {
                    if (contact.textContent != '') {
                        let contactUsername = contact.textContent;
                        contact.addEventListener('click', (e) => {
                            contact.style.background = "#dadada"
                            contact.style.color = "black"
                            contact.setAttribute('id', 'active-contact')
                            getRoomName(communicator, contactUsername);

                            list.forEach(othercontact => {
                                if (othercontact.nodeName != '#text') {
                                    if (othercontact.textContent != '') {
                                        if (othercontact.textContent != contact.textContent) {
                                            othercontact.setAttribute('id', '')
                                            othercontact.style.background = "transparent"
                                            othercontact.style.color = "white";
                                        }
                                    }
                                }
                            })

                        })
                    }
                }
            })


        });
}

function renderMessage(messageObject) {
    let { author, message } = messageObject;

    const now = new Date();

    let hour = now.getHours();
    let minutes = now.getMinutes();
    hour = (hour < 10) ? ('0' + hour).slice(-2) : hour;
    minutes = (minutes < 10) ? ('0' + minutes).slice(-2) : minutes;

    const currentDate = `${hour}:${minutes}`;

    let selfMessage = `<li _v-50b6d54c=""><p class="time" _v-50b6d54c=""><span _v-50b6d54c="">${currentDate}</span></p><div class="main self" _v-50b6d54c=""><div class="text" _v-50b6d54c=""><strong>${author}</strong><br>${message}</div></div></li>`
    let receivedMessage = `<li v-for="item in session.messages"><p class="time"><span>${currentDate}</span></p><div class="text"><strong>${author}</strong><br>${message}</div></li>`

    if (author == communicator) {
        $('.messages').append(selfMessage);
    } else {
        $('.messages').append(receivedMessage);
    }

};

function clearMessageInput() {
    $('textarea[name=message]').val("");
}

// Provisório => será substituido por algum método de recuperação de mensagens vindas do drive
socket.on('previousMessages', previousMessagesObject => {
    localStorage.setItem('messages', JSON.stringify(previousMessagesObject))
});

renderContacts();