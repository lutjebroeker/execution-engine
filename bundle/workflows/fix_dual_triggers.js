#!/usr/bin/env node
/**
 * Fix workflows where a secondary trigger bypasses the Config node.
 * Routes all trigger outputs through CONFIG — Edit These Values.
 */

import { readFileSync, writeFileSync } from "fs";

const PATH =
  "/root/projects/personal/execution-engine/bundle/workflows/am-workflows-v1.json";

const CONFIG_NAME = "CONFIG \u2014 Edit These Values";

const arr = JSON.parse(readFileSync(PATH, "utf8"));

let fixCount = 0;

const updated = arr.map((wf) => {
  const configNode = wf.nodes.find((n) => n.name === CONFIG_NAME);
  if (!configNode) return wf;

  // Find triggers that do NOT connect to Config as their first output
  const triggerNodes = wf.nodes.filter(
    (n) =>
      n.type.toLowerCase().includes("trigger") ||
      n.type === "n8n-nodes-base.webhook"
  );

  let changed = false;
  const newConnections = { ...wf.connections };

  triggerNodes.forEach((trigger) => {
    const firstConn = wf.connections[trigger.name]?.main?.[0]?.[0]?.node;
    if (firstConn && firstConn !== CONFIG_NAME) {
      console.log(
        `Fixing ${wf.name}: trigger [${trigger.name}] -> ${firstConn} (bypasses Config)`
      );
      // Reroute: trigger -> Config
      newConnections[trigger.name] = {
        main: [[{ node: CONFIG_NAME, type: "main", index: 0 }]],
      };
      // Config already connects to its target — add this node as another output branch
      // if it isn't already pointing there
      const configConn = wf.connections[CONFIG_NAME]?.main?.[0]?.[0]?.node;
      if (configConn !== firstConn) {
        // Config's existing output stays; we add a second output to cover the bypassed downstream
        // Best approach: make Config point to firstConn too via additional branch
        // n8n supports multiple outputs on a Set node — main[0] and main[1]
        const existingBranch = newConnections[CONFIG_NAME]?.main?.[0] || [];
        const alreadyCovered = existingBranch.some(
          (c) => c.node === firstConn
        );
        if (!alreadyCovered) {
          // Add firstConn as a second connection from Config (parallel branch)
          newConnections[CONFIG_NAME] = {
            main: [
              [
                ...existingBranch,
                { node: firstConn, type: "main", index: 0 },
              ],
            ],
          };
        }
      }
      changed = true;
      fixCount++;
    }
  });

  if (!changed) return wf;
  return { ...wf, connections: newConnections };
});

writeFileSync(PATH, JSON.stringify(updated, null, 2));
console.log(`\nFixed ${fixCount} bypass(es). File updated.`);

// Verify Quarter Review
const qr = updated.find((w) => w.name === "AM - Quarter - Review");
console.log("\nQuarter Review trigger connections after fix:");
qr.nodes
  .filter((n) => n.type.toLowerCase().includes("trigger"))
  .forEach((t) => {
    const conn = qr.connections[t.name]?.main?.[0];
    console.log(" ", t.name, "->", conn?.map((c) => c.node).join(", "));
  });
console.log(
  "Config ->",
  qr.connections[CONFIG_NAME]?.main?.[0]?.map((c) => c.node).join(", ")
);
