"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(root,"fuel-pump-original.json"),"utf8"));
const playback = JSON.parse(fs.readFileSync(path.join(root,"fuel-pump-lottie.json"),"utf8"));
function removeExpressions(obj) {
  if(Array.isArray(obj)){obj.forEach(removeExpressions);return;}
  if(obj && typeof obj==="object") {
    for(const k of Object.keys(obj)) {
      if(k==="x" && typeof obj[k]==="string")delete obj[k];
      else removeExpressions(obj[k]);
    }
  }
}
test("uploaded fuel-pump asset is preserved and animates for six seconds",()=>{
  assert.equal(source.nm,"Gas_station_Final_Comp");
  assert.equal(source.fr,25);
  assert.equal(source.op-source.ip,150);
  assert.equal(source.w,1920);
  assert.equal(source.h,1080);
  assert.ok(source.assets.some(a=>a.layers?.length>0));
});
test("playback preserves shapes and timelines except removed AE expression scripts",()=>{
  const expected=structuredClone(source);
  removeExpressions(expected);
  assert.deepEqual(playback,expected);
});
test("login uses the full Lottie player for the uploaded masked artwork",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const js=fs.readFileSync(path.join(root,"app.js"),"utf8");
  assert.match(html,/src="\.\/vendor\/lottie\.min\.js"/);
  assert.match(js,/path:"\.\/fuel-pump-lottie\.json"/);
  assert.match(js,/prefers-reduced-motion/);
  assert.match(js,/loop:true,autoplay:false/);
  assert.match(js,/instance\.play\(\)/);
  assert.doesNotMatch(js,/pump-meter|18%|86%/);
  const css=fs.readFileSync(path.join(root,"login-portal.css"),"utf8");
  assert.doesNotMatch(css,/pump-meter|pump-percent|pump-content|pump-instruction/);
  assert.doesNotMatch(js,/pump-meter|pump-percent|pump-content|pump-instruction|18%|86%/);
  assert.match(css,/width:min\(100%,390px\)/);
  assert.match(css,/animation: none !important/);
  assert.doesNotMatch(js,/data-action="pump-demo"|pointerover|animateUploadedPump|pumpPlaying/);
  assert.match(js,/class="fuel-demo" role="img"/);
  assert.match(js,/id="pump-lottie-canvas"/);
  assert.match(css,/pointer-events:none/);
});

test("hero typography matches the enterprise workspace font without changing pump animation",()=>{
  const css=fs.readFileSync(path.join(root,"login-portal.css"),"utf8");
  const workspace=fs.readFileSync(path.join(root,"workspace.css"),"utf8");
  assert.match(workspace,/font-family:"PT Root UI",-apple-system/);
  assert.match(css,/font-family:"PTRootUI",-apple-system/);
  assert.match(css,/@font-face/);
  assert.match(css,/pt-root-ui-vf\.woff2/);
  const font=fs.readFileSync(path.join(root,"fonts/pt-root-ui-vf.woff2"));
  assert.equal(font.subarray(0,4).toString("ascii"),"wOF2");
  assert.ok(font.length>50000);
  assert.match(fs.readFileSync(path.join(root,"fonts/OFL.txt"),"utf8"),/SIL OPEN FONT LICENSE/);
  assert.match(css,/\.station-portal \.login-message \.eyebrow[\s\S]*?text-transform:none/);
  assert.match(css,/\.station-portal \.login-message h1[\s\S]*?font-weight:650/);
  assert.match(css,/\.station-portal \.login-message p[\s\S]*?font-size:14px/);
  assert.match(css,/\.station-portal \.fuel-demo/);
});
