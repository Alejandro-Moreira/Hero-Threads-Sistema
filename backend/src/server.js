import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerLogin from "./routers/router_login.js";
import routerCliente from "./routers/router_clientes.js";
import routerProductos from "./routers/router_productos.js";
import routerReportes from "./routers/router_reportes.js";
import routerEmail from "./routers/router_email.js";
import routerVentas from "./routers/router_ventas.js";
import routerSession from "./routers/router_session.js";
import routerAuth from "./routers/router_auth.js";

// Inicializaciones
dotenv.config();
const app = express();

// Puerto
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (solo si tienes frontend en carpeta "public")
app.use(express.static("public"));

// Rutas
app.use("/api/login", routerLogin);
app.use("/api/auth", routerAuth);
app.use("/api/clientes", routerCliente);
app.use("/api/productos", routerProductos);
app.use("/api/reportes", routerReportes);
app.use("/api/email", routerEmail);
app.use("/api/ventas", routerVentas);
app.use("/api/session", routerSession);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Hero Threads API is running",
    timestamp: new Date().toISOString()
  });
});

// Fallback 404
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

export default app;
