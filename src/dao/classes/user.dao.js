
class UserDAO {
  async getUsers() {
    try {
      let users = await userModel.find();
      return users;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      let user = await userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async saveUser(user) {
    try {
      let result = await userModel.create(user);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateUser(id, user) {
    try {
      let result = await userModel.updateOne({ _id: id }, { $set: user });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

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

  // Nueva función para actualizar el carrito del usuario
  async updateUserCart(userId, failedProductIds) {
    try {
      // Implementa la lógica para actualizar el carrito del usuario en la base de datos
      // Puedes usar la conexión a la base de datos (userModel) u otros métodos según tu implementación
      // Ejemplo:
      await userModel.updateOne(
        { _id: userId },
        { $addToSet: { 'cart.failedProductIds': { $each: failedProductIds } } }
      );

      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UserDAO;