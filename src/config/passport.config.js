import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import local from "passport-local";
import UsersDao from "../DAO/classes/user.dao.js"
import UserDTO from "../DAO/DTO/users.DTO.js";

const localStrategy = local.Strategy;

const UsersDaoInstance = new UsersDao();

const initializePassport = () => {
  // ... Código existente para 'formRegister', 'serializeUser', 'deserializeUser', y 'login'

  // Estrategia de autentificación de Passport-GitHub (GitHubStrategy)
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.1af45b5fa22337f6",
        clientSecret: "4eb0b5aac14109416669b48080f2a25a0148a7ab",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          // Verificación del Usuario
          let user = await UsersDaoInstance.findEmail({ email: profile.__json.email });
          if (!user) {
            // Creación de un Nuevo Usuario
            const newUserDTO = new UserDTO({
              first_name: profile.__json.name,
              last_name: "github",
              age: 20,
              email: profile.__json.email,
              rol: "admin",
              password: "",
            });

            let result = await UsersDaoInstance.addUser(newUserDTO);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;