import { createPool } from "mysql2";
import { CreateAndFindManyProducts } from "./create-and-find-many-products";
import { CreateRandomProduct } from "./create-random-product";
import { env } from "./env";
import { MySQLProductsRepository } from "./mysql-products.repository";

export function makeApp() {
  console.log("env: ", env);
  const readDbPool = createPool({
    host: env.READ_DB_HOST,
    port: env.READ_DB_PORT,
    database: env.READ_DB_DATABASE,
    user: env.READ_DB_USER,
    ...(env.READ_DB_PASSWORD && { password: env.READ_DB_PASSWORD }),
  });

  const writeDbPool = createPool({
    host: env.WRITE_DB_HOST,
    port: env.WRITE_DB_PORT,
    database: env.WRITE_DB_DATABASE,
    user: env.WRITE_DB_USER,
    ...(env.WRITE_DB_PASSWORD && { password: env.WRITE_DB_PASSWORD }),
  });

  const productsRepository = new MySQLProductsRepository(
    readDbPool,
    writeDbPool
  );

  const createRandomProduct = new CreateRandomProduct(productsRepository);
  const createAndFindManyProducts = new CreateAndFindManyProducts(
    productsRepository,
    createRandomProduct,
    env.CREATE_PRODUCT_INTERVAL_MS
  );

  let stops = [];

  const stopPools = async () => {
    await new Promise((resolve) => {
      readDbPool.end((err) => {
        if (err) {
          console.error("[readDbPool.end] error: ", err);
        }
        resolve();
      });
    });

    await new Promise((resolve) => {
      writeDbPool.end((err) => {
        if (err) {
          console.error("[writeDbPool.end] error: ", err);
        }
        resolve();
      });
    });
  };

  stops.push(stopPools);

  return {
    dependencies: {
      createAndFindManyProducts,
      createRandomProduct,
      productsRepository,
      readDbPool,
      writeDbPool,
    },
    start: async () => {
      const generator = createAndFindManyProducts.execute();
      const { value } = await generator.next();
      const { stop } = value;
      if (stop instanceof Function) {
        stops.push(stop);
      }

      for await (const { product } of generator) {
        console.log(
          `[app] produto criado: ${JSON.stringify(product, null, 2)}`
        );
      }
    },
    stop: async () => {
      await Promise.all(
        stops.map((stop) => {
          return stop();
        })
      );
    },
  };
}
