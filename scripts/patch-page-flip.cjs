const fs = require("fs");
const path = require("path");

const COMMIT_THRESHOLD = 45;

const base = path.join(__dirname, "..", "node_modules", "page-flip");

function patchDist(name) {
  const p = path.join(base, "dist", "js", name);
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  const old =
    'stopMove(){if(null===this.calc)return;const t=this.calc.getPosition(),e=this.getBoundsRect(),i="bottom"===this.calc.getCorner()?e.height:0;t.x<=0?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}';
  const neu = `stopMove(){if(null===this.calc)return;const t=this.calc.getPosition(),e=this.getBoundsRect(),i="bottom"===this.calc.getCorner()?e.height:0,s=this.calc.getFlippingProgress();s>=${COMMIT_THRESHOLD}?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}`;
  if (s.includes(neu)) return;
  if (!s.includes(old)) {
    console.warn("patch-page-flip: expected pattern missing in", name);
    return;
  }
  fs.writeFileSync(p, s.replace(old, neu));
  console.log("patch-page-flip: patched", name);
}

function patchFlipTs() {
  const p = path.join(base, "src", "Flip", "Flip.ts");
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  const old = `        if (pos.x <= 0) this.animateFlippingTo(pos, { x: -rect.pageWidth, y }, true);
        else this.animateFlippingTo(pos, { x: rect.pageWidth, y }, false);`;
  const neu = `        const commitThreshold = ${COMMIT_THRESHOLD};
        const shouldFlip = this.calc.getFlippingProgress() >= commitThreshold;

        if (shouldFlip) this.animateFlippingTo(pos, { x: -rect.pageWidth, y }, true);
        else this.animateFlippingTo(pos, { x: rect.pageWidth, y }, false);`;
  if (s.includes("commitThreshold")) return;
  if (!s.includes(old)) {
    console.warn("patch-page-flip: Flip.ts pattern not found");
    return;
  }
  fs.writeFileSync(p, s.replace(old, neu));
  console.log("patch-page-flip: patched Flip.ts");
}

patchDist("page-flip.module.js");
patchDist("page-flip.browser.js");
patchFlipTs();
