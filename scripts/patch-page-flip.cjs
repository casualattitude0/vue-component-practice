const fs = require("fs");
const path = require("path");

const COMMIT_THRESHOLD = 45;

const base = path.join(__dirname, "..", "node_modules", "page-flip");

function patchDist(name) {
  const p = path.join(base, "dist", "js", name);
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  // Patch 1: stopMove
  const old1 =
    'stopMove(){if(null===this.calc)return;const t=this.calc.getPosition(),e=this.getBoundsRect(),i="bottom"===this.calc.getCorner()?e.height:0;t.x<=0?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}';
  const neu1 = `stopMove(){if(null===this.calc)return;const t=this.calc.getPosition(),e=this.getBoundsRect(),i="bottom"===this.calc.getCorner()?e.height:0,s=this.calc.getFlippingProgress();s>=${COMMIT_THRESHOLD}?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}`;
  
  if (!s.includes(neu1) && s.includes(old1)) {
    s = s.replace(old1, neu1);
  } else if (!s.includes(neu1)) {
    console.warn("patch-page-flip: expected pattern 1 missing in", name);
  }

  // Patch 2: getFlippingPage (fix BACK direction in portrait)
  const old2 = 'getFlippingPage(t){const e=this.currentSpreadIndex;if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];';
  const neu2 = 'getFlippingPage(t){const e=this.currentSpreadIndex;if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();';
  
  if (!s.includes(neu2) && s.includes(old2)) {
    s = s.replace(old2, neu2);
  }

  // Patch 3: drawBottomPage (fix BACK direction in portrait)
  const old3 = '"portrait"===this.orientation&&1===this.direction||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t))';
  const neu3 = 'this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t)';
  
  if (!s.includes(neu3) && s.includes(old3)) {
    s = s.replace(old3, neu3);
  }

  fs.writeFileSync(p, s);
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

function patchPageCollectionTs() {
  const p = path.join(base, "src", "Collection", "PageCollection.ts");
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  const oldStr = `            return direction === FlipDirection.FORWARD
                ? this.pages[current].newTemporaryCopy()
                : this.pages[current - 1];`;
  const newStr = `            return direction === FlipDirection.FORWARD
                ? this.pages[current].newTemporaryCopy()
                : this.pages[current - 1].newTemporaryCopy();`;
                
  if (!s.includes(newStr) && s.includes(oldStr)) {
    fs.writeFileSync(p, s.replace(oldStr, newStr));
    console.log("patch-page-flip: patched PageCollection.ts");
  }
}

function patchHTMLRenderTs() {
  const p = path.join(base, "src", "Render", "HTMLRender.ts");
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  const searchStr = "if (!(this.orientation === Orientation.PORTRAIT && this.direction === FlipDirection.BACK)) {";
  if (s.includes(searchStr)) {
    // Remove the if condition and the closing brace
    s = s.replace(
      /if \(!\(this\.orientation === Orientation\.PORTRAIT && this\.direction === FlipDirection\.BACK\)\) \{([\s\S]*?this\.bottomPage\.draw\(tempDensity\);)\s*\}/,
      "$1"
    );
    fs.writeFileSync(p, s);
    console.log("patch-page-flip: patched HTMLRender.ts");
  }
}

patchDist("page-flip.module.js");
patchDist("page-flip.browser.js");
patchFlipTs();
patchPageCollectionTs();
patchHTMLRenderTs();
