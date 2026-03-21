const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..", "node_modules", "page-flip");

function patchFlipTs() {
  const p = path.join(base, "src", "Collection", "PageCollection.ts");
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  const oldStr = `            return direction === FlipDirection.FORWARD
                ? this.pages[current].newTemporaryCopy()
                : this.pages[current - 1];`;
  const newStr = `            return direction === FlipDirection.FORWARD
                ? this.pages[current].newTemporaryCopy()
                : this.pages[current - 1].newTemporaryCopy();`;
                
  if (s.includes(newStr)) {
    console.log("Already patched PageCollection.ts");
    return;
  }
  
  if (s.includes(oldStr)) {
    fs.writeFileSync(p, s.replace(oldStr, newStr));
    console.log("Patched PageCollection.ts");
  } else {
    console.log("Pattern not found in PageCollection.ts");
  }
}

patchFlipTs();
