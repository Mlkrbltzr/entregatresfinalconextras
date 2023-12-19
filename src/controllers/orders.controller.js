import Order from "../dao/classes/order.dao.js"
import Business from "../dao/classes/business.dao.js"
import User from "../dao/classes/user.dao.js"



const usersService = new User()
const ordersService = new Order()
const businessService = new Business()


export const getOrders = async (req, res) => {
    let result = await ordersService.getOrders()
    res.send({ status: "success", result: result })
}

export const getOrderById = async (req, res) => {
    const { oid } = req.params
    let order = await ordersService.getOrderById(oid)
    res.send({ status: "success", result: order })
}

export const createOrder = async (req, res) => {
  const { user, business, products } = req.body;

  try {
    // Obtener el usuario y el negocio
    const resultUser = await usersService.getUserById(user);
    const resultBusiness = await businessService.getBusinessById(business);

    // Verificar que se hayan obtenido el usuario y el negocio
    if (!resultUser || !resultBusiness) {
      return res.status(500).send({ status: "error", error: "No se pudo obtener el usuario o el negocio" });
    }

    // Filtrar productos para obtener los detalles de los productos en la orden
    const actualOrders = resultBusiness.products.filter(product => products.includes(product.id));

    // Calcular la suma de precios
    const sum = actualOrders.reduce((acc, prev) => acc + prev.price, 0);

    // Verificar si sum es un número válido
    if (isNaN(sum)) {
      return res.status(500).send({ status: "error", error: "La suma de precios no es un número válido" });
    }

    // Generar el número de orden
    const orderNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

    // Crear la orden
    const order = {
      number: orderNumber,
      business,
      user,
      status: "pendiente",
      products: actualOrders.map(product => product.id),
      totalPrice: sum
    };

    // Crear la orden en la base de datos
    const orderResult = await ordersService.createOrder(order);

    // Actualizar la lista de órdenes del usuario
    resultUser.orders.push(orderResult._id);
    await usersService.updateUser(user, resultUser);

    res.send({ status: "success", result: orderResult });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "Algo salió mal al procesar la orden" });
  }
};

export const resolveOrder = async (req, res) => {
    const { resolve } = req.query
    let order = await ordersService.getOrderById(req.params.oid)
    order.status = resolve
    await ordersService.resolveOrder(order._id, order)
    res.send({ status: "success", result: "orden resuelta" })
}