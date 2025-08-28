import { ApplicationRunner } from "./infra/application-runner";

function main() {
  const args = process.argv.slice(2);
  const app = new ApplicationRunner();
  app.run(args);
}

main()