import { setup, teardown } from "../test/setup-tests";
import { makeApp } from "./app";
import { env } from "./env";

async function main() {
  if (env.NODE_ENV === "test") {
    await setup();
  }

  const app = makeApp();
  await app.start();

  const closeEvents = ["SIGINT", "SIGTERM"];
  closeEvents.forEach((evt) =>
    process.once(evt, async () => {
      console.log(`[main] recebido o sinal ${evt}, finalizando...`);
      await app.stop();

      if (env.NODE_ENV === "test") {
        await teardown();
      }

      console.log(`[main] finalizado com sucesso!`);
      process.exit(0);
    })
  );
}

main().catch((error) => {
  console.error(`[main] erro ao executar o programa: `, error);
  process.exit(1);
});
