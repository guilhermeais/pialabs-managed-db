import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { env } from "../src/env";
import { createConnection } from "mysql2";

/**
 * @type {StartedMySqlContainer}
 */
let mysqlContainer;
async function createMySqlContainer() {
  console.log("Creating MySqlContainer...⏳");
  mysqlContainer = await new MySqlContainer().start();
  await migrateMysqlDatabase();
  console.log("MySqlContainer created.🚀");
}

async function migrateMysqlDatabase() {
  const schema = `
    create table produto (
        id int auto_increment,
        descricao varchar(50) not null,
        categoria varchar(10) not null,
        valor numeric(15,2) not null,
        criado_em datetime default now(),
        criado_por varchar(20) not null,
        primary key (id),
        unique(descricao, criado_por)
        );    
    `;

  const client = createConnection({
    host: mysqlContainer.getHost(),
    port: mysqlContainer.getPort(),
    database: mysqlContainer.getDatabase(),
    user: mysqlContainer.getUsername(),
    password: mysqlContainer.getUserPassword(),
  });

  await new Promise((resolve, reject) => {
    client.query(schema, (error) => {
      if (error) {
        reject(error);
        return;
      }

      client.end(() => {
        resolve();
      });
    });
  });

  console.log("Database migrated.🚀");
}

export async function setup() {
  console.log("Setup tests... ⏳");

  await createMySqlContainer();

  process.env.READ_DB_HOST = mysqlContainer.getHost();
  process.env.READ_DB_PORT = mysqlContainer.getPort();
  process.env.READ_DB_DATABASE = mysqlContainer.getDatabase();
  process.env.READ_DB_USER = mysqlContainer.getUsername();
  process.env.READ_DB_PASSWORD = mysqlContainer.getUserPassword();

  process.env.WRITE_DB_HOST = mysqlContainer.getHost();
  process.env.WRITE_DB_PORT = mysqlContainer.getPort();
  process.env.WRITE_DB_DATABASE = mysqlContainer.getDatabase();
  process.env.WRITE_DB_USER = mysqlContainer.getUsername();
  process.env.WRITE_DB_PASSWORD = mysqlContainer.getUserPassword();

  env.READ_DB_HOST = mysqlContainer.getHost();
  env.READ_DB_PORT = mysqlContainer.getPort();
  env.READ_DB_DATABASE = mysqlContainer.getDatabase();
  env.READ_DB_USER = mysqlContainer.getUsername();
  env.READ_DB_PASSWORD = mysqlContainer.getUserPassword();

  env.WRITE_DB_HOST = mysqlContainer.getHost();
  env.WRITE_DB_PORT = mysqlContainer.getPort();
  env.WRITE_DB_DATABASE = mysqlContainer.getDatabase();
  env.WRITE_DB_USER = mysqlContainer.getUsername();
  env.WRITE_DB_PASSWORD = mysqlContainer.getUserPassword();

  console.log("Tests setup completed! 🚀");
}

export async function teardown() {
  console.log("Teardown tests... ⏳");

  mysqlContainer && (await mysqlContainer.stop());

  console.log("Tests teardown completed! 🚀");
}
