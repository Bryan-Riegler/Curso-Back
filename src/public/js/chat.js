const socket = io();

let username = null;

if (!username) {
    Swal.fire({
        title: "Bienvenido al chat",
        text: "Ingresa un nombre de usuario",
        input: "text",
        inputValidator: (value) => {
            if (!value) return "ingrese un nombre de usuario";
        }
    })
        .then((input) => {
            username = input.value;
            socket.emit("newUser", username);
        })
}

const message = document.getElementById("message");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const actions = document.getElementById("actions");

btn.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("chat:message", {
        username,
        message: message.value,
    });
    message.value = "";
});

socket.on("messages", (data) => {
    actions.innerHTML = "";
    const chat = data.map((msg) => {
        return `<p><strong> ${msg.username}</strong>: ${msg.message}</p>`
    }).join(" ")
    output.innerHTML = chat
})

socket.on("newUser", (username) => {
    Toastify({
        text: `${username} se conecto`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "#576fd8"
        }
    }).showToast()
})

message.addEventListener("keypress", () => {
    socket.emit("chat:typing", username)
})

socket.on("chat:typing", (user) => {
    actions.innerHTML = `<p>${user} esta escribiendo...</p>`
})