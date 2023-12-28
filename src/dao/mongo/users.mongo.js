//users.mongo.js
import bcrypt from "bcrypt";
import { userModel } from "./models/user.model.js";

class UserDAO {
    // Obtener todos los usuarios
    async getAllUsers() {
        try {
            const users = await userModel.find();
            return { result: "success", payload: users };
        } catch (error) {
            console.error(error);
            return null;
        }
    }   

    async createUser(userData) {
        const { nombre, apellido, email, password } = userData;
        if (!nombre || !apellido || !email || !password) {
            return { status: "error", error: "Missing data" };
        } 
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const usuario = await userModel.create({ nombre, apellido, email, password: hashedPassword });
            return { status: "success", message: "User created", user: usuario };
        } catch (error) {
            console.error("Error creating user:", error);
            return { status: "error", error: "Error creating user", details: error.message };
        }
    }
    // Buscar un usuario por su ID 
    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Buscar un usuario por su correo
    async getUserByEmail(email) {
        try {
          const user = await userModel.findOne({ email });
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
    }

    // Comparar contraseñas
    async comparePasswords(newPassword, hashedPassword) {
        try {
          return await bcrypt.compare(newPassword, hashedPassword);
        } catch (error) {
          console.error('Error al comparar contraseñas:', error);
          return false; // Manejar el error según la lógica de tu aplicación
        }
    }

    // Actualizar la contraseña de un usuario
    async updatePassword(userId, newPassword) {
        try {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
          );
      
          return updatedUser;
        } catch (error) {
          console.error(`Error al actualizar la contraseña: ${error}`);
          return null;
        }
    }

    // Actualizar un usuario por su ID
    async updateUserById(userId, updateFields) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
            return updatedUser;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Eliminar un usuario por su ID
    async deleteUserById(userId) {
        try {
            await userModel.findByIdAndDelete(userId);
            return { message: "User deleted" };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

// Exportar la clase UserDAO
export default UserDAO;
