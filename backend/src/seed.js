import dotenv from "dotenv";
dotenv.config();

import connection from "./database.js";
import Producto from "./models/productos.js";

const defaultProducts = [
  {
    name: "Camiseta Spider-Man Clásico",
    description: "Diseño icónico del trepamuros, perfecto para cualquier fan.",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc08gWYphn7xHOTFQ3jrBEd0VGzfS9yKokWuAem",
  },
  {
    name: "Camiseta Capitán América",
    description: "El escudo y los colores del Capitán, símbolo de justicia.",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc04VuB3E007fmwyReAgKCraUIWzEDZ6on58JNO",
  },
  {
    name: "Camiseta Iron Man Mark 85",
    description: "Armadura de Iron Man, para los amantes de la tecnología.",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc04gqYUxk007fmwyReAgKCraUIWzEDZ6on58JN",
  },
  {
    name: "Camiseta Black Panther",
    description: "El rey de Wakanda, diseño elegante y poderoso.",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0zTDyG5eYLtCPgmTbn59N6BRyWUl87afK30Dw",
  },
  {
    name: "Camiseta Hulk Smash",
    description: "El gigante verde en acción, ¡fuerza bruta en tu pecho!",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc04g3nsEz007fmwyReAgKCraUIWzEDZ6on58JN",
  },
  {
    name: "Camiseta Thor Stormbreaker",
    description: "El dios del trueno con su arma, digno de Asgard.",
    price: 17.0,
    image:
      "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0pCZ4Gn89LiV6g1FsuhvBa0wlA7EzOrDJYMmS",
  },
];

const seedDatabase = async () => {
  try {
    await connection();

    // Clear existing products
    await Producto.deleteMany({});
    console.log("Base de datos limpiada");

    // Insert default products
    const insertedProducts = await Producto.insertMany(defaultProducts);
    console.log(`${insertedProducts.length} productos insertados exitosamente`);

    console.log("Base de datos poblada con productos por defecto");
    process.exit(0);
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
