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
});
