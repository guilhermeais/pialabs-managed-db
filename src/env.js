import "dotenv";

export const env = {
  READ_DB_HOST: process.env.READ_DB_HOST,
  READ_DB_PORT: process.env.READ_DB_PORT,
  READ_DB_USER: process.env.READ_DB_USER,
  READ_DB_PASSWORD: process.env.READ_DB_PASSWORD,
  READ_DB_DATABASE: process.env.READ_DB_DATABASE,

  WRITE_DB_HOST: process.env.WRITE_DB_HOST,
  WRITE_DB_PORT: process.env.WRITE_DB_PORT,
  WRITE_DB_USER: process.env.WRITE_DB_USER,
  WRITE_DB_PASSWORD: process.env.WRITE_DB_PASSWORD,
  WRITE_DB_DATABASE: process.env.WRITE_DB_DATABASE,

  CREATE_PRODUCT_INTERVAL_MS: process.env.CREATE_PRODUCT_INTERVAL_MS
    ? parseInt(process.env.CREATE_PRODUCT_INTERVAL_MS)
    : 500,
  MAX_PRODUCTS: process.env.MAX_PRODUCTS,
};
