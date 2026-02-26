import { runLocalSeedResetAndReseed } from "@/features/seed-data/local-seed-reset";

async function main(): Promise<void> {
  const result = await runLocalSeedResetAndReseed();
  console.log("Neo4j Seed-Reset/Reseed erfolgreich.");
  console.log(`Importierte Nodes: ${result.insertedNodeCount}`);
  console.log(`Importierte Relationen: ${result.insertedEdgeCount}`);
  console.log(`Read-Check Nodes: ${result.readCheckNodeCount}`);
  console.log(`Read-Check Relationen: ${result.readCheckEdgeCount}`);
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Neo4j Seed-Reset/Reseed fehlgeschlagen.");
  }

  process.exitCode = 1;
});
