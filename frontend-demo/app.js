"use strict";
const accounts = {
  manager: { role:"manager", name:"Rúben Dias", title:"Station Manager", email:"manager@stationflow.demo", password:"Demo123!" },
  employee: { role:"employee", name:"Erling Haaland", title:"Shift Supervisor", email:"employee@stationflow.demo", password:"Demo123!" }
};
const stations = [
  { id:"central", name:"Kigali Central", location:"Kigali, Rwanda" },
  { id:"remera", name:"Remera Service Point", location:"Remera, Kigali" }
];
const core = window.StationDemoCore;
const state = {
  user:null, loginRole:"manager", error:"", tab:"overview", station:"central", filter:"All", query:"", mobileMore:false,
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
    {id:"SR-1038",station:"central",date:dayAt(0),shift:"Morning",owner:"Erling Haaland",ownerRole:"employee",opening:100000,cash:289000,momo:112000,card:82000,expenses:24000,withdrawn:245000,counted:119500,status:"Pending",notes:"Morning shift reconciled; receipts ready for review."},
    {id:"SR-1037",station:"central",date:dayAt(0),shift:"Evening",owner:"Phil Foden",ownerRole:"other",opening:95000,cash:326000,momo:148000,card:97000,expenses:17000,withdrawn:302000,counted:102000,status:"Approved",notes:"Evening shift balanced."},
    {id:"SR-1036",station:"central",date:dayAt(1),shift:"Morning",owner:"Erling Haaland",ownerRole:"employee",opening:86000,cash:198000,momo:89000,card:69000,expenses:11000,withdrawn:193000,counted:80000,status:"Returned",returnReason:"Please check the counted cash.",notes:"Cash receipts pending verification."},
    {id:"SR-1035",station:"central",date:dayAt(1),shift:"Evening",owner:"Phil Foden",ownerRole:"other",opening:95000,cash:244000,momo:128000,card:88000,expenses:9000,withdrawn:220000,counted:110000,status:"Approved",notes:"All payments reconciled."},
    {id:"SR-1034",station:"remera",date:dayAt(0),shift:"Morning",owner:"Joško Gvardiol",ownerRole:"other",opening:75000,cash:201000,momo:82000,card:60000,expenses:15000,withdrawn:177000,counted:84000,status:"Pending",notes:"Awaiting management approval."},
    {id:"SR-1033",station:"remera",date:dayAt(1),shift:"Evening",owner:"Rayan Cherki",ownerRole:"other",opening:92000,cash:235000,momo:109000,card:95000,expenses:13000,withdrawn:199000,counted:115000,status:"Approved",notes:"Shift closed."}
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

const UI_ICONS={"grid":"<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>","file":"<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/>","check":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8 12 3 3 5-6\"/>","users":"<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6M17 14c2 0 4 2 4 4v2\"/>","bell":"<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4\"/>","gear":"<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M20 10h-2l-1-2 1-2-2-2-2 1-2-1V2h-3v2l-2 1-2-1-2-2-2 2 1 2-1 2H1v3h2l1 2-1 2 2 2 2-1 2 1v2h3v-2l2-1 2 1 2-2-1-2 1-2h2z\"/>","logout":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9\"/>","fuel":"<path d=\"M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h14M7 7h6v5H7zM16 9h2l3 4v5a2 2 0 0 1-4 0v-4\"/>","trend":"<path d=\"M3 17 10 10l4 4 7-7M15 7h6v6\"/>","plus":"<path d=\"M12 5v14M5 12h14\"/>","download":"<path d=\"M12 3v13m-5-5 5 5 5-5M5 19h14\"/>","search":"<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-4-4\"/>","clock":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l4 2\"/>","alert":"<path d=\"M12 3 2 21h20L12 3ZM12 9v5M12 18h.01\"/>","down":"<path d=\"m6 9 6 6 6-6\"/>","shield":"<path d=\"M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6zM9 12l2 2 4-4\"/>"};
function icon(name){return '<svg class="ui-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(UI_ICONS[name]||UI_ICONS.grid)+'</svg>';}
function navItems() {
  const base=[["overview","grid","Dashboard"],["reports","file","Daily reports"]];
  if(state.user.role==="manager"){base.push(["approvals","check","Approvals"],["team","users","Employees"]);}
  base.push(["alerts","bell","Alerts & notifications"],["settings","gear","System information"]);
  return base;
}

function loginView() {
  const acct=accounts[state.loginRole];
  return `<div class="login-shell station-portal">
    <section class="login-hero" aria-label="StationDesk gas station operations">
      <div class="brand"><span class="brand-mark">${icon("grid")}</span><span>Station<span class="brand-dot">Desk</span><small class="brand-subtitle">GAS STATION MIS</small></span></div>
      <div class="login-message"><div class="eyebrow">Connected station operations</div>
        <h1>Built for the way<br><em>stations work.</em></h1>
        <p>Manage people, shift reporting, and station oversight from one dependable platform.</p>
        <div class="fuel-demo" role="img" aria-label="Animated fuel pump illustration">
          <span class="pump-illustration" aria-hidden="true">
            <span id="pump-lottie-canvas" class="lottie-canvas"></span>
            <span class="pump-fallback" hidden>⛽</span>
          </span>
        </div>
      </div>
      <div class="hero-footer"><span class="pulse"></span> Authorized preview · Fictional data only</div>
    </section>
    <section class="login-form-side"><div class="auth-card">
      <div class="pill">StationDesk · Demonstration portal</div><h2>Welcome back</h2>
      <p class="subcopy">Sign in to explore your station management workspace.</p>
      <div class="role-switch" aria-label="Select demonstration account">
        <button type="button" data-action="role" data-role="manager" class="${state.loginRole==="manager"?"active":""}" aria-pressed="${state.loginRole==="manager"}">Manager</button>
        <button type="button" data-action="role" data-role="employee" class="${state.loginRole==="employee"?"active":""}" aria-pressed="${state.loginRole==="employee"}">Employee</button>
      </div>
      <form id="login-form">
        <label class="field"><span>Work email (demo)</span><input type="email" name="email" autocomplete="off" required value="${esc(acct.email)}"></label>
        <label class="field"><span>Password (demo)</span><span class="login-password"><input type="password" name="password" autocomplete="off" required placeholder="Enter demo password"><button type="button" class="password-toggle" data-action="show-password" aria-label="Show password" aria-pressed="false">Show</button></span></label>
        ${state.error?`<div class="error-line" role="alert">${esc(state.error)}</div>`:""}
        <button class="btn wide" type="submit">Sign in to StationDesk <span aria-hidden="true">→</span></button>
      </form>
      <div class="auth-hint"><b>Try the ${state.loginRole==="manager"?"manager":"employee"} demo</b><br>Email: <code>${esc(acct.email)}</code><br>Password: <code>Demo123!</code></div>
      <p class="auth-notice"><b>Demo login only.</b> These public sample credentials do not protect private information. Never enter a real password here.</p>
    </div></section>
  </div>`;
}

function uiIcon(name){return icon(name);}
function sidebarView() {
  const nav=navItems().map(([key,icon,title])=>`${key==="overview"?"<div class=\"nav-label\">Pages</div>":key==="approvals"?"<div class=\"nav-label\">Workflows</div>":key==="alerts"?"<div class=\"nav-label\">Monitor</div>":key==="settings"?"<div class=\"nav-label\">Application</div>":""}<button class="nav-item ${state.tab===key?"active":""}" data-action="navigate" data-tab="${key}" ${state.tab===key?'aria-current="page"':""}><span class="nav-icon">${uiIcon(icon)}</span>${title}${key==="approvals"&&entries().filter(r=>r.status==="Pending").length?`<span class="nav-count">${entries().filter(r=>r.status==="Pending").length}</span>`:""}</button>`).join("");
  return `<aside class="sidebar"><div class="side-brand"><div class="brand"><span class="brand-mark">${icon("grid")}</span><span>Station<span class="brand-dot">Desk</span><small class="brand-subtitle">GAS STATION MIS</small></span></div></div><div class="side-site"><span class="side-site-label">Demo workspace</span><b>${icon("fuel")} ${esc(stationName(state.station))}</b><small>Operations application <span class="workspace-branch">${icon("down")}</span></small></div>
     <nav aria-label="Main menu">${nav}</nav>
     <div class="sidebar-bottom"><div class="sidebar-note"><strong>Demo workspace</strong>Explore with fictional data. No real ERPNext system is connected.</div>
     <div class="side-profile"><span class="avatar">${esc(state.user.name.split(" ").map(x=>x[0]).join(""))}</span><div><b>${esc(state.user.name)}</b><small>${esc(state.user.title)}</small></div><button class="logout" type="button" title="Switch user" aria-label="Sign out" data-action="logout">${icon("logout")}</button></div></div>
     </aside>`;
}

function sectionTitle(title,description,buttons) {
  return `<div class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div><div class="page-actions">${buttons||""}</div></div>`;
}

function stat(label,value,foot,icon) {
  return `<div class="card kpi"><div class="kpi-label">${esc(label)}<span class="kpi-icon">${icon}</span></div><div class="kpi-value">${esc(value)}</div><div class="kpi-foot">${foot}</div></div>`;
}

// On compact screens, show actionable summaries rather than a wide, scrolling table.
function mobileReportCard(r) {
  const values=core.calculate(r);
  const resubmit=state.user.role==="employee" && r.status==="Returned"
    ? '<button class="btn small secondary" type="button" data-action="resubmit" data-id="'+esc(r.id)+'">Resubmit</button>' : "";
  return '<article class="mobile-report-card">'
    + '<div class="mobile-report-top"><div><strong>'+esc(r.id)+'</strong><span>'+esc(r.shift)+' shift · '+dateText(r.date)+'</span></div>'+statusTag(r.status)+'</div>'
    + '<div class="mobile-report-person">'+esc(r.owner)+'</div>'
    + '<div class="mobile-report-numbers"><div><small>Sales</small><b>'+rwf(values.sales)+'</b></div><div><small>Cash difference</small><b>'+rwf(values.difference)+'</b></div></div>'
    + '<div class="mobile-report-actions"><button class="btn small secondary" type="button" data-action="details" data-id="'+esc(r.id)+'">View details '+icon("down")+'</button>'+resubmit+'</div>'
    + '</article>';
}

function overviewView() {
  const rs=entries(),approved=rs.filter(x=>x.status==="Approved"),pending=rs.filter(x=>x.status==="Pending"),alerts=activeAlerts().filter(x=>x.status==="Open"),sum=approved.reduce((a,x)=>a+core.calculate(x).sales,0);
  const card1=stat(state.user.role==="manager"?"Approved sales":"My approved sales",rwf(sum),"<strong>↑ Demo data</strong> · Approved reports only",icon("trend"));
  const card2=stat("Reports submitted",String(rs.length), "Across sample shifts",icon("file"));
  const card3=stat("Pending approvals",String(pending.length),state.user.role==="manager"?"Need your review":"Awaiting management",icon("check"));
  const card4=stat("Open alerts",String(alerts.length),"Sample operational notices",icon("bell"));
  const chartValues=[36,52,44,68,59,77,83];
  const bars=chartValues.map((v,i)=>`<div class="bar-col"><div class="bar ${i===6?"current":""} bar-${v}"><span class="bar-label">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div></div>`).join("");
  const alertRows=activeAlerts().slice(0,3).map(a=>`<div class="list-row"><span class="list-icon">${a.status==="Open"?"⚑":"✓"}</span><div class="list-main"><b>${esc(a.title)}</b><small>${esc(a.age)}</small></div>${statusTag(a.status)}</div>`).join("");
  const mobileReports=rs.slice(0,5).map(mobileReportCard).join("");
  const reports=rs.slice(0,5).map(r=>`<tr><td><b>${esc(r.id)}</b></td><td>${esc(r.shift)}</td><td>${esc(r.owner)}</td><td>${dateText(r.date)}</td><td>${rwf(core.calculate(r).sales)}</td><td>${statusTag(r.status)}</td><td><button class="mini-link" data-action="details" data-id="${esc(r.id)}">View ↗</button></td></tr>`).join("");
  return `${sectionTitle("Workspace overview","Station: "+stationName(state.station)+" · "+new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}),state.user.role==="employee"?'<button class="btn" data-action="new-report">${icon("plus")} New shift report</button>':'<button class="btn secondary" data-action="navigate" data-tab="approvals">Review pending approvals →</button>')}
   <div class="kpi-grid">${card1}${card2}${card3}${card4}</div>
   <div class="enterprise-section-heading"><div><h2>Recent activity</h2><p>Shift records from the selected station</p></div><span class="section-caption">▤ &nbsp;DATA TABLE</span></div>
   <section class="card table-card"><div class="card-header tight"><div><h2>Shift reports <span class="widget-count">${rs.length}</span></h2><p>Latest records, with review status</p></div><button class="mini-link" data-action="navigate" data-tab="reports">Open table ↗</button></div><div class="table-wrap" role="region" tabindex="0" aria-label="Scrollable shift reports table"><table class="data-table"><thead><tr><th>Report</th><th>Shift</th><th>Submitted by</th><th>Date</th><th>Total sales</th><th>Status</th><th></th></tr></thead><tbody>${reports||'<tr><td colspan="7">No reports</td></tr>'}</tbody></table></div><div class="mobile-report-list">${mobileReports||'<div class="empty">No reports to show.</div>'}</div></section>
   <div class="enterprise-section-heading lower-heading"><div><h2>Analytics & alerts</h2><p>Widget-based operations overview</p></div><span class="section-caption">◈ &nbsp;WIDGETS</span></div>
   <div class="two-up"><section class="card"><div class="card-header"><div><h2>Weekly operations trend</h2><p>Illustrative activity chart · not connected to POS</p></div><span class="widget-type">${icon("trend")} Chart</span></div><div class="card-body"><div class="chart" role="img" aria-label="Fictional weekly activity chart with bars for Monday through Sunday">${bars}</div><div class="chart-key"><i></i> Current period &nbsp; · &nbsp; Illustrative trends only</div></div></section>
   <section class="card"><div class="card-header"><div><h2>Actions & notifications</h2><p>Requires attention or review</p></div><button class="mini-link" data-action="navigate" data-tab="alerts">View all →</button></div><div class="card-body">${alertRows||'<div class="empty">No alerts here</div>'}</div></section></div>`;
}

function reportsView() {
  const q=state.query.trim().toLowerCase();
  const rs=entries().filter(r=>(state.filter==="All"||r.status===state.filter)&&(!q||[r.id,r.owner,r.shift,r.status,r.date,stationName(r.station)].some(v=>String(v).toLowerCase().includes(q))));
  const filters=["All","Pending","Approved","Returned"].map(f=>`<button class="filter-btn ${state.filter===f?"active":""}" data-action="filter" data-filter="${f}" aria-pressed="${state.filter===f}">${f}</button>`).join("");
  const mobileRows=rs.map(mobileReportCard).join("");
  const rows=rs.map(r=>`<tr><td><b>${esc(r.id)}</b></td><td>${dateText(r.date)}</td><td>${esc(r.shift)}</td><td>${esc(r.owner)}</td><td>${rwf(core.calculate(r).sales)}</td><td>${rwf(core.calculate(r).difference)}</td><td>${statusTag(r.status)}</td><td><button class="mini-link" data-action="details" data-id="${esc(r.id)}">Details →</button>${state.user.role==="employee" && r.status==="Returned"?`<button class="btn small ghost" data-action="resubmit" data-id="${esc(r.id)}">Resubmit</button>`:""}</td></tr>`).join("");
  return `${sectionTitle("Shift reports","Review daily close reports and their current approval state.",state.user.role==="employee"?'<button class="btn" data-action="new-report">${icon("plus")} Create report</button>':"")}
  <section class="card table-card"><div class="widget-table-heading"><div><b>Shift reports</b><span>Reporting data · ${rs.length} matching records</span></div><span class="widget-type">${icon("file")} Table</span></div><div class="widget-toolbar"><label class="widget-search"><span aria-hidden="true">${icon("search")}</span><input id="report-search" type="search" value="${esc(state.query)}" placeholder="Search reports, names, shifts..." aria-label="Search reports"></label><button class="btn small secondary" type="button" data-action="export-csv">${icon("download")} Export CSV</button></div><div class="filters">${filters}</div><div class="table-wrap" role="region" tabindex="0" aria-label="Scrollable shift reports table"><table class="data-table"><thead><tr><th>Report</th><th>Date</th><th>Shift</th><th>Staff</th><th>Sales</th><th>Cash difference</th><th>Status</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="8"><div class="empty">No reports match this filter.</div></td></tr>'}</tbody></table></div><div class="mobile-report-list">${mobileRows||'<div class="empty">No reports match this filter.</div>'}</div></section>`;
}

function approvalsView() {
  if(state.user.role!=="manager")return `<div class="card info-card">This sample screen is available to the demo manager only.</div>`;
  const pending=entries().filter(r=>r.status==="Pending");
  const items=pending.map(r=>`<article class="card review-card"><div class="review-head"><span class="pill compact">AWAITING REVIEW</span><small class="muted">${esc(r.id)}</small></div><h3>${esc(r.shift)} · ${esc(stationName(r.station))}</h3><p>${esc(r.owner)} · ${dateText(r.date)}</p><div class="review-amount">${rwf(core.calculate(r).sales)}</div><p>Expected cash: ${rwf(core.calculate(r).expected)}<br>Difference: ${rwf(core.calculate(r).difference)}</p><div class="review-actions"><button class="btn secondary" data-action="ask-return" data-id="${esc(r.id)}">Return</button><button class="btn" data-action="approve" data-id="${esc(r.id)}">✓ Approve</button></div></article>`).join("");
  return `${sectionTitle("Pending approvals","Confirm reported figures, or return a submission for correction.")}${pending.length?`<div class="review-grid">${items}</div>`:`<section class="card empty"><div class="empty-emoji">✓</div>You're all caught up. No reports are waiting for approval.</section>`}`;
}

function alertsView() {
  const cards=activeAlerts().map(a=>`<article class="card alert-card"><span class="list-icon">${a.type==="Variance"?"⚠":a.type==="Approval"?"▤":"♧"}</span><div class="list-main"><b>${esc(a.title)}</b><small>${esc(a.message)} · ${esc(a.age)}</small></div>${statusTag(a.status)}${state.user.role==="manager"&&a.status==="Open"?`<button class="btn small secondary" data-action="resolve" data-id="${esc(a.id)}">Mark resolved</button>`:""}</article>`).join("");
  return `${sectionTitle("Alerts & notifications","Stay on top of missing reports, approvals, and cash discrepancies.")}<div class="alert-feed">${cards||'<div class="card empty">No notifications for this station.</div>'}</div>`;
}

function teamView() {
  if(state.user.role!=="manager")return `<section class="card info-card">Manager view only.</section>`;
  const team=state.station==="central"?[["RD","Rúben Dias","Station Manager"],["EH","Erling Haaland","Shift Supervisor"],["PF","Phil Foden","Cashier"],["JD","Jérémy Doku","Forecourt Attendant"]]:[["RD","Rúben Dias","Station Manager"],["JG","Joško Gvardiol","Shift Supervisor"],["RC","Rayan Cherki","Cashier"]];
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


let pumpLottie=null;
let dialogReturnFocus=null;

// Focus never moves behind an open modal. Return focus to its trigger on close.
function openDialog(modal, trigger) {
  dialogReturnFocus={action:trigger.dataset.action,id:trigger.dataset.id||null};
  state.modal=modal;
  render();
  document.querySelector(".modal-panel .modal-close")?.focus({preventScroll:true});
}
function closeDialog() {
  state.modal=null;
  render();
  if(dialogReturnFocus){
    const controls=Array.from(document.querySelectorAll("[data-action]"));
    const trigger=controls.find(el=>el.dataset.action===dialogReturnFocus.action &&
      (el.dataset.id||null)===dialogReturnFocus.id);
    trigger?.focus({preventScroll:true});
    dialogReturnFocus=null;
  }
}


function initializePumpLottie(){
  const node=document.getElementById("pump-lottie-canvas");
  if(!node)return;
  if(pumpLottie){pumpLottie.destroy();pumpLottie=null;}
  if(typeof window.lottie?.loadAnimation!=="function"){
    node.closest(".pump-illustration")?.querySelector(".pump-fallback")?.removeAttribute("hidden");
    return;
  }
  // The exact uploaded animation runs automatically: no hover, click, or tap.
  // The visual is the only animation on the StationDesk login screen.
  const instance=window.lottie.loadAnimation({
    container:node,renderer:"svg",loop:true,autoplay:false,
    path:"./fuel-pump-lottie.json",
    rendererSettings:{preserveAspectRatio:"xMidYMid meet"}
  });
  pumpLottie=instance;
  instance.addEventListener("DOMLoaded",()=>{
    if(!node.isConnected)return;
    const svg=node.querySelector("svg");
    if(svg){
      svg.setAttribute("viewBox","430 60 950 1000");
      svg.setAttribute("preserveAspectRatio","xMidYMid meet");
    }
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      instance.goToAndStop(Math.max(0,instance.totalFrames-1),true);
    }else{
      instance.play();
    }
  });
  const showFailure=()=>{
    if(!node.isConnected)return;
    node.closest(".pump-illustration")?.querySelector(".pump-fallback")?.removeAttribute("hidden");
  };
  instance.addEventListener("data_failed",showFailure);
  instance.addEventListener("error",showFailure);
}

function render() {
  const app=document.getElementById("app");
  if(!state.user){app.innerHTML=loginView();initializePumpLottie();return;}
  if(pumpLottie){pumpLottie.destroy();pumpLottie=null;}
  const tabs={overview:overviewView,reports:reportsView,approvals:approvalsView,alerts:alertsView,team:teamView,settings:aboutView};
  const view=(tabs[state.tab]||overviewView)();
  const visibleTabs=new Set(["overview","reports","approvals","alerts"]);
  const shortNames={overview:"Home",reports:"Reports",approvals:"Approvals",alerts:"Alerts"};
  const menu=navItems().filter(([id])=>visibleTabs.has(id))
    .map(([id,symbol])=>`<button type="button" class="${state.tab===id?"active":""}" data-action="navigate" data-tab="${id}" ${state.tab===id?'aria-current="page"':""}><span aria-hidden="true">${uiIcon(symbol)}</span><span>${shortNames[id]}</span></button>`).join("");
  const moreActive=state.mobileMore||["team","settings"].includes(state.tab);
  const moreButton=`<button type="button" class="${moreActive?"active":""}" data-action="mobile-more" aria-haspopup="dialog" aria-expanded="${state.mobileMore}"><span aria-hidden="true">${icon("gear")}</span><span>More</span></button>`;
  const extraLinks=navItems().filter(([id])=>!visibleTabs.has(id))
    .map(([id,symbol,label])=>`<button type="button" class="mobile-more-link" data-action="navigate" data-tab="${id}">${icon(symbol)} <span>${esc(label)}</span> ${icon("down")}</button>`).join("");
  const moreSheet=state.mobileMore?`<div class="mobile-more-backdrop" data-action="mobile-more-close"></div><section class="mobile-more-sheet" role="dialog" aria-modal="true" aria-label="More station options"><div class="mobile-more-heading"><b>More options</b><button type="button" class="mobile-more-dismiss" data-action="mobile-more-close" aria-label="Close more options">×</button></div><div class="mobile-more-content">${extraLinks}<button type="button" class="mobile-more-link" data-action="logout">${icon("logout")} <span>Switch demo account</span> ${icon("down")}</button></div></section>`:"";
  const select=state.user.role==="manager"?`<select class="select station" id="station-select" aria-label="Select station">${stations.map(s=>`<option value="${esc(s.id)}" ${s.id===state.station?"selected":""}>${esc(s.name)}</option>`).join("")}</select>`:`<span class="select station station-text">${esc(stationName(state.station))}</span>`;
  app.innerHTML=`<div class="app-shell workspace-shell">${sidebarView()}<div class="main-area"><header class="topbar"><div class="top-title"><span class="workspace-icon">${icon("grid")}</span><span class="top-trail">StationDesk <span class="crumb-slash">/</span></span><strong>${esc((navItems().find(x=>x[0]===state.tab)||navItems()[0])[2])}</strong><small class="widget-environment">Preview</small></div><div class="top-actions"><span class="today-stamp">${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>${select}<span class="top-role">${esc(state.user.name.split(" ").map(n=>n[0]).join(""))}</span></div></header><main class="content"><div class="demo-banner"><b>Preview</b> &nbsp; You are exploring a sample workspace — fictional data, simulated login, no ERPNext connection.</div>${view}<div class="footer-note">StationDesk · Demo workspace · No real company data or live backend.</div></main><nav class="mobile-bar" aria-label="Mobile menu">${menu}${moreButton}</nav></div></div>${moreSheet}${modalView()}${state.toast?`<div class="toast" role="status">✓ ${esc(state.toast)} <button class="btn small ghost" data-action="dismiss">×</button></div>`:""}`;
}

function notify(message) {state.toast=message;render();}

function actions(event) {
  const button=event.target.closest("[data-action]");
  if(!button)return;
  const action=button.dataset.action;
  if(action==="close-overlay" && event.target!==button)return;
if(action==="show-password"){
    const password=button.closest(".login-password")?.querySelector('input[name="password"]');
    if(!password)return;
    const revealed=password.type==="password";password.type=revealed?"text":"password";
    button.textContent=revealed?"Hide":"Show";
    button.setAttribute("aria-label",revealed?"Hide password":"Show password");
    button.setAttribute("aria-pressed",String(revealed));
    return;
  }
  if(action==="mobile-more"){
    state.mobileMore=!state.mobileMore;
    render();
    if(state.mobileMore)document.querySelector(".mobile-more-link")?.focus({preventScroll:true});
    else document.querySelector('[data-action="mobile-more"]')?.focus({preventScroll:true});
    return;
  }
  if(action==="mobile-more-close"){
    state.mobileMore=false;render();
    document.querySelector('[data-action="mobile-more"]')?.focus({preventScroll:true});
    return;
  }
  if(action==="role"){const selected=button.dataset.role;state.loginRole=selected;state.error="";render();document.querySelector('[data-action="role"][data-role="'+selected+'"]')?.focus({preventScroll:true});return;}
  if(action==="logout"){state.mobileMore=false;state.user=null;state.loginRole="manager";state.tab="overview";state.error="";state.query="";state.modal=null;state.toast="";state.mobileMore=false;render();return;}
  if(!state.user)return;
  if(action==="navigate"){const tab=button.dataset.tab;if(navItems().some(x=>x[0]===tab)){state.tab=tab;state.filter="All";state.query="";state.modal=null;state.toast="";state.mobileMore=false;render();}return;}
  if(action==="export-csv"){
    const quoteCSV=value=>'"'+String(value).replace(/"/g,'""')+'"';
    const rows=entries().filter(r=>(state.filter==="All"||r.status===state.filter)&&(!state.query.trim()||[r.id,r.owner,r.shift,r.status,r.date,stationName(r.station)].some(v=>String(v).toLowerCase().includes(state.query.trim().toLowerCase()))));
    const headers=["Report ID","Date","Station","Shift","Employee","Sales RWF","Cash variance RWF","Status"];
    const values=rows.map(r=>[r.id,r.date,stationName(r.station),r.shift,r.owner,core.calculate(r).sales,core.calculate(r).difference,r.status]);
    const csv=[headers,...values].map(cols=>cols.map(quoteCSV).join(",")).join("\r\n");
    const blob=new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="station-reports-demo.csv";
    a.style.display="none";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    notify("Sample data exported to CSV.");return;
  }
  if(action==="filter"){state.filter=button.dataset.filter;render();return;}
  if(action==="dismiss"){state.toast="";render();return;}
  if(action==="close-modal"||action==="close-overlay"){closeDialog();return;}
  if(action==="new-report"&&state.user.role==="employee"){openDialog({type:"new"},button);return;}
  if(action==="details"){const report=state.reports.find(r=>r.id===button.dataset.id);if(report && entries().includes(report)){openDialog({type:"details",id:report.id},button);}return;}
  if(action==="approve"){const report=state.reports.find(r=>r.id===button.dataset.id);if(!report||report.station!==state.station||state.user.role!=="manager")return;try{Object.assign(report,core.transition(report,state.user.role,"approve"));state.alerts.forEach(a=>{if(a.reportId===report.id&&a.type==="Approval")a.status="Resolved";});state.modal=null;notify(report.id+" approved (demo only).");}catch(err){notify(err.message);}return;}
  if(action==="resubmit"){const report=state.reports.find(r=>r.id===button.dataset.id);if(report&&report.station===state.station&&report.ownerRole==="employee"&&state.user.role==="employee"){try{Object.assign(report,core.transition(report,"employee","submit"));state.alerts.unshift({id:"AL-"+Date.now(),reportId:report.id,station:state.station,title:"Approval required",message:"Resubmitted shift report "+report.id+" is awaiting approval.",type:"Approval",status:"Open",age:"Just now"});notify(report.id+" resubmitted to the demo manager.");}catch(err){notify(err.message);}}return;}
  if(action==="ask-return"){const report=state.reports.find(r=>r.id===button.dataset.id);if(report&&report.station===state.station&&core.canTransition(state.user.role,report.status,"return")){openDialog({type:"return",id:report.id},button);}return;}
  if(action==="resolve"){const alert=state.alerts.find(a=>a.id===button.dataset.id);if(alert && alert.station===state.station && state.user.role==="manager"){alert.status="Resolved";notify("Sample alert resolved.");}return;}
}

function forms(event) {
  if(!["login-form","report-form","return-form"].includes(event.target.id))return;
  event.preventDefault();
  const fd=new FormData(event.target);
  if(event.target.id==="login-form"){
    const account=accounts[state.loginRole];
    if(String(fd.get("email")).trim().toLowerCase()===account.email && String(fd.get("password"))===account.password){
      state.user=account;state.station="central";state.tab="overview";state.filter="All";state.query="";state.error="";state.toast="";render();
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
  app.addEventListener("input",event=>{
    if(event.target.id!=="report-search")return;
    const p=event.target.selectionStart;
    state.query=event.target.value;
    render();
    const input=document.getElementById("report-search");
    if(input){input.focus();try{input.setSelectionRange(p,p);}catch(_){}}
  });
  app.addEventListener("change",event=>{
    if(event.target.id==="station-select" && state.user?.role==="manager" && stations.some(s=>s.id===event.target.value)){
      state.station=event.target.value;state.modal=null;state.filter="All";state.query="";render();
    }
  });
  document.addEventListener("keydown",event=>{
    if(state.mobileMore && !state.modal){
      const sheet=document.querySelector(".mobile-more-sheet");
      if(event.key==="Escape"){event.preventDefault();state.mobileMore=false;render();document.querySelector('[data-action="mobile-more"]')?.focus();return;}
      if(event.key==="Tab" && sheet){
        const choices=Array.from(sheet.querySelectorAll("button:not([disabled])"));
        const first=choices[0],last=choices[choices.length-1];
        if(event.shiftKey && (document.activeElement===first || !sheet.contains(document.activeElement))){event.preventDefault();last?.focus();}
        else if(!event.shiftKey && (document.activeElement===last || !sheet.contains(document.activeElement))){event.preventDefault();first?.focus();}
      }
      return;
    }
    if(!state.modal)return;
    if(event.key==="Escape"){event.preventDefault();closeDialog();return;}
    if(event.key!=="Tab")return;
    const dialog=document.querySelector(".modal-panel");
    if(!dialog)return;
    const focusable=Array.from(dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'))
      .filter(el=>el.getClientRects().length>0);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey && (document.activeElement===first || !dialog.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey && (document.activeElement===last || !dialog.contains(document.activeElement))){event.preventDefault();first.focus();}
  });
  render();
}

start();
