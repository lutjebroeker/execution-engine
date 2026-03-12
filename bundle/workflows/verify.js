#!/usr/bin/env node
import { readFileSync } from "fs";

const content = readFileSync(
  "bundle/workflows/am-workflows-v1.json",
  "utf8"
);
const arr = JSON.parse(content);

// 1. Config node count per workflow
console.log("=== Config node count per workflow ===");
let allHaveConfig = true;
arr.forEach((wf) => {
  const count = wf.nodes.filter(
    (n) => n.name === "CONFIG \u2014 Edit These Values"
  ).length;
  console.log(count === 1 ? "OK" : "MISSING", wf.name + ":", count);
  if (count !== 1) allHaveConfig = false;
});
console.log("\nAll have exactly 1 Config node:", allHaveConfig);

// 2. Spot check expressions in downstream nodes
console.log("\n=== Spot check: expressions in downstream nodes ===");
const morning = arr.find((w) => w.name === "AM - Morning - Reflection");
const telegramNode = morning.nodes.find((n) => n.name === "Send a text message");
console.log(
  "Morning Reflection - Send a text message chatId:",
  telegramNode.parameters.chatId
);

const goalSel = arr.find((w) => w.name === "AM - Morning - Goal Selection");
const getNote = goalSel.nodes.find((n) => n.name === "Get Daily Note");
console.log("Goal Selection - Get Daily Note URL:", getNote.parameters.url);

// 3. Verify connections: trigger -> Config -> downstream
console.log("\n=== Spot check: trigger -> Config rewiring ===");
[
  "AM - Morning - Reflection",
  "AM - Evening - Start routine",
  "AM - Quarter - Review",
].forEach((name) => {
  const wf = arr.find((w) => w.name === name);
  const triggers = wf.nodes.filter(
    (n) =>
      n.type.toLowerCase().includes("trigger") ||
      n.type === "n8n-nodes-base.webhook"
  );
  triggers.forEach((t) => {
    const firstConn = wf.connections[t.name]?.main?.[0]?.[0]?.node;
    console.log(name + " - trigger [" + t.name + "] -> " + firstConn);
  });
  const configConn =
    wf.connections["CONFIG \u2014 Edit These Values"]?.main?.[0]?.[0]?.node;
  console.log("  Config -> " + configConn);
});

// 4. Personal value leak check
console.log("\n=== Personal value leak check ===");
const leaks = [
  "6897758158",
  "8227272160:AAH",
  "192.168.1.158",
  "/home/obsidian",
  "sk-ant-api03",
  "n8n.jellespek.nl",
];
leaks.forEach((v) => {
  if (content.includes(v)) console.log("LEAK:", v);
  else console.log("clean:", v);
});

// 5. File size
console.log("\nFile size:", Math.round(content.length / 1024) + "KB");
console.log("Workflow count:", arr.length);
