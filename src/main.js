import { setup, teardown } from "../test/setup-tests";
import { makeApp } from "./app";
let app;
setup().then(() => {
  app = makeApp();
  app.start().catch((error) => {
    console.error(`[main] erro ao executar o programa: `, error);
    process.exit(1);
  });
});

const closeEvents = ["SIGINT", "SIGTERM"];
closeEvents.forEach((evt) =>
  process.on(evt, async () => {
    console.log(`[main] recebido o sinal SIGINT, finalizando...`);
    if (app) await app.stop();
    await teardown();

    console.log(`[main] finalizado com sucesso!`);
    process.exit(0);
  })
);
