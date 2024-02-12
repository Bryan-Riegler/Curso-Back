import { createTransport } from "nodemailer";
import config from "../config/config.js";
import { logger } from "../utils/logger.js"

const transporter = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
    }
})

const msgRegister = (firstName) => `<h1>Hola, ${firstName}</h1>`

const msgReset = (firstName) => {
    return `<p>Hola ${firstName}
    Restablece la contraseña con este link en postman
    localhost:8080/user/updatePassword
    </p>`
}

const msgPassChanged = (firstName) => {
    return `<h1>Hola, ${firstName}</h1>
    <p>Su contraseña ha sido modificada con exito.</p>`
}

export const sendMail = async (user, service, token = null) => {
    try {
        const { firstName, email } = user;

        let msg = "";

        if (service === "register") {
            msg = msgRegister(firstName)
        } else if (service === "resetPassword") {
            msg = msgReset(firstName)
        } else if (service === "passChanged") {
            msg = msgPassChanged(firstName)
        } else {
            msg = ""
        }

        let subj = ""

        if (service === "register") {
            subj = "Bienvenido"
        } else if (service === "resetPassword") {
            subj = "Restablecimieto de contraseña"
        } else if (service === "passChanged") {
            subj = "Contraseña cambiada"
        } else {
            subj = ""
        }

        const gmailOptions = {
            from: config.EMAIL,
            to: email,
            subject: subj,
            html: msg
        }

        const response = await transporter.sendMail(gmailOptions)
        if (token !== null) return token;
        logger.info("email enviado")

    } catch (error) {
        console.log(error)
    }
}