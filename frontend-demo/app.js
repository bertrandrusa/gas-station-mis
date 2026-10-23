"use strict";
const accounts = {
  manager: { role:"manager", name:"Aline Uwase", title:"Station Manager", email:"manager@stationflow.demo", password:"Demo123!" },
  employee: { role:"employee", name:"Eric N.", title:"Shift Supervisor", email:"employee@stationflow.demo", password:"Demo123!" }
};
const stations = [
  { id:"central", name:"Kigali Central", location:"Kigali, Rwanda" },
  { id:"remera", name:"Remera Service Point", location:"Remera, Kigali" }
];
const core = window.StationDemoCore;
const state = {
  user:null, loginRole:"manager", error:"", tab:"overview", station:"central", filter:"All",
  modal:null, toast:"", reports:seedReports(), alerts:seedAlerts()
};

function dayAt(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth()+1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function seedReports() {
  return [
    {id:"SR-1038",station:"central",date:dayAt(0),shift:"Morning",owner:"Eric N.",ownerRole:"employee",opening:100000,cash:289000,momo:112000,card:82000,expenses:24000,withdrawn:245000,counted:119500,status:"Pending",notes:"Morning shift reconciled; receipts ready for review."},
    {id:"SR-1037",station:"central",date:dayAt(0),shift:"Evening",owner:"Claudine M.",ownerRole:"other",opening:95000,cash:326000,momo:148000,card:97000,expenses:17000,withdrawn:302000,counted:102000,status:"Approved",notes:"Evening shift balanced."},
    {id:"SR-1036",station:"central",date:dayAt(1),shift:"Morning",owner:"Eric N.",ownerRole:"employee",opening:86000,cash:198000,momo:89000,card:69000,expenses:11000,withdrawn:193000,counted:80000,status:"Returned",returnReason:"Please check the counted cash.",notes:"Cash receipts pending verification."},
    {id:"SR-1035",station:"central",date:dayAt(1),shift:"Evening",owner:"Claudine M.",ownerRole:"other",opening:95000,cash:244000,momo:128000,card:88000,expenses:9000,withdrawn:220000,counted:110000,status:"Approved",notes:"All payments reconciled."},
    {id:"SR-1034",station:"remera",date:dayAt(0),shift:"Morning",owner:"Kevin R.",ownerRole:"other",opening:75000,cash:201000,momo:82000,card:60000,expenses:15000,withdrawn:177000,counted:84000,status:"Pending",notes:"Awaiting management approval."},
    {id:"SR-1033",station:"remera",date:dayAt(1),shift:"Evening",owner:"Diane K.",ownerRole:"other",opening:92000,cash:235000,momo:109000,card:95000,expenses:13000,withdrawn:199000,counted:115000,status:"Approved",notes:"Shift closed."}
  ];
}

function seedAlerts() {
  return [
    {id:"AL-04",station:"central",title:"Approval required",message:"Morning shift SR-1038 is awaiting manager review.",type:"Approval",status:"Open",age:"12 minutes ago"},
    {id:"AL-03",station:"central",title:"Cash variance detected",message:"Previous shift cash difference exceeded the demo threshold.",type:"Variance",status:"Open",age:"42 minutes ago"},
    {id:"AL-02",station:"remera",title:"Shift report overdue",message:"A scheduled report has not been submitted.",type:"Missing report",status:"Open",age:"1 hour ago"},
    {id:"AL-01",station:"central",title:"Daily close confirmed",message:"All closing checklist items were reviewed.",type:"Operations",status:"Resolved",age:"Yesterday"}
  ];
}

function esc(input) {
  return String(input==null?"":input).replace(/[&<>"']/g, x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
}

function rwf(n) {return "RWF " + Math.round(n).toLocaleString("en-US");}

function dateText(date) {return new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}

function entries() {return state.reports.filter(r=>r.station===state.station && (state.user.role==="manager" || r.ownerRole==="employee"));}

function activeAlerts() {return state.alerts.filter(a=>a.station===state.station);}

function statusTag(status) {return `<span class="status ${esc(status.toLowerCase())}">${esc(status)}</span>`;}

function stationName(id) {return (stations.find(s=>s.id===id)||stations[0]).name;}

function navItems() {
  const base=[["overview","◫","Overview"],["reports","▤","Shift reports"],["alerts","♧","Alerts"]];
  if(state.user.role==="manager"){base.splice(2,0,["approvals","✓","Approvals"]);base.push(["team","♙","Team"]);}
  base.push(["settings","⚙","About demo"]);
  return base;
}

function loginView() {
  const acct=accounts[state.loginRole];
  return `<div class="login-shell">
    <section class="login-hero" aria-label="About StationFlow">
      <div class="brand"><span class="brand-mark">⛽</span> stationflow<span class="brand-dot">.</span></div>
      <div class="login-message"><div class="eyebrow">Gas Station Management System</div>
        <h1>One station.<br><em>Every detail.</em></h1>
        <p>A clearer way to track daily operations, manage your team, review shift reports, and stay ahead of what matters.</p>
        <div class="hero-cards"><div class="hero-card"><b>02</b><span>Sample stations</span></div><div class="hero-card"><b>24/7</b><span>Shift visibility</span></div><div class="hero-card"><b>100%</b><span>Fictional data</span></div></div>
      </div>
      <div class="hero-footer"><span class="pulse"></span> Interactive public product preview · No real business data</div>
    </section>
    <section class="login-form-side"><div class="auth-card">
      <div class="pill">✦ PUBLIC DEMO</div><h2>Welcome back</h2>
      <p class="subcopy">Choose a demo role and sign in to explore a sample station workspace.</p>
      <div class="role-switch" aria-label="Select demo role">
        <button type="button" data-action="role" data-role="manager" class="${state.loginRole==="manager"?"active":""}" aria-pressed="${state.loginRole==="manager"}">♙ &nbsp;Manager</button>
        <button type="button" data-action="role" data-role="employee" class="${state.loginRole==="employee"?"active":""}" aria-pressed="${state.loginRole==="employee"}">◈ &nbsp;Employee</button>
      </div>
      <form id="login-form">
        <label class="field"><span>Demo email</span><input type="email" name="email" autocomplete="off" required value="${esc(acct.email)}"></label>
        <label class="field"><span>Demo password</span><input type="password" name="password" autocomplete="off" required placeholder="Enter demo password"></label>
        ${state.error?`<div class="error-line" role="alert">${esc(state.error)}</div>`:""}
        <button class="btn wide" type="submit">Sign in to dashboard <span aria-hidden="true">→</span></button>
      </form>
      <div class="auth-hint"><b>Try the ${state.loginRole==="manager"?"manager":"employee"} demo</b><br>Email: <code>${esc(acct.email)}</code><br>Password: <code>Demo123!</code></div>
      <p class="auth-notice"><b>Demo login only.</b> These public sample credentials do not protect private information. Never enter a real password here.</p>
    </div></section>
  </div>`;
}

function sidebarView() {
  const nav=navItems().map(([key,icon,title])=>`<button class="nav-item ${state.tab===key?"active":""}" data-action="navigate" data-tab="${key}" ${state.tab===key?'aria-current="page"':""}><span class="nav-icon">${icon}</span>${title}${key==="approvals"&&entries().filter(r=>r.status==="Pending").length?`<span class="nav-count">${entries().filter(r=>r.status==="Pending").length}</span>`:""}</button>`).join("");
  return `<aside class="sidebar"><div class="brand"><span class="brand-mark">⛽</span>stationflow<span class="brand-dot">.</span></div>
     <nav aria-label="Main menu"><div class="nav-label">Workspace</div>${nav}</nav>
     <div class="sidebar-bottom"><div class="sidebar-note"><strong>✦ Demonstration mode</strong>This workspace uses sample data only. Your actual ERPNext database is not connected.</div>
     <div class="side-profile"><span class="avatar">${esc(state.user.name.split(" ").map(x=>x[0]).join(""))}</span><div><b>${esc(state.user.name)}</b><small>${esc(state.user.title)}</small></div><button class="logout" type="button" title="Switch user" aria-label="Sign out" data-action="logout">↪</button></div></div>
     </aside>`;
}

function sectionTitle(title,description,buttons) {
  return `<div class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div><div class="page-actions">${buttons||""}</div></div>`;
}

function stat(label,value,foot,icon) {
  return `<div class="card kpi"><div class="kpi-label">${esc(label)}<span class="kpi-icon">${icon}</span></div><div class="kpi-value">${esc(value)}</div><div class="kpi-foot">${foot}</div></div>`;
}

function overviewView() {
  const rs=entries(),approved=rs.filter(x=>x.status==="Approved"),pending=rs.filter(x=>x.status==="Pending"),alerts=activeAlerts().filter(x=>x.status==="Open"),sum=approved.reduce((a,x)=>a+core.calculate(x).sales,0);
  const card1=stat(state.user.role==="manager"?"Approved sales":"My approved sales",rwf(sum),"<strong>↑ Demo data</strong> · Approved reports only","↗");
  const card2=stat("Reports submitted",String(rs.length), "Across sample shifts","▤");
  const card3=stat("Pending approvals",String(pending.length),state.user.role==="manager"?"Need your review":"Awaiting management","✓");
  const card4=stat("Open alerts",String(alerts.length),"Sample operational notices","⚑");
  const chartValues=[36,52,44,68,59,77,83];
  const bars=chartValues.map((v,i)=>`<div class="bar-col"><div class="bar ${i===6?"current":""}" style="height:${v}%"><span class="bar-label">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div></div>`).join("");
  const alertRows=activeAlerts().slice(0,3).map(a=>`<div class="list-row"><span class="list-icon">${a.status==="Open"?"⚑":"✓"}</span><div class="list-main"><b>${esc(a.title)}</b><small>${esc(a.age)}</small></div>${statusTag(a.status)}</div>`).join("");
  const reports=rs.slice(0,5).map(r=>`<tr><td><b>${esc(r.id)}</b></td><td>${esc(r.shift)}</td><td>${esc(r.owner)}</td><td>${dateText(r.date)}</td><td>${rwf(core.calculate(r).sales)}</td><td>${statusTag(r.status)}</td><td><button class="mini-link" data-action="details" data-id="${esc(r.id)}">View ↗</button></td></tr>`).join("");
  return `${sectionTitle("Good "+(new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening")+", "+state.user.name.split(" ")[0]+".","Here's what's happening at "+stationName(state.station)+" today.",state.user.role==="employee"?'<button class="btn" data-action="new-report">+ New shift report</button>':'<button class="btn secondary" data-action="navigate" data-tab="approvals">Review approvals →</button>')}
   <div class="kpi-grid">${card1}${card2}${card3}${card4}</div>
   <div class="two-up"><section class="card"><div class="card-header"><div><h2>Weekly sales snapshot</h2><p>Illustrative activity chart · not connected to POS</p></div><span class="pill" style="margin:0">SAMPLE DATA</span></div><div class="card-body"><div class="chart" role="img" aria-label="Fictional weekly activity chart with bars for Monday through Sunday">${bars}</div><div class="chart-key"><i></i> Current period &nbsp; · &nbsp; Illustrative trends only</div></div></section>
   <section class="card"><div class="card-header"><div><h2>Operations & alerts</h2><p>Latest station notifications</p></div><button class="mini-link" data-action="navigate" data-tab="alerts">View all →</button></div><div class="card-body">${alertRows||'<div class="empty">No alerts here</div>'}</div></section></div>
   <section class="card table-card"><div class="card-header" style="padding-bottom:18px"><div><h2>Recent shift reports</h2><p>Latest submissions and approvals</p></div><button class="mini-link" data-action="navigate" data-tab="reports">View all →</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Report</th><th>Shift</th><th>Submitted by</th><th>Date</th><th>Total sales</th><th>Status</th><th></th></tr></thead><tbody>${reports||'<tr><td colspan="7">No reports</td></tr>'}</tbody></table></div></section>`;
}

function reportsView() {
  const rs=entries().filter(r=>state.filter==="All"||r.status===state.filter);
  const filters=["All","Pending","Approved","Returned"].map(f=>`<button class="filter-btn ${state.filter===f?"active":""}" data-action="filter" data-filter="${f}" aria-pressed="${state.filter===f}">${f}</button>`).join("");
  const rows=rs.map(r=>`<tr><td><b>${esc(r.id)}</b></td><td>${dateText(r.date)}</td><td>${esc(r.shift)}</td><td>${esc(r.owner)}</td><td>${rwf(core.calculate(r).sales)}</td><td>${rwf(core.calculate(r).difference)}</td><td>${statusTag(r.status)}</td><td><button class="mini-link" data-action="details" data-id="${esc(r.id)}">Details →</button></td></tr>`).join("");
  return `${sectionTitle("Shift reports","Review daily close reports and their current approval state.",state.user.role==="employee"?'<button class="btn" data-action="new-report">+ Create report</button>':"")}
  <section class="card table-card"><div class="filters">${filters}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Report</th><th>Date</th><th>Shift</th><th>Staff</th><th>Sales</th><th>Cash difference</th><th>Status</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="8"><div class="empty">No reports match this filter.</div></td></tr>'}</tbody></table></div></section>`;
}

function approvalsView() {
  if(state.user.role!=="manager")return `<div class="card info-card">This sample screen is available to the demo manager only.</div>`;
  const pending=entries().filter(r=>r.status==="Pending");
  const items=pending.map(r=>`<article class="card review-card"><div class="review-head"><span class="pill" style="margin:0">AWAITING REVIEW</span><small class="muted">${esc(r.id)}</small></div><h3>${esc(r.shift)} · ${esc(stationName(r.station))}</h3><p>${esc(r.owner)} · ${dateText(r.date)}</p><div class="review-amount">${rwf(core.calculate(r).sales)}</div><p>Expected cash: ${rwf(core.calculate(r).expected)}<br>Difference: ${rwf(core.calculate(r).difference)}</p><div class="review-actions"><button class="btn secondary" data-action="ask-return" data-id="${esc(r.id)}">Return</button><button class="btn" data-action="approve" data-id="${esc(r.id)}">✓ Approve</button></div></article>`).join("");
  return `${sectionTitle("Pending approvals","Confirm reported figures, or return a submission for correction.")}${pending.length?`<div class="review-grid">${items}</div>`:`<section class="card empty"><div class="empty-emoji">✓</div>You're all caught up. No reports are waiting for approval.</section>`}`;
}

function alertsView() {
  const cards=activeAlerts().map(a=>`<article class="card alert-card"><span class="list-icon">${a.type==="Variance"?"⚠":a.type==="Approval"?"▤":"♧"}</span><div class="list-main"><b>${esc(a.title)}</b><small>${esc(a.message)} · ${esc(a.age)}</small></div>${statusTag(a.status)}${state.user.role==="manager"&&a.status==="Open"?`<button class="btn small secondary" data-action="resolve" data-id="${esc(a.id)}">Mark resolved</button>`:""}</article>`).join("");
  return `${sectionTitle("Alerts & notifications","Stay on top of missing reports, approvals, and cash discrepancies.")}<div class="alert-feed">${cards||'<div class="card empty">No notifications for this station.</div>'}</div>`;
}

function teamView() {
  if(state.user.role!=="manager")return `<section class="card info-card">Manager view only.</section>`;
  const team=state.station==="central"?[["AU","Aline Uwase","Station Manager"],["EN","Eric N.","Shift Supervisor"],["CM","Claudine M.","Cashier"],["JP","Jean P.","Forecourt Attendant"]]:[["AU","Aline Uwase","Station Manager"],["KR","Kevin R.","Shift Supervisor"],["DK","Diane K.","Cashier"]];
  return `${sectionTitle("Station team","Illustrative staff assignments for "+stationName(state.station)+".")}<div class="team-grid">${team.map(([init,name,title])=>`<article class="card team-member"><span class="avatar">${init}</span><div><h3>${esc(name)}</h3><p>${esc(title)}</p></div></article>`).join("")}</div><p class="footer-note">Employee management and real identities are handled by Frappe HR in the production MIS.</p>`;
}

function aboutView() {
  return `${sectionTitle("About this demo","How StationFlow relates to the full Gas Station MIS.")}<div class="two-up"><section class="card info-card"><h2>What you can test</h2><p>Use the sample login to switch between manager and employee views. Employees can file a fictional shift report. Managers can approve or return sample reports and resolve alerts. Changes remain in browser memory until the page is refreshed.</p><p>Everything here is fictional and intended for product demonstrations.</p></section><section class="card info-card"><h2>What's not connected?</h2><div class="kv"><span>Live ERPNext database</span><b>Not connected</b></div><div class="kv"><span>Actual user authentication</span><b>Not enabled</b></div><div class="kv"><span>Real sales / employee data</span><b>Never used</b></div><div class="kv"><span>Demo data persistence</span><b>Until refresh</b></div></section></div><section class="card info-card"><h2>Want the full system?</h2>The actual backend lives in the Frappe application in the <a href="https://github.com/bertrandrusa/gas-station-mis" rel="noopener noreferrer">Gas Station MIS GitHub repository</a>. A live production system needs protected server-side accounts and managed hosting.</section>`;
}

function modalView() {
  if(!state.modal)return "";
  if(state.modal.type==="new")return `<div class="modal-overlay" data-action="close-overlay"><div class="modal-panel" role="dialog" aria-modal="true" aria-label="Create shift report"><button class="modal-close" data-action="close-modal" aria-label="Close">×</button><h2>New shift report</h2><p>Create a fictional end-of-shift report. All RWF figures are sample data.</p><form id="report-form"><div class="modal-grid"><label class="field"><span>Shift</span><select name="shift"><option>Morning</option><option>Evening</option><option>Night</option></select></label><label class="field"><span>Opening cash (RWF)</span><input type="number" min="0" step="1" name="opening" value="90000" required></label><label class="field"><span>Cash sales (RWF)</span><input type="number" min="0" step="1" name="cash" value="195000" required></label><label class="field"><span>Mobile money sales (RWF)</span><input type="number" min="0" step="1" name="momo" value="87000" required></label><label class="field"><span>Card sales (RWF)</span><input type="number" min="0" step="1" name="card" value="43000" required></label><label class="field"><span>Cash expenses (RWF)</span><input type="number" min="0" step="1" name="expenses" value="12000" required></label><label class="field"><span>Cash removed (RWF)</span><input type="number" min="0" step="1" name="withdrawn" value="165000" required></label><label class="field"><span>Counted closing cash (RWF)</span><input type="number" min="0" step="1" name="counted" value="108000" required></label></div><label class="field"><span>Shift notes</span><textarea name="notes" maxlength="300" placeholder="Brief sample closing notes"></textarea></label><div class="modal-controls"><button class="btn secondary" type="button" data-action="close-modal">Cancel</button><button class="btn" type="submit">Submit for approval →</button></div></form></div></div>`;
  const r=state.reports.find(x=>x.id===state.modal.id);
  if(!r)return "";
  if(state.modal.type==="return")return `<div class="modal-overlay" data-action="close-overlay"><div class="modal-panel" role="dialog" aria-modal="true" aria-label="Return shift report"><button class="modal-close" data-action="close-modal" aria-label="Close">×</button><h2>Return ${esc(r.id)}</h2><p>Tell the employee what to correct in this fictional report.</p><form id="return-form"><label class="field"><span>Reason for return</span><textarea name="reason" required maxlength="220" placeholder="e.g. Please confirm the closing cash amount."></textarea></label><div class="modal-controls"><button class="btn secondary" type="button" data-action="close-modal">Cancel</button><button class="btn danger" type="submit">Return report</button></div></form></div></div>`;
  const v=core.calculate(r);
  return `<div class="modal-overlay" data-action="close-overlay"><div class="modal-panel" role="dialog" aria-modal="true" aria-label="Report details"><button class="modal-close" data-action="close-modal" aria-label="Close">×</button><h2>Shift report ${esc(r.id)}</h2><p>${dateText(r.date)} · ${esc(r.shift)} shift · ${esc(r.owner)}</p><div class="kv"><span>Station</span><b>${esc(stationName(r.station))}</b></div><div class="kv"><span>Status</span>${statusTag(r.status)}</div><div class="kv"><span>Reported total sales</span><b>${rwf(v.sales)}</b></div><div class="kv"><span>Expected closing cash</span><b>${rwf(v.expected)}</b></div><div class="kv"><span>Counted cash</span><b>${rwf(r.counted)}</b></div><div class="kv"><span>Cash difference</span><b>${rwf(v.difference)}</b></div><div class="kv"><span>Notes</span><b>${esc(r.notes||"—")}</b></div>${r.returnReason?`<div class="kv"><span>Return reason</span><b>${esc(r.returnReason)}</b></div>`:""}<div class="modal-controls"><button class="btn secondary" data-action="close-modal">Close</button>${state.user.role==="manager"&&r.status==="Pending"?`<button class="btn" data-action="approve" data-id="${esc(r.id)}">Approve</button>`:""}</div></div></div>`;
}

function render() {
  const app=document.getElementById("app");
  if(!state.user){app.innerHTML=loginView();return;}
  const tabs={overview:overviewView,reports:reportsView,approvals:approvalsView,alerts:alertsView,team:teamView,settings:aboutView};
  const view=(tabs[state.tab]||overviewView)();
  const menu=navItems().map(([id,symbol,label])=>`<button type="button" class="${state.tab===id?"active":""}" data-action="navigate" data-tab="${id}" ${state.tab===id?'aria-current="page"':""}><span>${symbol}</span>${esc(label)}</button>`).join("");
  const select=state.user.role==="manager"?`<select class="select station" id="station-select" aria-label="Select station">${stations.map(s=>`<option value="${esc(s.id)}" ${s.id===state.station?"selected":""}>${esc(s.name)}</option>`).join("")}</select>`:`<span class="select station" style="display:inline-block">${esc(stationName(state.station))}</span>`;
  app.innerHTML=`<div class="app-shell">${sidebarView()}<div class="main-area"><header class="topbar"><div class="top-title"><span class="top-trail">Workspace /</span> Station operations</div><div class="top-actions"><span class="today-stamp">${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>${select}</div></header><main class="content"><div class="demo-banner"><b>✦ DEMO MODE &nbsp;</b> Fictional station data · Simulated sign-in · No real ERPNext connection</div>${view}<div class="footer-note">StationFlow product preview · Nothing on this page is a live transaction or production record.</div></main><nav class="mobile-bar" aria-label="Mobile menu">${menu}</nav></div></div>${modalView()}${state.toast?`<div class="toast" role="status">✓ ${esc(state.toast)} <button class="btn small ghost" data-action="dismiss">×</button></div>`:""}`;
}

function notify(message) {state.toast=message;render();}

function actions(event) {
  const button=event.target.closest("[data-action]");
  if(!button)return;
  const action=button.dataset.action;
  if(action==="close-overlay" && event.target!==button)return;
  if(action==="role"){state.loginRole=button.dataset.role;state.error="";render();return;}
  if(action==="logout"){state.user=null;state.loginRole="manager";state.tab="overview";state.error="";state.modal=null;state.toast="";render();return;}
  if(!state.user)return;
  if(action==="navigate"){const tab=button.dataset.tab;if(navItems().some(x=>x[0]===tab)){state.tab=tab;state.filter="All";state.modal=null;state.toast="";render();}return;}
  if(action==="filter"){state.filter=button.dataset.filter;render();return;}
  if(action==="dismiss"){state.toast="";render();return;}
  if(action==="close-modal"||action==="close-overlay"){state.modal=null;render();return;}
  if(action==="new-report"&&state.user.role==="employee"){state.modal={type:"new"};render();return;}
  if(action==="details"){const report=state.reports.find(r=>r.id===button.dataset.id);if(report && entries().includes(report)){state.modal={type:"details",id:report.id};render();}return;}
  if(action==="approve"){const report=state.reports.find(r=>r.id===button.dataset.id);if(!report||report.station!==state.station||state.user.role!=="manager")return;try{Object.assign(report,core.transition(report,state.user.role,"approve"));state.alerts.forEach(a=>{if(a.reportId===report.id&&a.type==="Approval")a.status="Resolved";});state.modal=null;notify(report.id+" approved (demo only).");}catch(err){notify(err.message);}return;}
  if(action==="ask-return"){const report=state.reports.find(r=>r.id===button.dataset.id);if(report&&report.station===state.station&&core.canTransition(state.user.role,report.status,"return")){state.modal={type:"return",id:report.id};render();}return;}
  if(action==="resolve"){const alert=state.alerts.find(a=>a.id===button.dataset.id);if(alert && alert.station===state.station && state.user.role==="manager"){alert.status="Resolved";notify("Sample alert resolved.");}return;}
}

function forms(event) {
  if(!["login-form","report-form","return-form"].includes(event.target.id))return;
  event.preventDefault();
  const fd=new FormData(event.target);
  if(event.target.id==="login-form"){
    const account=accounts[state.loginRole];
    if(String(fd.get("email")).trim().toLowerCase()===account.email && String(fd.get("password"))===account.password){
      state.user=account;state.station="central";state.tab="overview";state.filter="All";state.error="";state.toast="";render();
    } else {state.error="Use the fictional demo credentials shown below.";render();}
    return;
  }
  if(!state.user)return;
  if(event.target.id==="report-form"){
    if(state.user.role!=="employee"||state.modal?.type!=="new")return;
    try{
      const keys=["opening","cash","momo","card","expenses","withdrawn","counted"];
      const numbers=Object.fromEntries(keys.map(k=>[k,core.amount(fd.get(k))]));
      core.calculate(numbers);
      const id="SR-"+String(1039+state.reports.length-6);
      state.reports.unshift({id,station:state.station,date:dayAt(0),shift:String(fd.get("shift")),owner:state.user.name,ownerRole:"employee",...numbers,status:"Pending",notes:String(fd.get("notes")||"").slice(0,300)});
      state.alerts.unshift({id:"AL-"+Date.now(),reportId:id,station:state.station,title:"Approval required",message:"New shift report "+id+" is awaiting approval.",type:"Approval",status:"Open",age:"Just now"});
      state.modal=null;state.tab="reports";state.filter="All";notify(id+" submitted for demo manager review.");
    }catch(err){notify(err.message);}
    return;
  }
  if(event.target.id==="return-form"){
    const report=state.reports.find(r=>r.id===state.modal?.id);
    if(!report||report.station!==state.station||state.user.role!=="manager")return;
    try{Object.assign(report,core.transition(report,"manager","return",fd.get("reason")));state.modal=null;notify(report.id+" returned with a sample correction note.");}catch(err){notify(err.message);}
  }
}

function start() {
  const app=document.getElementById("app");
  app.addEventListener("click",actions);
  app.addEventListener("submit",forms);
  app.addEventListener("change",event=>{
    if(event.target.id==="station-select" && state.user?.role==="manager" && stations.some(s=>s.id===event.target.value)){
      state.station=event.target.value;state.modal=null;state.filter="All";render();
    }
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&state.modal){state.modal=null;render();}});
  render();
}

start();
