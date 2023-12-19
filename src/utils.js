import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// export const isValidPassword = (user, password) => {
//     console.log('Ejecutando isValidPassword');
//     return bcrypt.compareSync(password, user.password);
// };
export const isValidPassword = (user, password) => {
    console.log('Ejecutando isValidPassword');
    return bcrypt.compareSync(password, user.password || ''); // Agregamos el manejo para contraseña nula
};



const PRIVATE_KEY = "coderJsonWebToken"

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" })
    return token
}

export const authToken = (req, res, next) => {
    const autHeader = req.headers.authorization
    if (!autHeader) return res.status(401).send({
        error: "No autorizado"
    })

    const token = autHeader.split(" ")[1]

    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if (error) return res.status(403).send({ error: "No autorizado" })
        req.user = credential.user
        next()
    })

}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname