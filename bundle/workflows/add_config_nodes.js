#!/usr/bin/env node
/**
 * Add CONFIG — Edit These Values Set node to each AM workflow that uses
 * buyer-configurable values, and update downstream node references.
 *
 * Run: node bundle/workflows/add_config_nodes.js
 */

import { readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";

const INPUT_PATH =
  "/root/projects/personal/execution-engine/bundle/workflows/am-workflows-v1.json";
const OUTPUT_PATH = INPUT_PATH;

// Placeholder strings the sanitize script already put in place
const PLACEHOLDERS = {
  telegramChatId: "YOUR_TELEGRAM_CHAT_ID",
  botToken: "YOUR_BOT_TOKEN",
  nodeRedBaseUrl: "http://YOUR_NODERED_HOST:1880",
  vaultRootPath: "/path/to/your/vault",
  claudeApiKey: "YOUR_CLAUDE_API_KEY",
  n8nHost: "https://YOUR_N8N_HOST",
};

// Expression templates (n8n expression syntax)
const EXPR = {
  telegramChatId:
    '={{$node["CONFIG — Edit These Values"].json["telegramChatId"]}}',
  botToken: '={{$node["CONFIG — Edit These Values"].json["botToken"]}}',
  nodeRedBaseUrl:
    '={{$node["CONFIG — Edit These Values"].json["nodeRedBaseUrl"]}}',
  vaultRootPath:
    '={{$node["CONFIG — Edit These Values"].json["vaultRootPath"]}}',
  claudeApiKey:
    '={{$node["CONFIG — Edit These Values"].json["claudeApiKey"]}}',
  n8nHost: '={{$node["CONFIG — Edit These Values"].json["n8nHost"]}}',
};

// Config node definition (Set node, typeVersion 3.4)
function makeConfigNode(position) {
  return {
    parameters: {
      assignments: {
        assignments: [
          {
            id: randomUUID(),
            name: "telegramChatId",
            value: "YOUR_TELEGRAM_CHAT_ID",
            type: "string",
          },
          {
            id: randomUUID(),
            name: "botToken",
            value: "YOUR_BOT_TOKEN",
            type: "string",
          },
          {
            id: randomUUID(),
            name: "nodeRedBaseUrl",
            value: "http://YOUR_NODERED_HOST:1880",
            type: "string",
          },
          {
            id: randomUUID(),
            name: "vaultRootPath",
            value: "/path/to/your/vault",
            type: "string",
          },
          {
            id: randomUUID(),
            name: "claudeApiKey",
            value: "sk-ant-YOUR_CLAUDE_API_KEY",
            type: "string",
          },
          {
            id: randomUUID(),
            name: "n8nHost",
            value: "https://YOUR_N8N_HOST",
            type: "string",
          },
        ],
      },
      options: {},
    },
    id: randomUUID(),
    name: "CONFIG — Edit These Values",
    type: "n8n-nodes-base.set",
    typeVersion: 3.4,
    position: position,
    notes:
      "Edit ALL values here before activating this workflow. See README.md for instructions.",
  };
}

// Deep-replace a string value within a node parameter (handles = prefix for expressions)
function replaceInString(str, oldVal, newVal) {
  if (typeof str !== "string") return str;
  // Simple string replacement
  return str.replaceAll(oldVal, newVal);
}

// Recursively walk an object and replace placeholder strings with Config node expressions
function replaceInObject(obj, replacements) {
  if (typeof obj === "string") {
    let result = obj;
    for (const [old, newVal] of replacements) {
      result = result.replaceAll(old, newVal);
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceInObject(item, replacements));
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = replaceInObject(v, replacements);
    }
    return out;
  }
  return obj;
}

// Determine which config fields a workflow uses
function getUsedFields(wf) {
  const json = JSON.stringify(wf);
  const used = new Set();
  if (json.includes(PLACEHOLDERS.telegramChatId)) used.add("telegramChatId");
  if (json.includes(PLACEHOLDERS.botToken)) used.add("botToken");
  if (json.includes(PLACEHOLDERS.nodeRedBaseUrl)) used.add("nodeRedBaseUrl");
  if (json.includes(PLACEHOLDERS.vaultRootPath)) used.add("vaultRootPath");
  if (json.includes(PLACEHOLDERS.claudeApiKey)) used.add("claudeApiKey");
  if (json.includes(PLACEHOLDERS.n8nHost)) used.add("n8nHost");
  return used;
}

// Find trigger nodes (nodes with no incoming connections)
function findTriggerNodes(wf) {
  const hasIncoming = new Set();
  for (const [, targets] of Object.entries(wf.connections)) {
    for (const branch of Object.values(targets)) {
      for (const connList of branch) {
        for (const conn of connList) {
          hasIncoming.add(conn.node);
        }
      }
    }
  }
  return wf.nodes.filter((n) => !hasIncoming.has(n.name));
}

// Calculate position for Config node: place it to the left of the leftmost non-trigger node
function calculateConfigPosition(wf, triggerNodes) {
  const triggerNames = new Set(triggerNodes.map((n) => n.name));
  const nonTriggerNodes = wf.nodes.filter((n) => !triggerNames.has(n.name));

  if (nonTriggerNodes.length === 0) {
    // Fallback: place after trigger
    const trigger = triggerNodes[0];
    return [trigger.position[0] + 200, trigger.position[1]];
  }

  // Find leftmost non-trigger node
  const leftmost = nonTriggerNodes.reduce((min, n) =>
    n.position[0] < min.position[0] ? n : min
  );

  return [leftmost.position[0] - 220, leftmost.position[1]];
}

// Insert CONFIG node into workflow and rewire connections
function addConfigNode(wf) {
  const usedFields = getUsedFields(wf);
  if (usedFields.size === 0) {
    return { wf, added: false, reason: "no configurable values" };
  }

  // Check if already has a Config Set node
  const existingConfig = wf.nodes.find(
    (n) => n.name === "CONFIG — Edit These Values"
  );
  if (existingConfig) {
    return { wf, added: false, reason: "config node already exists" };
  }

  const triggers = findTriggerNodes(wf);
  if (triggers.length === 0) {
    return { wf, added: false, reason: "no trigger node found" };
  }

  // Position: place Config node between the main trigger and its first downstream node
  const mainTrigger = triggers[0];
  const firstDownstreamName =
    wf.connections[mainTrigger.name]?.main?.[0]?.[0]?.node;

  let configPosition;
  if (firstDownstreamName) {
    const firstDownstream = wf.nodes.find((n) => n.name === firstDownstreamName);
    // Place Config node halfway between trigger and first downstream
    configPosition = [
      Math.round((mainTrigger.position[0] + firstDownstream.position[0]) / 2),
      mainTrigger.position[1],
    ];
  } else {
    configPosition = [mainTrigger.position[0] + 200, mainTrigger.position[1]];
  }

  const configNode = makeConfigNode(configPosition);
  const configName = configNode.name;

  // Build replacement pairs for node parameters
  const replacements = [];
  if (usedFields.has("telegramChatId"))
    replacements.push([PLACEHOLDERS.telegramChatId, EXPR.telegramChatId]);
  if (usedFields.has("botToken"))
    replacements.push([PLACEHOLDERS.botToken, EXPR.botToken]);
  if (usedFields.has("nodeRedBaseUrl"))
    replacements.push([PLACEHOLDERS.nodeRedBaseUrl, EXPR.nodeRedBaseUrl]);
  if (usedFields.has("vaultRootPath"))
    replacements.push([PLACEHOLDERS.vaultRootPath, EXPR.vaultRootPath]);
  if (usedFields.has("claudeApiKey"))
    replacements.push([PLACEHOLDERS.claudeApiKey, EXPR.claudeApiKey]);
  if (usedFields.has("n8nHost"))
    replacements.push([PLACEHOLDERS.n8nHost, EXPR.n8nHost]);

  // Update downstream node parameters with expressions
  const updatedNodes = wf.nodes.map((node) => {
    if (node.name === configName) return node; // skip config itself
    const updatedParams = replaceInObject(node.parameters, replacements);
    return { ...node, parameters: updatedParams };
  });

  // Add config node
  updatedNodes.push(configNode);

  // Rewire: trigger → Config → (previous first downstream)
  const updatedConnections = { ...wf.connections };

  if (firstDownstreamName) {
    // Trigger now points to Config
    updatedConnections[mainTrigger.name] = {
      main: [[{ node: configName, type: "main", index: 0 }]],
    };
    // Config points to what trigger previously pointed to
    updatedConnections[configName] = {
      main: [[{ node: firstDownstreamName, type: "main", index: 0 }]],
    };
  } else {
    // Trigger had no downstream — Config is now the only child
    updatedConnections[mainTrigger.name] = {
      main: [[{ node: configName, type: "main", index: 0 }]],
    };
  }

  const updatedWf = {
    ...wf,
    nodes: updatedNodes,
    connections: updatedConnections,
  };

  return { wf: updatedWf, added: true, usedFields: [...usedFields] };
}

// Main
const workflows = JSON.parse(readFileSync(INPUT_PATH, "utf8"));

let addedCount = 0;
const results = [];

const updatedWorkflows = workflows.map((wf) => {
  const { wf: updated, added, reason, usedFields } = addConfigNode(wf);
  if (added) {
    addedCount++;
    console.log(`✓ ${wf.name}: Config node added (fields: ${usedFields.join(", ")})`);
  } else {
    console.log(`- ${wf.name}: skipped (${reason})`);
  }
  results.push({ name: wf.name, added, reason, usedFields });
  return updated;
});

writeFileSync(OUTPUT_PATH, JSON.stringify(updatedWorkflows, null, 2));
console.log(`\nDone. Added Config node to ${addedCount}/${workflows.length} workflows.`);
console.log(`Output: ${OUTPUT_PATH}`);

// Verify
const content = readFileSync(OUTPUT_PATH, "utf8");
const configCount = (content.match(/CONFIG — Edit These Values/g) || []).length;
console.log(`\nConfig node references in JSON: ${configCount}`);

// Check for any remaining raw placeholders (should now all be expressions)
const leakChecks = [
  [PLACEHOLDERS.telegramChatId, "telegramChatId"],
  [PLACEHOLDERS.nodeRedBaseUrl, "nodeRedBaseUrl"],
  [PLACEHOLDERS.vaultRootPath, "vaultRootPath (in params)"],
];

let leakFound = false;
for (const [val, label] of leakChecks) {
  // Count occurrences - in Config nodes themselves it's expected
  const occurrences = (content.match(new RegExp(val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (occurrences > 0) {
    console.log(`  ${label}: ${occurrences} occurrences (expected in Config node parameters)`);
  }
}
