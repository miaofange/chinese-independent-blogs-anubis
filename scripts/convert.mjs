// Convert timqian/chinese-independent-blogs' blogs-original.csv into:
//   chinese-independent-blogs.anubis  (Anubis list: tags every blog, ranks nothing)
//   chinese-independent-blogs.txt     (uBlacklist ruleset: @1 highlight per blog)
//
// Usage: node scripts/convert.mjs [csvPath] [outDir]
// Defaults: data/blogs-original.csv, out/

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = process.argv[2] ?? join(root, 'data', 'blogs-original.csv');
const outDir = process.argv[3] ?? join(root, 'out');

const REPO = 'https://github.com/miaofange/chinese-independent-blogs-anubis';
const TAG_ID = 'cn-blog';
const TAG_LABEL = '独立博客';
const TAG_COLOUR = '#a33f2e';
const LIST_NAME = '中文独立博客';

// --- Parse the CSV -----------------------------------------------------------
// The CSV is not quoted: names may contain commas, separators are ", " or ",".
// Strategy: split on ',', the first token that starts with http(s) is the blog
// address; everything before it is the name; the rest (RSS, tags) is ignored.

const rows = readFileSync(csvPath, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .slice(1); // drop header

const sites = new Map(); // domain -> { name }
let skipped = 0;
let dupes = 0;
let dropped = 0;

// Upstream occasionally lists a platform page (e.g. the blog's own GitHub repo)
// as the address; hostname extraction would then tag the whole platform and
// leak onto every search result. Addresses listed here get an explicit
// replacement, or `null` to drop the entry when the blog has no site of its
// own. Keys are "host/lowercased-path" without a trailing slash.
const ADDRESS_OVERRIDES = new Map([
  // 算法进阶: articles live in GitHub Issues + 公众号「算法进阶」, no
  // independent site (aialgorithm.github.io is 404), so nothing to tag.
  ['github.com/aialgorithm/blog', null],
]);

const addrKey = (addr) => {
  try {
    const u = new URL(addr);
    return (
      u.hostname.replace(/^www\./, '').toLowerCase() +
      u.pathname.replace(/\/+$/, '').toLowerCase()
    );
  } catch {
    return null;
  }
};

for (const row of rows) {
  const tokens = row.split(',').map((t) => t.trim());
  const addrIdx = tokens.findIndex((t) => /^https?:\/\//.test(t));
  if (addrIdx <= 0) { skipped++; continue; }
  const name = tokens.slice(0, addrIdx).join(', ').replace(/[!,]+$/, '').trim();
  const key = addrKey(tokens[addrIdx]);
  const addr = key !== null && ADDRESS_OVERRIDES.has(key)
    ? ADDRESS_OVERRIDES.get(key)
    : tokens[addrIdx];
  if (!addr) { dropped++; continue; } // overridden platform-only entry
  let host;
  try {
    host = new URL(addr).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    skipped++;
    continue;
  }
  if (!host || !name) { skipped++; continue; }
  if (sites.has(host)) { dupes++; continue; } // same domain listed twice: keep first
  sites.set(host, { name });
}

// Comment after `#` may not contain newlines; keep `$`, `!`, `#` out of it.
const sanitize = (s) => s.replace(/[#\r\n]+/g, ' ').trim() || '中文独立博客';

// --- Anubis list: tag-only rules (subscribers choose what the tag does) ------
const anubis = [
  '! name: ' + LIST_NAME,
  '! description: 给 timqian/chinese-independent-blogs 收录的中文独立博客加标签。数据每日自动同步。',
  `! author: ${LIST_NAME} contributors (MIT)`,
  `! homepage: ${REPO}`,
  '! license: MIT',
  '! expires: 1 day',
  '! avatar: ' + TAG_COLOUR,
  `! tag: ${TAG_ID} | ${TAG_LABEL} | ${TAG_COLOUR} | 中文个人独立博客`,
  '',
];
for (const [site, { name }] of sites) {
  anubis.push(`$site=${site},tag=${TAG_ID} # ${sanitize(name)}`);
}

// --- uBlacklist ruleset: highlight level 1 -----------------------------------
const ubl = ['---', 'title: ' + LIST_NAME, '---', ''];
// *://*.x.com/* 在 uBlacklist 与 Anubis 中都匹配主域及其子域（等价于 site=）。
for (const site of sites.keys()) {
  ubl.push(`@1*://*.${site}/*`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'chinese-independent-blogs.anubis'), anubis.join('\n') + '\n');
writeFileSync(join(outDir, 'chinese-independent-blogs.txt'), ubl.join('\n') + '\n');

console.log(`unique blogs: ${sites.size} (skipped ${skipped} unparseable rows, merged ${dupes} duplicate domains, dropped ${dropped} by address overrides)`);
console.log(`wrote ${join(outDir, 'chinese-independent-blogs.anubis')} (${sites.size} rules)`);
console.log(`wrote ${join(outDir, 'chinese-independent-blogs.txt')} (uBlacklist, ${sites.size} highlight rules)`);
