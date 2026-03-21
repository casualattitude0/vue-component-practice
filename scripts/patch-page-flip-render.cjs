const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..", "node_modules", "page-flip");

function patchDist(name) {
  const p = path.join(base, "dist", "js", name);
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  const oldStr = '"portrait"===this.orientation&&1===this.direction||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t))';
  const newStr = 'this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t)';
  
  if (s.includes(oldStr)) {
    fs.writeFileSync(p, s.replace(oldStr, newStr));
    console.log("Patched", name);
  } else {
    console.log("Pattern not found in", name);
  }
}

function patchFlipTs() {
  const p = path.join(base, "src", "Render", "HTMLRender.ts");
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, "utf8");
  
  const oldStr = `        if (!(this.orientation === Orientation.PORTRAIT && this.direction === FlipDirection.BACK)) {
            (this.bottomPage as HTMLPage).getElement().style.zIndex = (
                this.getSettings().startZIndex + 3
            ).toString(10);
            this.bottomPage.draw(tempDensity);
        }`;
  const newStr = `        (this.bottomPage as HTMLPage).getElement().style.zIndex = (
            this.getSettings().startZIndex + 3
        ).toString(10);
        this.bottomPage.draw(tempDensity);`;
                
  if (s.includes(oldStr)) {
    fs.writeFileSync(p, s.replace(oldStr, newStr));
    console.log("Patched HTMLRender.ts");
  } else {
    console.log("Pattern not found in HTMLRender.ts");
  }
}

patchDist("page-flip.module.js");
patchDist("page-flip.browser.js");
patchFlipTs();
