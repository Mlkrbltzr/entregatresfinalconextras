//passport.config.js
import GitHubStrategy from "passport-github2";
import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../DAO/mongo/models/user.model.js";
import { PRIVATE_KEY } from "../utils.js";
import * as utils from "../utils.js";
import UserDTO from "../DAO/DTO/users.dto.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const localStrategy = local.Strategy;

// Función para inicializar Passport
const initializePassport = () => {
  // Serialización y deserialización de usuarios para la sesión
  passport.serializeUser((user, done) => {
    done(null, user._id); // Cambia user.id por user._id
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id); // Utiliza findById con el _id
      done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  // Estrategia de autenticación de GitHub
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
          // Verificación del usuario en la base de datos
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            // Creación de un nuevo usuario si no existe
            let newUser = {
              nombre: profile._json.name,
              email: profile._json.email,
              isGithubAuth: true,
            };

            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            // Usuario existente, se pasa al siguiente middleware
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de autenticación JWT
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: PRIVATE_KEY,
      },
      (payload, done) => {
        console.log("JWT Strategy - Payload:", payload);
        // Verificación del token mediante la función authToken
        authToken(payload, (error, user) => {
          if (error) {
            return done(error, false);
          }
          if (user) {
            // Si el token es válido, se pasa al siguiente middleware
            console.log("JWT Strategy - User:", user);
            return done(null, user);
          } else {
            // Token no válido, se niega el acceso
            return done(null, false);
          }
        });
      }
    )
  );

  // Estrategia de autenticación JWT para la sesión actual
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (payload, done) => {
        try {
          console.log("Payload en estrategia 'current':", payload);
          const user = await userModel.findOne({ email: payload.user.email });
          console.log("Usuario encontrado:", user);
  
          if (!user) {
            console.log("Usuario no encontrado, se niega el acceso");
            // Usuario no encontrado, se niega el acceso
            return done(null, false);
          }

          // Creación de un objeto UserDTO con la información necesaria
          const userDTO = {
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            carrito: user.cartId,
            rol: user.rol,
          };

          // Se pasa al siguiente middleware con el objeto UserDTO
          return done(null, userDTO);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};

// Middleware para verificar roles
function checkRole(roles) {
  return function (req, res, next) {
    console.log("Usuario en la ruta protegida:", req.user); // Agregamos esta línea

    const user = req.user; // El objeto UserDTO almacenado por Passport en req.user

    if (user && roles.includes(user.rol)) {
      // El usuario tiene uno de los roles requeridos, permitir acceso a la ruta
      next();
    } else {
      // Usuario no autorizado para acceder a esta ruta
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta." });
    }
  };
}

// Exporta las funciones de inicialización y verificación de roles
export { initializePassport, checkRole, PRIVATE_KEY  };