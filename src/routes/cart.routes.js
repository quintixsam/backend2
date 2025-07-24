import { Router } from "express";
import { purchaseCart } from "../controllers/cart.controller.js";
import { authenticateJwt } from "../middleware/authJWT.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = Router();

// Crear un nuevo carrito vacío
router.post("/", async (req, res) => {
    try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", cart: newCart });
    } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear carrito" });
    }
});

// Agregar un producto al carrito por ID
router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", cart });
    } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
    }
});

// Compra del carrito 
router.post("/:cid/purchase", authenticateJwt, authorizeRole("user"), purchaseCart);

export default router;