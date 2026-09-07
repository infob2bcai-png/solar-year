import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '../public');
const sha = b => createHash('sha256').update(b).digest('hex');
const manifest = JSON.parse(await readFile(path.join(root, 'PUBLICATION.json'), 'utf8'));
assert.equal(manifest.productionApproved, false);
assert.equal(manifest.apkSha256, '2152f12806646ee09525958b80995322bbe23e580d9a5933fc2af28f1dddbd7f');
assert.equal(sha(await readFile(path.join(root, 'android/Solar-Year-1.0.0-10018.apk'))), manifest.apkSha256);
const found = [];
async function walk(dir = '') {
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const name = path.posix.join(dir, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Symlink: ${name}`);
    assert.ok(!/(^|\/)(\.git|\.env[^/]*|node_modules|_reports|_donors|AGENTS\.md)$|\.(jks|keystore|p12|pem|key)$/i.test(name), `Forbidden file: ${name}`);
    if (entry.isDirectory()) await walk(name);
    else {
      found.push(name); assert.ok((await stat(path.join(root, name))).size < 25 * 1024 * 1024, `Too large: ${name}`);
      const bytes = await readFile(path.join(root, name));
      if (!['PUBLICATION.json', 'SHA256SUMS.txt'].includes(name)) assert.equal(sha(bytes), manifest.files[name], name);
      if (!/\.(apk|zip)$/i.test(name)) {
        const text = bytes.toString('utf8');
        assert.ok(!/-----BEGIN [A-Z ]*PRIVATE KEY-----|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|[A-Z]:[\\/](?:Users|!solar_calendar|Cloudflare|AI Knowledge)/.test(text), `Sensitive text: ${name}`);
        for (const key of ['CLOUDFLARE_API_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN']) if (process.env[key]?.length > 15) assert.ok(!text.includes(process.env[key]), `Credential match: ${name}`);
      }
    }
  }
}
await walk();
assert.deepEqual(found.filter(n => !['PUBLICATION.json', 'SHA256SUMS.txt'].includes(n)).sort(), Object.keys(manifest.files).sort());
const expectedSums = Object.keys(manifest.files).sort().map(name => `${manifest.files[name]}  ${name}`).join('\n') + '\n';
assert.equal(await readFile(path.join(root, 'SHA256SUMS.txt'), 'utf8'), expectedSums);
console.log(`PASS: ${found.length} public files, hashes, APK, size limits and secret/path scan`);
