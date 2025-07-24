import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Ticket from "../models/Ticket.js";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;
    const purchaser = req.user.email;

    try {
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    let totalAmount = 0;
    const productsWithoutStock = [];

    for (const item of cart.products) {
        const product = item.product;
        const quantity = item.quantity;

        if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
        totalAmount += product.price * quantity;
        } else {
        productsWithoutStock.push(product._id);
        }
    }

    // Crear ticket
    const ticket = await Ticket.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser
    });

    // Filtrar solo los productos sin stock para dejarlos en el carrito
    cart.products = cart.products.filter(p => productsWithoutStock.includes(p.product._id));
    await cart.save();

    res.json({
        status: "success",
        message: productsWithoutStock.length > 0
        ? "Compra parcial. Algunos productos no tenían stock."
        : "Compra exitosa",
        ticket,
        sinStock: productsWithoutStock
    });
    } catch (error) {
    res.status(500).json({ message: "Error al procesar compra", error: error.message });
    }
};
