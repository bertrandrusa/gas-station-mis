"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");

function makeDemo() {
  const app={innerHTML:"",addEventListener() {}};
  const sandbox={
    document:{
      getElementById(id){return id==="app"?app:null;},
      addEventListener() {},
      querySelector(){return {focus() {}};}
    },
    window:{
      StationDemoCore:require("../core.js"),
      matchMedia(){return {matches:true};}
    },
    console,
    Date,
    Intl
  };
  const context=vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root,"app.js"),"utf8"),context);
  return {app,run(source){vm.runInContext(source,context);return app.innerHTML;}};
}

test("login still renders exact fuel pump and demo sign-in",()=>{
  const {app}=makeDemo();
  assert.match(app.innerHTML,/id="pump-lottie-canvas"/);
  assert.match(app.innerHTML,/id="login-form"/);
  assert.match(app.innerHTML,/data-role="manager"/);
  assert.match(app.innerHTML,/data-role="employee"/);
});

test("mobile navigation gives managers four core tabs and one More menu",()=>{
  const d=makeDemo();
  const html=d.run('state.user=accounts.manager;render();');
  const bar=html.match(/<nav class="mobile-bar"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(bar,"mobile bar exists");
  assert.equal((bar.match(/<button /g)||[]).length,5);
  for(const tab of ["overview","reports","approvals","alerts"])
    assert.match(bar,new RegExp('data-tab="'+tab+'"'));
  assert.match(bar,/data-action="mobile-more"/);
  assert.doesNotMatch(bar,/data-tab="team"/);
  const sheet=d.run('state.mobileMore=true;render();');
  assert.match(sheet,/class="mobile-more-sheet"/);
  assert.match(sheet,/data-tab="team"/);
  assert.match(sheet,/data-tab="settings"/);
  assert.match(sheet,/Switch demo account/);
});

test("employee mobile navigation avoids inaccessible manager controls",()=>{
  const d=makeDemo();
  const html=d.run('state.user=accounts.employee;render();');
  const bar=html.match(/<nav class="mobile-bar"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(bar);
  assert.equal((bar.match(/<button /g)||[]).length,4);
  assert.doesNotMatch(bar,/data-tab="approvals"/);
  assert.doesNotMatch(bar,/data-tab="team"/);
});

test("phone report cards preserve details, status and demo actions",()=>{
  const d=makeDemo();
  const html=d.run('state.user=accounts.employee;state.tab="reports";render();');
  assert.match(html,/class="mobile-report-list"/);
  assert.match(html,/class="mobile-report-card"/);
  assert.match(html,/Cash difference/);
  assert.match(html,/data-action="details"/);
  assert.match(html,/data-action="resubmit"/);
  assert.match(html,/data-action="export-csv"/);
  assert.match(d.run('state.user=accounts.manager;state.tab="overview";render();'),/class="mobile-report-card"/);
});

test("phone styles load after desktop styles without changing original Lottie asset",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  const css=fs.readFileSync(path.join(root,"mobile.css"),"utf8");
  assert.ok(html.indexOf("./mobile.css")>html.indexOf("./polish.css"));
  assert.match(css,/max-width:810px/);
  assert.match(css,/max-width:760px/);
  assert.match(css,/mobile-report-card/);
  assert.match(css,/mobile-more-sheet/);
  assert.match(css,/100dvh/);
  assert.doesNotMatch(css,/transition:\s*all/);
  assert.match(fs.readFileSync(path.join(root,"app.js"),"utf8"),/path:"\.\/fuel-pump-lottie\.json"/);
});
