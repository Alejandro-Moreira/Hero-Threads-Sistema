import dotenv from "dotenv";
dotenv.config();

import connection from "./database.js";
import Producto from "./models/productos.js";

const migrateDatabase = async () => {
  try {
    await connection();

    // Create unique index on name field
    await Producto.collection.createIndex({ name: 1 }, { unique: true });
    console.log('Índice único creado en el campo "name"');

    // Check for any duplicate names and remove them
    const duplicates = await Producto.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          docs: { $push: "$_id" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    if (duplicates.length > 0) {
      console.log("Encontrados productos con nombres duplicados:");
      for (const duplicate of duplicates) {
        console.log(`- ${duplicate._id}: ${duplicate.count} productos`);
        // Keep the first one, remove the rest
        const docsToRemove = duplicate.docs.slice(1);
        await Producto.deleteMany({ _id: { $in: docsToRemove } });
        console.log(`  Eliminados ${docsToRemove.length} productos duplicados`);
      }
    } else {
      console.log("No se encontraron productos con nombres duplicados");
    }

    console.log("Migración completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  }
};

migrateDatabase();
