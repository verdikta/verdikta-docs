#!/usr/bin/env node
// Checks that the user guide and the whitepaper still say what the deployed
// contracts do. For every entry of scripts/live-facts.json it compares three things:
//   1. the value read from the contracts on Base mainnet now,
//   2. the value the documents were written against (`expected`),
//   3. whether each document still contains the sentence that states it.
//
//   node scripts/check-live-facts.mjs
//
// Options:
//   --user-guide <file>   check this copy of the user guide (for example a branch
//                         of verdikta-applications that is not merged yet)
//   --skip-web            do not fetch the documents that are only reachable by URL
//   RPC_URL=<url>         use another Base mainnet RPC endpoint
//
// Needs Node 18 or later and nothing else. It only reads. Exit code 1 means that
// a value changed on chain or a document no longer states it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'scripts/live-facts.json'), 'utf8'));
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const rpcUrl = process.env.RPC_URL || cfg.chain.rpc;

/* ── chain reads ─────────────────────────────────────────────────────── */

let rpcId = 0;
async function rpc(method, params) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    });
    const body = await res.json().catch(() => ({}));
    if (body.result !== undefined) return body.result;
    if (attempt === 4) throw new Error(`${method} failed: ${JSON.stringify(body.error || res.status)}`);
    await new Promise(r => setTimeout(r, 500 * attempt));
  }
}
const call = (to, data) => rpc('eth_call', [{ to, data }, 'latest']);
const word = (hex, i) => hex.slice(2 + 64 * i, 66 + 64 * i);
const asUint = w => BigInt('0x' + w);
const asInt = w => (asUint(w) >= 1n << 255n ? asUint(w) - (1n << 256n) : asUint(w));
const asAddress = w => '0x' + w.slice(24).toLowerCase();
const pad = v => v.toString(16).padStart(64, '0');

async function readChain() {
  const chainId = Number(await rpc('eth_chainId', []));
  if (chainId !== cfg.chain.chainId) throw new Error(`RPC is chain ${chainId}, expected ${cfg.chain.chainId}`);
  const where = { aggregator: cfg.chain.aggregator };
  where.keeper = asAddress(word(await call(where.aggregator, '0xcb09ef31'), 0)); // reputationKeeper()

  const live = {};
  for (const fact of cfg.facts.filter(f => f.read.selector)) {
    const w = word(await call(where[fact.read.on], fact.read.selector), 0);
    live[fact.id] = { uint: asUint(w), int: asInt(w), address: asAddress(w) }[fact.read.as].toString();
  }

  // the registry: every arbiter, its operator contract, that contract's owner, its fee
  const count = Number(asUint(word(await call(where.keeper, '0xfd920126'), 0))); // getRegisteredOraclesCount()
  const perOwner = new Map();
  const ownerOf = new Map();
  const fees = new Set();
  for (let i = 0; i < count; i++) {
    const entry = await call(where.keeper, '0x3d10c2e0' + pad(BigInt(i))); // registeredOracles(i)
    const operator = asAddress(word(entry, 0));
    const jobId = word(entry, 1);
    if (!ownerOf.has(operator)) ownerOf.set(operator, asAddress(word(await call(operator, '0x8da5cb5b'), 0))); // owner()
    const owner = ownerOf.get(operator);
    perOwner.set(owner, (perOwner.get(owner) || 0) + 1);
    const info = await call(where.keeper, '0x95e1c539' + pad(BigInt(operator)) + jobId); // getOracleInfo(operator, jobId)
    fees.add(asUint(word(info, 5)).toString());
  }
  live.arbiters = String(count);
  live.operators = String(ownerOf.size);
  live.owners = String(perOwner.size);
  live.largestOwner = String(Math.max(0, ...perOwner.values()));
  live.fees = [...fees].sort().join(' and ');
  live.roundCost = fees.size === 1
    ? (BigInt([...fees][0]) * (BigInt(live.K) + BigInt(live.B) * BigInt(live.P))).toString()
    : 'not one figure: arbiters charge different fees';
  for (const fact of cfg.facts.filter(f => f.read.computed)) live[fact.id] = live[fact.read.computed];
  return live;
}

/* ── documents ───────────────────────────────────────────────────────── */

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

async function loadDocument(id, doc) {
  const override = id === 'user-guide' ? option('--user-guide') : undefined;
  const file = override || (doc.file && path.join(root, doc.file));
  if (file && fs.existsSync(file)) return { text: fs.readFileSync(file, 'utf8'), from: path.relative(process.cwd(), file) };
  if (!doc.url) return { missing: `${doc.file} not found` };
  if (flag('--skip-web')) return { missing: 'skipped (--skip-web)' };
  const res = await fetch(doc.url);
  if (!res.ok) return { missing: `${doc.url} answered ${res.status}` };
  const body = await res.text();
  return { text: doc.html ? htmlToText(body) : body, from: doc.url };
}

/* ── compare ─────────────────────────────────────────────────────────── */

const live = await readChain();
let problems = 0;

console.log(`Contracts on ${cfg.chain.name} (aggregator ${cfg.chain.aggregator}), documents written against the values of ${cfg.checked}\n`);
for (const fact of cfg.facts) {
  const same = live[fact.id] === fact.expected;
  if (!same) problems++;
  console.log(`${same ? 'ok     ' : 'CHANGED'} ${fact.id.padEnd(22)} ${live[fact.id]}${same ? '' : `   (documents were written for ${fact.expected})`}`);
  if (!same) console.log(`        ${fact.what}. Read from: ${fact.read.call || fact.read.from}`);
}

for (const [id, doc] of Object.entries(cfg.documents)) {
  const loaded = await loadDocument(id, doc);
  console.log(`\n${doc.title}`);
  if (loaded.missing) { console.log(`  not checked: ${loaded.missing}`); continue; }
  console.log(`  read from ${loaded.from}`);
  const text = loaded.text.replace(/\s+/g, ' ');
  let missing = 0;
  for (const fact of cfg.facts) {
    const pattern = fact.stated[doc.patternsOf || id];
    if (!pattern || new RegExp(pattern).test(text)) continue;
    missing++;
    console.log(`  NOT FOUND ${fact.id}: no text matching /${pattern}/  (${fact.what})`);
  }
  problems += missing;
  if (!missing) console.log('  every statement found');
}

console.log(problems
  ? `\n${problems} difference(s). A CHANGED value means the contracts no longer match the documents; NOT FOUND means a document no longer states a value in the checked wording.`
  : '\nNo differences.');
process.exit(problems ? 1 : 0);
