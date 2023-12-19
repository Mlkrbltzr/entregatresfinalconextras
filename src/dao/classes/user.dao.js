/*import userModel from "../models/user.model.js";

export default class User {
    getUsers = async () => {
        try {
            let users = await userModel.find()
            return users
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getUserById = async (id) => {
        try {
            let user = await userModel.findOne({ _id: id })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    saveUser = async (user) => {
        try {
            let result = await userModel.create(user)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateUser = async (id, user) => {
        try {
            let result = await userModel.updateOne({ _id: id }, { $set: user })
            return result
        } catch (error) {
            return null
        }
    }
}*/
// user.dao.js
import userModel from "../models/user.model.js";

class UserDAO {
  // Funciones originales del usuario
  async getUsers() {
    try {
      let users = await userModel.find();
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      let user = await userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async saveUser(user) {
    try {
      let result = await userModel.create(user);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser(id, user) {
    try {
      let result = await userModel.updateOne({ _id: id }, { $set: user });
      return result;
    } catch (error) {
      return null;
    }
  }

  // Nueva función para agregar al carrito
  async addToCart(userId, productId, quantity) {
    try {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const existingProduct = user.cart.find(item => item.product.equals(productId));

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default UserDAO;