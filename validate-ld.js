// Sanity: every JSON-LD block on the site must parse. Run: node validate-ld.js
const fs = require("fs");
let bad = 0;
for (const f of fs.readdirSync(".").filter((x) => x.endsWith(".html"))) {
  const html = fs.readFileSync(f, "utf8");
  const blocks = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
  for (const b of blocks) {
    const body = b.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    try {
      const j = JSON.parse(body);
      const kind = j["@type"] || (j["@graph"] || []).map((g) => g["@type"]).join("+");
      console.log(f, "OK:", kind);
    } catch (e) {
      console.error(f, "BROKEN JSON-LD:", e.message);
      bad++;
    }
  }
}
process.exit(bad ? 1 : 0);
