/*
 * shared.js — Kasese Hills Academy School Management System
 * ==========================================================
 * Loaded by every portal page AND the login page (index.html).
 *
 * Sections
 * --------
 *  1. CSS injection          — injects all styles once into <head>
 *  2. School badge SVG       — inline SVG crest used in every portal
 *  3. Role definitions       — which pages each role can access
 *  4. Icon map               — sidebar icons per page name
 *  5. Seed data              — sample records shown on first load
 *  6. Data layer             — db (localStorage), save(), customFields
 *  7. Session state          — role, page, pageHistory, currentUser
 *  8. Utility helpers        — esc(), showToast(), initials(), avatarMarkup()
 *  9. Image helper           — resizePhoto()
 * 10. Auth system            — hashPassword(), authenticate(), saveLogin()
 * 11. Login screen           — loginScreen(), initLogin()
 * 12. App shell              — shell(), render(), renderPage()
 * 13. Navigation             — navigateTo(), goBack()
 * 14. Page renderers         — overviewPage(), dataPage(), studentsPage(), …
 * 15. Event handlers         — onContentClick(), onContentInput(), onContentSubmit()
 * 16. Modal system           — openModal(), formDefinitions, formModules
 * 17. Portal entry point     — initPortal()
 */


/* ─────────────────────────────────────────────────────────────
   1. CSS injection
   ───────────────────────────────────────────────────────────── */
/* Wrapped in an IIFE so it runs immediately when the script loads.
   The guard prevents duplicate injection if the script is ever loaded twice. */
(function injectStyles() {
  if (document.getElementById("kha-styles")) return;
  const s = document.createElement("style");
  s.id = "kha-styles";
  s.textContent = [
    /* Design tokens */
    ":root{--ink:#182230;--muted:#748095;--line:#e9edf3;--surface:#fff;--canvas:#f7f8fc;",
    "--navy:#17263d;--blue:#4263eb;--blue-light:#eef1ff;--green:#1b9b70;",
    "--green-light:#e8f7f1;--orange:#e69a34;--orange-light:#fff5e7;",
    "--red:#d75454;--red-light:#fff0ef;",
    "--shadow:0 8px 28px rgba(30,47,75,.055);",
    "font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
    "*{box-sizing:border-box}",
    "body{margin:0;color:var(--ink);background:var(--canvas);font-size:14px}",
    "button,input,select,textarea{font:inherit}button{cursor:pointer}",

    /* Login screen — two-column grid */
    ".login-screen{min-height:100vh;display:grid;grid-template-columns:minmax(340px,.95fr) 1.05fr;background:white}",
    ".login-brand{padding:58px clamp(28px,7vw,100px);display:flex;flex-direction:column;",
    "justify-content:space-between;color:#fff;",
    "background:radial-gradient(circle at 12% 16%,#4775d8 0,transparent 38%),",
    "linear-gradient(145deg,#13243a,#1e3d65 65%,#315d8f)}",
    ".brand-lockup{display:flex;gap:13px;align-items:center;font-weight:750;letter-spacing:-.3px}",
    /* Crest — rounded square containing the school badge SVG */
    ".crest{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;",
    "color:#fff;background:rgba(255,255,255,.15);font-size:21px;flex-shrink:0}",
    ".crest svg{width:36px;height:36px;display:block}",
    /* Topbar badge — smaller badge in the header breadcrumb */
    ".topbar-badge{display:flex;align-items:center;gap:9px}",
    ".topbar-badge svg{width:30px;height:30px;display:block}",
    ".brand-message{max-width:510px}",
    ".brand-message .eyebrow{color:#bed0f6;text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:700}",
    ".brand-message h1{font-size:clamp(36px,4.4vw,58px);letter-spacing:-2px;line-height:1.06;margin:20px 0}",
    ".brand-message p{max-width:430px;color:#d2def2;line-height:1.8;font-size:15px}",
    ".login-footer{color:#b8c8e0;font-size:12px}",
    ".login-panel{display:grid;place-items:center;padding:36px 24px}",
    ".login-card{width:min(100%,430px)}",
    ".login-card h2{margin:0 0 8px;font-size:29px;letter-spacing:-1px}",
    ".login-card>p{color:var(--muted);margin:0 0 30px}",
    /* Sign-in / Create-account tab switcher */
    ".auth-switch{display:flex;gap:8px;margin:0 0 22px;padding:4px;border-radius:9px;background:#f3f5f9}",
    ".auth-switch button{flex:1;min-height:34px;border:0;border-radius:6px;color:#68758a;background:transparent;font-size:11px;font-weight:650}",
    ".auth-switch button.active{color:#344bb6;background:white;box-shadow:0 1px 4px #17263d14}",
    ".auth-error{margin:12px 0;color:#b34444;font-size:11px;line-height:1.5}",
    ".auth-link{display:block;margin:15px auto 0;padding:4px;border:0;color:#5367d1;background:transparent;font-size:11px;font-weight:650}",
    ".recovery-code{margin:18px 0;padding:18px;border:1px dashed #9baaf4;border-radius:10px;color:#263b77;background:#f5f6ff;text-align:center;font-size:18px;font-weight:750;letter-spacing:1px;overflow-wrap:anywhere}",
    ".recovery-warning{padding:12px;border-radius:8px;color:#795923;background:#fff7e8;font-size:12px;line-height:1.6}",

    /* Form fields */
    ".field{display:grid;gap:8px;margin:17px 0}",
    ".field label{font-size:12px;font-weight:650;color:#4f5b6e}",
    ".field input,.field select,.field textarea{width:100%;min-height:44px;padding:11px 13px;",
    "border:1px solid #e1e6ee;border-radius:9px;color:var(--ink);background:#fff;outline:none}",
    ".field textarea{min-height:85px;resize:vertical}",
    ".field input:focus,.field select:focus,.field textarea:focus{border-color:#8195f1;box-shadow:0 0 0 3px #eef1ff}",
    ".login-card .btn{width:100%;margin-top:10px}",
    ".login-note{margin-top:18px;padding:12px;color:#65728a;background:#f5f7fb;border-radius:8px;font-size:12px;line-height:1.6}",

    /* App shell */
    ".app{min-height:100vh}",
    /* Fixed left sidebar */
    ".sidebar{position:fixed;z-index:5;inset:0 auto 0 0;width:254px;display:flex;flex-direction:column;",
    "padding:21px 15px 16px;color:#dce4f1;background:var(--navy);transition:transform .2s ease}",
    ".sidebar .brand-lockup{padding:0 8px 23px;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px}",
    ".sidebar .crest{background:#314b70}",
    ".school-subtitle{display:block;padding-top:4px;color:#95a5bd;font-size:10px;font-weight:450}",
    /* Portal label above the nav links */
    ".portal-label{margin:19px 9px 10px;color:#8899b1;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700}",
    ".nav-list{overflow-y:auto}",
    ".nav-item{width:100%;display:flex;align-items:center;gap:12px;padding:10px 11px;border:0;",
    "border-radius:8px;margin:2px 0;text-align:left;color:#b8c4d5;background:transparent;font-size:12px}",
    ".nav-item:hover{background:rgba(255,255,255,.07);color:#fff}",
    /* Active nav item — left accent bar */
    ".nav-item.active{color:#fff;background:#2b3d59;box-shadow:inset 3px 0 #7992ff}",
    ".nav-icon{width:19px;font-size:16px;text-align:center}",
    ".side-bottom{margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.1)}",
    /* Logged-in user strip */
    ".user-mini{display:flex;gap:10px;align-items:center;padding:9px 6px 12px}",
    ".avatar{flex:0 0 auto;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;",
    "color:#3952ac;background:#e7eaff;font-size:12px;font-weight:750}",
    ".avatar img{width:100%;height:100%;border-radius:inherit;object-fit:cover}",
    ".user-mini strong{display:block;color:#fff;font-size:12px}",
    ".user-mini small{display:block;margin-top:3px;color:#95a5bd;font-size:10px}",

    /* Top bar */
    ".main{min-height:100vh;margin-left:254px}",
    ".topbar{height:70px;display:flex;align-items:center;justify-content:space-between;",
    "padding:0 34px;background:#fff;border-bottom:1px solid var(--line)}",
    ".crumb{color:var(--muted);font-size:12px}",
    ".crumb strong{color:var(--ink);font-weight:650}",
    ".back-button{margin-right:10px;font-size:16px}",
    ".back-button:disabled{opacity:.45;cursor:default;background:#f8f9fb}",
    ".top-actions{display:flex;gap:18px;align-items:center}",
    ".icon-btn{position:relative;width:35px;height:35px;border:1px solid var(--line);",
    "border-radius:9px;background:#fff;color:#65728a}",
    /* Red dot on the notifications button */
    ".notification-dot{position:absolute;width:7px;height:7px;right:7px;top:7px;",
    "border-radius:50%;background:#e76666;border:1.5px solid white}",
    ".today{color:var(--muted);font-size:11px}",
    ".mobile-menu{display:none}",

    /* Content area */
    ".content{max-width:1500px;padding:29px 34px 44px;margin:0 auto}",
    ".page-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 0 23px}",
    ".page-heading h1{margin:0;font-size:24px;letter-spacing:-.7px}",
    ".page-heading p{margin:6px 0 0;color:var(--muted);font-size:12px}",
    ".heading-actions{display:flex;gap:9px}",

    /* Buttons */
    ".btn{min-height:38px;display:inline-flex;justify-content:center;align-items:center;gap:8px;",
    "padding:0 14px;border:1px solid transparent;border-radius:8px;background:var(--blue);",
    "color:white;font-weight:650;font-size:12px;box-shadow:0 2px 5px #4263eb22}",
    ".btn:hover{background:#3453d7}",
    ".btn-secondary{color:#536078;background:white;border-color:#e4e8ef;box-shadow:none}",
    ".btn-secondary:hover{background:#f8f9fc}",
    ".btn-small{min-height:32px;padding:0 11px;font-size:11px}",

    /* Stat cards */
    ".stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:19px}",
    ".stat-card,.panel{border:1px solid #edf0f4;border-radius:11px;background:var(--surface);box-shadow:var(--shadow)}",
    ".stat-card{padding:17px 18px}",
    ".stat-top{display:flex;justify-content:space-between;align-items:flex-start}",
    ".stat-label{color:var(--muted);font-size:11px;font-weight:550}",
    ".stat-icon{width:33px;height:33px;display:grid;place-items:center;border-radius:9px;color:#4d61cf;background:#f0f2ff;font-size:15px}",
    ".stat-card:nth-child(2) .stat-icon{color:var(--green);background:var(--green-light)}",
    ".stat-card:nth-child(3) .stat-icon{color:var(--orange);background:var(--orange-light)}",
    ".stat-card:nth-child(4) .stat-icon{color:#8b62ca;background:#f4edff}",
    ".stat-value{margin:10px 0 7px;font-size:25px;font-weight:730;letter-spacing:-.7px}",
    ".stat-foot{color:#8b95a6;font-size:10px}",
    ".stat-foot .positive{color:var(--green);font-weight:650}",

    /* Dashboard panels */
    ".dashboard-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(270px,.9fr);gap:16px;margin-bottom:17px}",
    ".panel{min-width:0;padding:18px}",
    ".panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:15px}",
    ".panel-head h2{margin:0;font-size:13px;font-weight:700}",
    ".panel-head small{color:var(--muted);font-size:10px}",
    ".chart-legend{display:flex;gap:15px;color:var(--muted);font-size:10px}",
    ".legend-dot{display:inline-block;width:7px;height:7px;margin-right:5px;border-radius:50%;background:var(--blue)}",
    ".legend-dot.orange{background:#f0ad5a}",
    ".chart-wrap{height:200px}",
    ".chart-wrap svg{width:100%;height:100%;overflow:visible}",
    ".chart-gridline{stroke:#edf0f5;stroke-width:1}",
    ".chart-text{fill:#94a0b1;font-size:9px;font-family:inherit}",

    /* Activity feed */
    ".activities{display:grid}",
    ".activity{display:grid;grid-template-columns:29px 1fr;gap:11px;padding:10px 0;border-bottom:1px solid #f1f3f6}",
    ".activity:last-child{border:0}",
    ".activity-icon{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:#5467cb;background:#f0f2ff;font-size:12px}",
    ".activity p{margin:0;line-height:1.5;font-size:10px;color:#596578}",
    ".activity strong{color:#273348}",
    ".activity time{display:block;margin-top:3px;color:#a1aaba;font-size:9px}",

    /* Attendance donut */
    ".bottom-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.8fr);gap:16px}",
    ".attendance-summary{display:flex;align-items:center;gap:20px;min-height:132px}",
    ".donut{width:110px;height:110px;border-radius:50%;display:grid;place-items:center;",
    "background:conic-gradient(#4263eb 0 78%,#f0ad5a 78% 89%,#ecedf1 89%);position:relative}",
    /* White punch-out to create the ring */
    ".donut:before{content:'';position:absolute;inset:12px;border-radius:50%;background:#fff}",
    ".donut-center{z-index:1;text-align:center}",
    ".donut-center strong{display:block;font-size:21px}",
    ".donut-center span{color:var(--muted);font-size:9px}",
    ".attendance-keys{display:grid;gap:13px}",
    ".attendance-key{display:flex;align-items:center;justify-content:space-between;gap:22px;color:#657084;font-size:10px}",
    ".key-label{display:flex;gap:7px;align-items:center}",
    ".key-swatch{width:7px;height:7px;border-radius:50%;background:var(--blue)}",
    ".key-swatch.late{background:#f0ad5a}",
    ".key-swatch.absent{background:#ecedf1}",
    ".attendance-key strong{color:var(--ink);font-size:11px}",

    /* Quick actions */
    ".quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}",
    ".quick-action{display:flex;align-items:center;gap:8px;min-height:55px;padding:9px;",
    "border:1px solid #edf0f4;border-radius:9px;background:white;color:#4e5d75;",
    "text-align:left;font-size:10px;font-weight:600}",
    ".quick-action:hover{border-color:#bcc7fa;background:#fafbff}",
    ".quick-action span:first-child{width:29px;height:29px;display:grid;place-items:center;",
    "border-radius:8px;background:#f0f2ff;color:#5367d1;font-size:13px}",

    /* Tables */
    ".table-panel{padding:0;overflow:hidden}",
    ".table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px}",
    ".table-toolbar h2{margin:0;font-size:13px}",
    ".table-filters{display:flex;gap:8px}",
    ".search-input{width:min(240px,37vw);min-height:33px;padding:7px 10px;",
    "border:1px solid #e7eaf0;border-radius:7px;outline:none;font-size:11px}",
    ".search-input:focus{border-color:#98a5ed}",
    ".filter-select{min-height:33px;padding:6px 8px;border:1px solid #e7eaf0;",
    "border-radius:7px;color:#657084;background:white;font-size:10px}",
    ".table-scroll{overflow-x:auto}",
    "table{width:100%;border-collapse:collapse;text-align:left;white-space:nowrap}",
    "th{padding:10px 16px;color:#8691a1;background:#fafbfc;border-top:1px solid #f0f2f5;",
    "border-bottom:1px solid #f0f2f5;font-size:9px;font-weight:650;text-transform:uppercase;letter-spacing:.45px}",
    "td{padding:12px 16px;border-bottom:1px solid #f1f3f6;color:#526075;font-size:10px}",
    "tbody tr:last-child td{border-bottom:0}",
    ".person{display:flex;align-items:center;gap:9px}",
    ".person .avatar{width:29px;height:29px;font-size:9px}",
    ".person strong{display:block;color:#283449;font-size:10px;font-weight:650}",
    ".person small{display:block;margin-top:3px;color:#9aa3b1;font-size:9px}",

    /* Status badges */
    ".badge{display:inline-block;padding:4px 8px;border-radius:99px;color:#19865f;background:#e9f8f1;font-size:9px;font-weight:650}",
    ".badge.warning{color:#a66d19;background:#fff4e3}",
    ".badge.danger{color:#ba4b4b;background:#fff0ef}",
    ".badge.neutral{color:#65728a;background:#f0f2f5}",

    /* Module cards */
    ".empty-state{padding:50px 20px;text-align:center;color:var(--muted)}",
    ".empty-state strong{display:block;margin-bottom:6px;color:#354155}",
    ".module-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:18px}",
    ".module-card{padding:17px}",
    ".module-card .stat-icon{margin-bottom:13px}",
    ".module-card h3{margin:0 0 5px;font-size:12px}",
    ".module-card p{margin:0;color:var(--muted);font-size:10px;line-height:1.6}",
    ".record-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}",
    ".record-link{padding:6px 9px;border:1px solid #e8ebf1;border-radius:6px;color:#5365c5;background:#fff;font-size:10px}",
    /* Notice / info banner */
    ".notice{padding:12px 14px;border-radius:8px;color:#6d5a35;background:#fff8eb;font-size:11px;line-height:1.6;margin-bottom:15px}",

    /* Modals */
    ".modal-backdrop{position:fixed;z-index:20;inset:0;display:grid;place-items:center;padding:20px;background:rgba(20,31,49,.44)}",
    ".modal{width:min(100%,520px);max-height:90vh;overflow:auto;border-radius:13px;background:white;box-shadow:0 20px 60px #17263d44}",
    ".modal-head{display:flex;justify-content:space-between;align-items:center;padding:18px 21px;border-bottom:1px solid var(--line)}",
    ".modal-head h2{margin:0;font-size:16px}",
    ".modal-body{padding:5px 21px 20px}",
    ".form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 13px}",
    ".form-grid .field{margin:11px 0}",
    ".form-grid .field.full{grid-column:1/-1}",
    ".modal-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:13px}",

    /* Toast */
    ".toast{position:fixed;z-index:30;bottom:24px;left:50%;transform:translateX(-50%);",
    "padding:12px 17px;border-radius:9px;color:white;background:#24354e;box-shadow:var(--shadow);font-size:12px}",

    /* Access denied */
    ".access-denied{max-width:560px;padding:32px;margin:60px auto;text-align:center}",
    ".access-denied .stat-icon{margin:0 auto 15px}",
    ".muted{color:var(--muted)}",

    /* Responsive — medium */
    "@media(max-width:1060px){",
    ".sidebar{width:226px}.main{margin-left:226px}",
    ".content{padding:24px 22px 36px}",
    ".stats-grid{grid-template-columns:repeat(2,1fr)}",
    ".dashboard-grid,.bottom-grid{grid-template-columns:1fr}",
    ".module-grid{grid-template-columns:repeat(2,1fr)}}",

    /* Responsive — small */
    "@media(max-width:700px){",
    ".login-screen{grid-template-columns:1fr}",
    ".login-brand{min-height:225px;padding:25px 25px 20px}",
    ".brand-message{margin:36px 0 25px}",
    ".brand-message h1{font-size:34px;margin:12px 0}",
    ".brand-message p{margin:0;font-size:12px}",
    ".login-footer{display:none}",
    ".login-panel{align-items:start;padding:30px 23px}",
    /* Sidebar slides off-screen; toggled by .open class */
    ".sidebar{transform:translateX(-100%);width:254px}",
    ".sidebar.open{transform:translateX(0);box-shadow:12px 0 40px #11182733}",
    ".main{margin-left:0}",
    ".topbar{height:60px;padding:0 17px}",
    ".mobile-menu{display:inline-flex;margin-right:10px}",
    ".top-left{display:flex;align-items:center}",
    ".today{display:none}",
    ".content{padding:23px 16px 32px}",
    ".page-heading{align-items:flex-start;flex-direction:column}",
    ".page-heading h1{font-size:22px}",
    ".stats-grid{gap:10px}",
    ".stat-card{padding:14px}",
    ".stat-value{font-size:22px}",
    ".module-grid{grid-template-columns:1fr 1fr;gap:9px}",
    ".module-card{padding:13px}",
    ".table-toolbar{align-items:flex-start;flex-direction:column}",
    ".table-filters{width:100%}",
    ".search-input{width:100%}",
    ".attendance-summary{gap:15px}}",

    /* Responsive — very small */
    "@media(max-width:390px){",
    ".module-grid{grid-template-columns:1fr}",
    ".stats-grid{grid-template-columns:1fr 1fr}",
    ".attendance-summary{flex-direction:column;align-items:flex-start}}"
  ].join("");
  document.head.appendChild(s);
})();


/* ─────────────────────────────────────────────────────────────
   2. School badge SVG
   ─────────────────────────────────────────────────────────────
   Inline SVG crest — navy shield, gold border, blue hills silhouette,
   gold sun, open book, and a "KHA · KASESE" banner.
   Rendered in the login brand panel, sidebar, topbar, and report modal.
   ───────────────────────────────────────────────────────────── */
const BADGE_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kasese Hills Academy badge">'
  + '<path d="M50 4 L90 18 L90 55 Q90 80 50 96 Q10 80 10 55 L10 18 Z" fill="#17263d" stroke="#c9a84c" stroke-width="2.5"/>'
  + '<path d="M50 12 L83 24 L83 54 Q83 75 50 89 Q17 75 17 54 L17 24 Z" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity=".7"/>'
  + '<path d="M18 62 Q28 42 38 52 Q44 40 50 44 Q56 36 62 50 Q70 38 82 62 Z" fill="#4263eb" opacity=".85"/>'
  + '<circle cx="50" cy="30" r="7" fill="#c9a84c"/>'
  + '<line x1="50" y1="18" x2="50" y2="14" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/>'
  + '<line x1="50" y1="42" x2="50" y2="46" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/>'
  + '<line x1="38" y1="30" x2="34" y2="30" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/>'
  + '<line x1="62" y1="30" x2="66" y2="30" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/>'
  + '<line x1="41.5" y1="21.5" x2="38.5" y2="18.5" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>'
  + '<line x1="58.5" y1="38.5" x2="61.5" y2="41.5" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>'
  + '<line x1="58.5" y1="21.5" x2="61.5" y2="18.5" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>'
  + '<line x1="41.5" y1="38.5" x2="38.5" y2="41.5" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>'
  + '<path d="M34 72 Q50 68 50 68 Q50 68 66 72 L66 82 Q50 78 50 78 Q50 78 34 82 Z" fill="#c9a84c" opacity=".9"/>'
  + '<line x1="50" y1="68" x2="50" y2="78" stroke="#17263d" stroke-width="1.2"/>'
  + '<rect x="22" y="86" width="56" height="8" rx="2" fill="#c9a84c"/>'
  + '<text x="50" y="93" text-anchor="middle" font-size="4.5" font-family="Inter,sans-serif" font-weight="700" fill="#17263d" letter-spacing=".5">KHA \u00b7 KASESE</text>'
  + '</svg>';


/* ─────────────────────────────────────────────────────────────
   3. Role definitions
   ─────────────────────────────────────────────────────────────
   Each role has a label (shown in the UI), a default display name,
   initials, and the ordered list of page names visible in the sidebar.
   ───────────────────────────────────────────────────────────── */
const roles = {
  admin:      { label: "Administrator",       name: "School Administrator", initials: "SA",
                pages: ["Overview","Students","Teachers","Academics","Attendance","Finance",
                        "Property & Transport","Boarding","Timetables & Exams","Reports",
                        "Portal access","Custom fields"] },
  registrar:  { label: "Registrar",           name: "Admissions Registrar", initials: "AR",
                pages: ["Overview","Students","Student transfers"] },
  dos:        { label: "Director of Studies", name: "Director of Studies",  initials: "DS",
                pages: ["Overview","Teachers","Academics","Attendance","Timetables & Exams","Reports"] },
  accountant: { label: "Accountant",          name: "School Accountant",    initials: "AC",
                pages: ["Overview","Finance","Students"] },
  property:   { label: "Property Department", name: "Property Officer",     initials: "PO",
                pages: ["Overview","Property & Transport"] },
  boarding:   { label: "Boarding & Hostel",   name: "Boarding Officer",     initials: "BO",
                pages: ["Overview","Boarding","Students"] }
};


/* ─────────────────────────────────────────────────────────────
   4. Icon map — sidebar icon character per page name
   ───────────────────────────────────────────────────────────── */
const iconMap = {
  Overview: "\u2302", Students: "\u2659", Teachers: "\u2667", Academics: "\u25a4",
  Attendance: "\u25f7", Finance: "\uff04", "Property & Transport": "\u25a3",
  Boarding: "\u25a5", "Timetables & Exams": "\u25a6", Reports: "\u25a7",
  "Portal access": "\u26bf", "Student transfers": "\u21c4", "Custom fields": "\uff0b"
};


/* ─────────────────────────────────────────────────────────────
   5. Seed / sample data
   ─────────────────────────────────────────────────────────────
   Used on first load when localStorage has no saved records.
   ───────────────────────────────────────────────────────────── */
const initialData = {
  students: [
    { name: "Amina K. Muhindo",   id: "KHA-2026-0142", class: "P.7", stream: "A", parent: "Sarah Muhindo", phone: "+256 772 410 826", status: "Active",  initials: "AM" },
    { name: "Daniel M. Baluku",   id: "KHA-2026-0138", class: "P.6", stream: "B", parent: "Mark Baluku",   phone: "+256 704 215 339", status: "Active",  initials: "DB" },
    { name: "Grace N. Masika",    id: "KHA-2026-0134", class: "P.5", stream: "A", parent: "Ruth Masika",   phone: "+256 782 506 144", status: "Active",  initials: "GM" },
    { name: "Isaac T. Kule",      id: "KHA-2026-0129", class: "P.7", stream: "B", parent: "Peter Kule",    phone: "+256 758 932 671", status: "Active",  initials: "IK" },
    { name: "Esther B. Ninsiima", id: "KHA-2026-0126", class: "P.4", stream: "A", parent: "Joy Ninsiima",  phone: "+256 779 063 520", status: "Active",  initials: "EN" }
  ],
  teachers: [
    { name: "Mr. Robert Kisembo", id: "T-008", subject: "Mathematics", class: "P.6, P.7",      phone: "+256 772 203 161", status: "Present", initials: "RK" },
    { name: "Mrs. Jane Kabugho",  id: "T-012", subject: "English",      class: "P.4, P.5",      phone: "+256 704 635 209", status: "Present", initials: "JK" },
    { name: "Mr. Paul Bwambale",  id: "T-015", subject: "Science",      class: "P.5, P.6, P.7", phone: "+256 782 991 403", status: "Present", initials: "PB" }
  ],
  payments: [
    { name: "Amina K. Muhindo", id: "RC-2026-0842",  class: "P.7 A", amount: "UGX 350,000", date: "05 Oct 2026", status: "Paid",        initials: "AM" },
    { name: "Daniel M. Baluku", id: "RC-2026-0839",  class: "P.6 B", amount: "UGX 200,000", date: "05 Oct 2026", status: "Partial",     initials: "DB" },
    { name: "Grace N. Masika",  id: "INV-2026-0321", class: "P.5 A", amount: "UGX 180,000", date: "04 Oct 2026", status: "Outstanding", initials: "GM" }
  ],
  attendance: [
    { name: "Amina K. Muhindo", id: "KHA-2026-0142", class: "P.7 A", time: "07:18 AM", status: "Present", initials: "AM" },
    { name: "Daniel M. Baluku", id: "KHA-2026-0138", class: "P.6 B", time: "07:42 AM", status: "Late",    initials: "DB" },
    { name: "Grace N. Masika",  id: "KHA-2026-0134", class: "P.5 A", time: "\u2014",   status: "Absent",  initials: "GM" }
  ],
  inventory: [
    { name: "Primary Mathematics Pupil's Book", id: "BK-0018",  class: "Books \u00b7 P.5",        amount: "120 copies", date: "Library store",    status: "In stock", initials: "\ud83d\udcda" },
    { name: "School Bus \u00b7 Toyota Coaster", id: "BUS-002",  class: "Route \u00b7 Kasese Town", amount: "28 seats",   date: "Driver: J. Kato", status: "Active",   initials: "\ud83d\ude8c" },
    { name: "Science textbook",                 id: "BK-0023",  class: "Books \u00b7 P.7",        amount: "8 copies",   date: "Library store",   status: "Low stock",initials: "\ud83d\udcd6" }
  ],
  boarding: [
    { name: "Amina K. Muhindo",   id: "KHA-2026-0142", class: "Girls' Dorm \u00b7 B12", amount: "UGX 450,000", date: "Term 3", status: "Assigned", initials: "AM" },
    { name: "Isaac T. Kule",      id: "KHA-2026-0129", class: "Boys' Dorm \u00b7 A08",  amount: "UGX 450,000", date: "Term 3", status: "Assigned", initials: "IK" },
    { name: "Peter S. Musinguzi", id: "KHA-2026-0102", class: "Boys' Dorm \u00b7 A11",  amount: "UGX 450,000", date: "Term 3", status: "Pending",  initials: "PM" }
  ],
  academics: [
    { name: "Mathematics",        id: "SUB-001", class: "P.4, P.5, P.6, P.7", amount: "Mr. R. Kisembo",  date: "7 periods/week", status: "Active", initials: "M" },
    { name: "English",            id: "SUB-002", class: "P.1\u2013P.7",        amount: "Mrs. J. Kabugho", date: "6 periods/week", status: "Active", initials: "E" },
    { name: "Integrated Science", id: "SUB-003", class: "P.5\u2013P.7",        amount: "Mr. P. Bwambale", date: "5 periods/week", status: "Active", initials: "S" }
  ]
};


/* ─────────────────────────────────────────────────────────────
   6. Data layer — db (localStorage) + custom fields
   ───────────────────────────────────────────────────────────── */

/* db — in-memory copy of all school records, synced to localStorage */
let db;
try { db = JSON.parse(localStorage.getItem("kasese-school-data")) || initialData; }
catch (e) { console.error("Could not load saved school data.", e); db = initialData; }

/* Persist the current db to localStorage */
const save = function () {
  try { localStorage.setItem("kasese-school-data", JSON.stringify(db)); }
  catch (e) { console.error("Could not save school data.", e); showToast("Could not save changes on this device."); }
};

/* Allowed input types and modules for custom fields */
const customFieldTypes   = ["text","number","date","textarea","select"];
const customFieldModules = ["Students","Teachers","Finance","Attendance","Academics","Property & Transport","Boarding"];

/* Custom field definitions — loaded and validated from localStorage */
let customFields = [];
try {
  var _cf = JSON.parse(localStorage.getItem("kasese-school-custom-fields")) || [];
  if (Array.isArray(_cf)) {
    /* Validate to prevent corrupted data from breaking the UI */
    customFields = _cf.filter(function (f) {
      return f && typeof f.id === "string" && typeof f.label === "string" &&
             customFieldTypes.indexOf(f.type) !== -1 && customFieldModules.indexOf(f.module) !== -1;
    });
  }
} catch (e) { console.error("Could not load saved custom fields.", e); }

/* Returns the custom fields that belong to a given module */
function customFieldsFor(module) {
  return customFields.filter(function (f) { return f.module === module; });
}


/* ─────────────────────────────────────────────────────────────
   7. Session state
   ───────────────────────────────────────────────────────────── */
let role        = sessionStorage.getItem("kasese-school-role") || "";
let page        = "Overview";   /* currently rendered page */
let pageHistory = [];           /* back-button stack */
let searchTerm  = "";           /* live table filter */
let toastTimer;                 /* handle for auto-dismissing the toast */

/* Auth form state (login page only) */
let authMode         = "signin";
let authError        = "";
let selectedAuthRole = "admin";
let pendingRecoveryCode = "";
let pendingRecoveryRole = "";
let pendingRecoveryUser = null;

/* Currently logged-in user */
let currentUser = {};
try { currentUser = JSON.parse(sessionStorage.getItem("kasese-school-user") || "{}"); }
catch (e) { console.error("Could not load the current account details.", e); }

/* Mount point — every page has <div id="root"></div> */
var root;
/* root is assigned in initLogin() / initPortal() after DOM is ready */


/* ─────────────────────────────────────────────────────────────
   8. Utility helpers
   ───────────────────────────────────────────────────────────── */

/* esc(value) — HTML-escape a value before inserting into innerHTML.
   Prevents XSS when rendering user-supplied data. */
const esc = function (v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

/* showToast(message) — brief notification at the bottom of the screen */
const showToast = function (msg) {
  var old = document.querySelector(".toast");
  if (old) old.remove();
  var t = document.createElement("div");
  t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.remove(); }, 2800);
};

/* initials(name) — up to 2 initials from a full name, e.g. "AM" from "Amina Muhindo" */
const initials = function (name) {
  return String(name || "").split(/\s+/).slice(0, 2).map(function (p) { return p[0] || ""; }).join("").toUpperCase();
};

/* avatarMarkup(row) — <span class="avatar"> with photo or initials */
const avatarMarkup = function (row) {
  var safe = typeof row.photo === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(row.photo);
  return '<span class="avatar">' + (safe ? '<img src="' + esc(row.photo) + '" alt="">' : esc(row.initials || initials(row.name || ""))) + '</span>';
};

/* searchableRecord(rec) — flatten all scalar + custom-field values for substring search */
function searchableRecord(rec) {
  var parts = Object.values(rec).filter(function (v) { return typeof v !== "object"; });
  var custom = Object.values(rec.customFields || {});
  return parts.concat(custom).join(" ").toLowerCase();
}

/* statusBadge(status) — coloured <span class="badge"> */
function statusBadge(status) {
  var cls = /absent|outstanding|low|inactive/i.test(status) ? "danger"
          : /late|partial|pending/i.test(status) ? "warning"
          : /active|paid|present|assigned|in stock/i.test(status) ? ""
          : "neutral";
  return '<span class="badge ' + cls + '">' + esc(status) + "</span>";
}

/* heading(title, desc, action?, actionLabel?) — standard page heading row */
function heading(title, desc, action, actionLabel) {
  action = action || ""; actionLabel = actionLabel || "";
  return '<div class="page-heading"><div><h1>' + title + "</h1><p>" + desc + "</p></div>"
    + (action ? '<div class="heading-actions"><button class="btn" data-action="' + action + '">\uff0b ' + actionLabel + "</button></div>" : "")
    + "</div>";
}


/* ─────────────────────────────────────────────────────────────
   9. Image / photo helper
   ─────────────────────────────────────────────────────────────
   Scales an uploaded photo to max 320 px and returns a JPEG data-URL.
   ───────────────────────────────────────────────────────────── */
function resizePhoto(file) {
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Choose an image file for the photo."));
  if (file.size > 8 * 1024 * 1024) return Promise.reject(new Error("Photo must be smaller than 8 MB."));
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = function () { reject(new Error("The selected photo could not be read.")); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { reject(new Error("The selected photo could not be opened.")); };
      img.onload = function () {
        var scale = Math.min(1, 320 / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width  = Math.max(1, Math.round(img.width  * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}


/* ─────────────────────────────────────────────────────────────
   10. Auth system
   ─────────────────────────────────────────────────────────────
   PBKDF2-SHA256 password hashing (150 000 iterations).
   Accounts stored in localStorage (browser-only prototype).
   ───────────────────────────────────────────────────────────── */

/* bytesToHex — Uint8Array to hex string */
function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

/* hashPassword — async PBKDF2 key derivation */
async function hashPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle)
    throw new Error("Secure password hashing is unavailable. Open this page on localhost or a secure school server.");
  var enc = new TextEncoder();
  var key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  var bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 150000, hash: "SHA-256" }, key, 256
  );
  return bytesToHex(bits);
}

/* saveLogin — store session and redirect to the portal file */
function saveLogin(roleKey, user) {
  sessionStorage.setItem("kasese-school-role", roleKey);
  sessionStorage.setItem("kasese-school-user", JSON.stringify({ fullName: user.fullName, email: user.email }));
  window.location.href = "portal-" + roleKey + ".html";
}

/* authenticate — login/signup form submit handler */
async function authenticate(event) {
  event.preventDefault();
  var form    = event.currentTarget;
  var data    = new FormData(form);
  var roleKey = String(data.get("role") || "");
  selectedAuthRole = roleKey;
  var email    = String(data.get("email") || "").trim().toLowerCase();
  var password = String(data.get("password") || "");
  var submit   = form.querySelector('button[type="submit"]');
  var isSignup = authMode === "signup";
  var isReset  = authMode === "forgot";
  authError = "";

  if (!roles[roleKey] || !email || (isReset || isSignup || password) && password.length < 8) {
    authError = "Choose a portal, enter a valid email address, and use a password of at least 8 characters.";
    loginScreen(); return;
  }
  submit.disabled = true;
  submit.textContent = isSignup ? "Creating account\u2026" : isReset ? "Resetting password\u2026" : "Signing in\u2026";

  try {
    var accounts;
    try { accounts = JSON.parse(localStorage.getItem("kasese-school-accounts") || "[]"); }
    catch (e) { throw new Error("Saved account data could not be read. Please contact the school administrator."); }
    if (!Array.isArray(accounts)) throw new Error("Saved account data is invalid. Please contact the school administrator.");

    if (isSignup) {
      var fullName        = String(data.get("fullName") || "").trim();
      var confirmPassword = String(data.get("confirmPassword") || "");
      if (!fullName || fullName.length > 80) throw new Error("Enter your full name (up to 80 characters).");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
      if (password !== confirmPassword) throw new Error("The passwords do not match.");
      if (accounts.some(function (a) { return a.role === roleKey && a.email === email; }))
        throw new Error("An account with this email already exists for the selected portal. Sign in instead.");
      var salt         = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      var passwordHash = await hashPassword(password, salt);
      var recoveryCode = createRecoveryCode();
      var recoverySalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      var recoveryHash = await hashPassword(recoveryCode, recoverySalt);
      var newAccount = { role: roleKey, email: email, fullName: fullName, salt: salt, passwordHash: passwordHash, recoverySalt: recoverySalt, recoveryHash: recoveryHash, createdAt: new Date().toISOString() };
      accounts.push(newAccount);
      storeAccounts(accounts);
      showRecoveryCode(recoveryCode, roleKey, newAccount);
      return;
    }

    if (isReset) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter the email address for your account.");
      var resetPassword = String(data.get("password") || "");
      var resetConfirm = String(data.get("confirmPassword") || "");
      var suppliedCode = String(data.get("recoveryCode") || "").trim().replace(/\s+/g, "").toUpperCase();
      if (resetPassword !== resetConfirm) throw new Error("The new passwords do not match.");
      if (resetPassword.length < 8) throw new Error("Your new password must be at least 8 characters.");
      if (!suppliedCode) throw new Error("Enter your recovery code.");
      var resetIndex = accounts.findIndex(function (a) { return a.role === roleKey && a.email === email; });
      if (resetIndex < 0) throw new Error("No account was found for this email and portal.");
      var resetAccount = accounts[resetIndex];
      if (!resetAccount.recoverySalt || !resetAccount.recoveryHash)
        throw new Error("This account has no recovery code yet. Sign in once with your current password to set one up.");
      var suppliedHash = await hashPassword(suppliedCode, resetAccount.recoverySalt);
      if (suppliedHash !== resetAccount.recoveryHash) throw new Error("That recovery code is not correct.");
      var nextRecoveryCode = createRecoveryCode();
      var nextPasswordSalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      var nextRecoverySalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      resetAccount.salt = nextPasswordSalt;
      resetAccount.passwordHash = await hashPassword(resetPassword, nextPasswordSalt);
      resetAccount.recoverySalt = nextRecoverySalt;
      resetAccount.recoveryHash = await hashPassword(nextRecoveryCode, nextRecoverySalt);
      accounts[resetIndex] = resetAccount;
      storeAccounts(accounts);
      showRecoveryCode(nextRecoveryCode, roleKey, resetAccount);
      return;
    }

    /* Sign-in */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter the email address you used to create your account.");
    var account = accounts.find(function (a) { return a.role === roleKey && a.email === email; });
    if (!account) throw new Error("No account was found for this email and portal. Create an account first or check your portal selection.");
    var hash = await hashPassword(password, account.salt);
    if (hash !== account.passwordHash) throw new Error("Incorrect password. Please try again.");
    if (!account.recoverySalt || !account.recoveryHash) {
      var setupCode = createRecoveryCode();
      var setupSalt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
      account.recoverySalt = setupSalt;
      account.recoveryHash = await hashPassword(setupCode, setupSalt);
      storeAccounts(accounts);
      showRecoveryCode(setupCode, roleKey, account);
      return;
    }
    saveLogin(roleKey, account);

  } catch (err) {
    console.error("Portal account sign-in failed.", err);
    authError = err.message || "The account request could not be completed.";
    loginScreen();
    var emailInput = document.getElementById("username");
    if (emailInput) { emailInput.value = email; emailInput.focus(); }
  }
}

/* Persist account updates and report storage failures to the login form. */
function storeAccounts(accounts) {
  try { localStorage.setItem("kasese-school-accounts", JSON.stringify(accounts)); }
  catch (e) { throw new Error("Could not save account changes on this device. Check available browser storage."); }
}

/* Recovery code is shown once and only its salted hash is stored. */
function createRecoveryCode() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16))).toUpperCase();
}

function showRecoveryCode(code, roleKey, user) {
  pendingRecoveryCode = code;
  pendingRecoveryRole = roleKey;
  pendingRecoveryUser = user;
  root.innerHTML = '<main class="login-screen">'
    + '<section class="login-brand"><div class="brand-lockup"><span class="crest">' + BADGE_SVG + "</span>"
    + "<span>Kasese Hills Academy<span class=\"school-subtitle\">SCHOOL MANAGEMENT SYSTEM</span></span></div>"
    + '<div class="brand-message"><div class="eyebrow">Keep your account safe</div>'
    + "<h1>Save your<br>recovery code.</h1>"
    + "<p>This code is needed if you forget your password. It is shown only once.</p></div>"
    + '<div class="login-footer">Kasese, Western Region \u00b7 Uganda</div></section>'
    + '<section class="login-panel"><div class="login-card"><h2>Your recovery code</h2>'
    + '<p>Write it down and keep it somewhere private and safe.</p>'
    + '<div class="recovery-warning">Anyone with this code can reset the password for this portal account. Do not share it.</div>'
    + '<div class="recovery-code" id="recoveryCode">' + esc(code) + "</div>"
    + '<button class="btn" id="continueAfterRecovery" type="button">I saved my code — continue →</button>'
    + '<button class="auth-link" id="copyRecoveryCode" type="button">Copy recovery code</button>'
    + "</div></section></main>";
  document.getElementById("copyRecoveryCode").addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(pendingRecoveryCode);
      showToast("Recovery code copied. Store it somewhere safe.");
    } catch (e) {
      showToast("Copy unavailable. Select and copy the recovery code.");
    }
  });
  document.getElementById("continueAfterRecovery").addEventListener("click", function () {
    var savedCode = pendingRecoveryCode;
    var savedRole = pendingRecoveryRole;
    var savedUser = pendingRecoveryUser;
    pendingRecoveryCode = "";
    pendingRecoveryRole = "";
    pendingRecoveryUser = null;
    if (!savedCode || !roles[savedRole] || !savedUser) {
      authError = "Could not complete account setup. Please sign in again.";
      authMode = "signin";
      loginScreen();
      return;
    }
    saveLogin(savedRole, savedUser);
  });
}


/* ─────────────────────────────────────────────────────────────
   11. Login screen
   ───────────────────────────────────────────────────────────── */

/* loginScreen() — renders the sign-in / sign-up form into #root */
function loginScreen() {
  var isSignup  = authMode === "signup";
  var isForgot  = authMode === "forgot";
  var roleOpts  = Object.keys(roles).map(function (k) {
    return '<option value="' + k + '"' + (selectedAuthRole === k ? " selected" : "") + ">" + esc(roles[k].label) + "</option>";
  }).join("");

  root.innerHTML = '<main class="login-screen">'
    /* Left brand panel */
    + '<section class="login-brand">'
    +   '<div class="brand-lockup"><span class="crest">' + BADGE_SVG + "</span>"
    +   "<span>Kasese Hills Academy<span class=\"school-subtitle\">SCHOOL MANAGEMENT SYSTEM</span></span></div>"
    +   '<div class="brand-message"><div class="eyebrow">A brighter future starts here</div>'
    +   "<h1>One school.<br>Working together.</h1>"
    +   "<p>Manage learning, people and school life from one simple place \u2014 built for our community in Kasese.</p></div>"
    +   '<div class="login-footer">Kasese, Western Region \u00b7 Uganda</div>'
    + "</section>"
    /* Right auth panel */
    + '<section class="login-panel"><div class="login-card">'
    +   "<h2>" + (isSignup ? "Create your account" : isForgot ? "Reset your password" : "Welcome back") + "</h2>"
    +   "<p>" + (isSignup ? "Create an account for your school portal." : isForgot ? "Enter your portal details and recovery code." : "Choose your portal and sign in to continue.") + "</p>"
    /* Tab switcher */
    +   (isForgot ? "" : '<div class="auth-switch" role="tablist" aria-label="Account actions">'
    +     '<button type="button" role="tab" aria-selected="' + (!isSignup) + '" class="' + (!isSignup ? "active" : "") + '" data-auth-mode="signin">Sign in</button>'
    +     '<button type="button" role="tab" aria-selected="' + isSignup   + '" class="' + ( isSignup ? "active" : "") + '" data-auth-mode="signup">Create account</button>'
    +   "</div>")
    /* Form */
    +   '<form id="loginForm" novalidate>'
    +     '<div class="field"><label for="roleSelect">Your portal</label>'
    +       '<select id="roleSelect" name="role" required>' + roleOpts + "</select></div>"
    +   (isSignup ? '<div class="field"><label for="accountName">Full name</label>'
    +     '<input id="accountName" name="fullName" autocomplete="name" maxlength="80" placeholder="Your full name" required></div>' : "")
    +   '<div class="field"><label for="username">Email address</label>'
    +     '<input id="username" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" required></div>'
    +   (isForgot ? '<div class="field"><label for="recoveryCode">Recovery code</label>'
    +     '<input id="recoveryCode" name="recoveryCode" autocomplete="off" autocapitalize="characters" placeholder="Enter the code you saved" required></div>' : "")
    +   '<div class="field"><label for="password">' + (isForgot ? "New password" : "Password") + '</label>'
    +     '<input id="password" name="password" type="password"'
    +     ' autocomplete="' + (isSignup || isForgot ? "new-password" : "current-password") + '"'
    +     ' minlength="8" placeholder="' + (isSignup || isForgot ? "At least 8 characters" : "Enter your password") + '" required></div>'
    +   (isSignup || isForgot ? '<div class="field"><label for="confirmPassword">Confirm ' + (isForgot ? "new " : "") + 'password</label>'
    +     '<input id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" placeholder="Enter your password again" required></div>' : "")
    +   (authError ? '<p class="auth-error" role="alert">' + esc(authError) + "</p>" : "")
    +   '<button class="btn" type="submit">' + (isSignup ? "Create account &amp; continue" : isForgot ? "Reset password" : "Sign in to your portal") + " <span>\u2192</span></button>"
    +   "</form>"
    +   (isForgot ? '<button class="auth-link" type="button" data-auth-mode="signin">Back to sign in</button>'
    : !isSignup ? '<button class="auth-link" type="button" data-auth-mode="forgot">Forgot your password?</button>' : "")
    +   '<div class="login-note"><strong>Account access</strong><br>'
    +   "This browser-only prototype stores accounts on this device. "
    +   "Password recovery requires the recovery code issued when you created your account. "
    +   "For real staff accounts and private pupil data, connect a secure server that verifies and approves portal access.</div>"
    + "</div></section>"
    + "</main>";

  /* Auth-mode tab buttons */
  root.querySelectorAll("[data-auth-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () { authMode = btn.dataset.authMode; authError = ""; loginScreen(); });
  });
  document.getElementById("roleSelect").addEventListener("change", function (e) { selectedAuthRole = e.target.value; });
  document.getElementById("loginForm").addEventListener("submit", authenticate);
}

/* initLogin() — entry point called by index.html.
   Skips the login page if the session is already active. */
function initLogin() {
  root = document.getElementById("root");
  var savedRole = sessionStorage.getItem("kasese-school-role");
  if (savedRole && roles[savedRole]) {
    window.location.href = "portal-" + savedRole + ".html";
    return;
  }
  loginScreen();
}


/* ─────────────────────────────────────────────────────────────
   12. App shell — sidebar + topbar + content wrapper
   ───────────────────────────────────────────────────────────── */

/* shell() — builds the full page chrome, then calls renderPage() */
function shell() {
  var current = roles[role] || roles.admin;
  var userInitials = esc(initials(currentUser.fullName || current.name));

  /* Build sidebar nav buttons (only the pages allowed for this role) */
  var navItems = current.pages.map(function (item) {
    return '<button class="nav-item ' + (page === item ? "active" : "") + '" data-page="' + esc(item) + '">'
      + '<span class="nav-icon">' + (iconMap[item] || "\u2022") + "</span>" + esc(item) + "</button>";
  }).join("");

  root.innerHTML = '<div class="app">'
    /* ── Sidebar ── */
    + '<aside class="sidebar" id="sidebar">'
    +   '<div class="brand-lockup"><span class="crest">' + BADGE_SVG + "</span>"
    +   "<span>Kasese Hills Academy<span class=\"school-subtitle\">SCHOOL MANAGEMENT</span></span></div>"
    +   '<div class="portal-label">' + esc(current.label) + " portal</div>"
    +   '<nav class="nav-list">' + navItems + "</nav>"
    +   '<div class="side-bottom">'
    +     '<div class="user-mini"><span class="avatar">' + userInitials + "</span>"
    +       "<span><strong>" + esc(currentUser.fullName || current.name) + "</strong>"
    +       "<small>" + esc(current.label) + " \u00b7 Kasese</small></span></div>"
    +     '<button class="nav-item" id="switchPortal"><span class="nav-icon">\u21aa</span>Switch portal / sign out</button>'
    +   "</div>"
    + "</aside>"
    /* ── Main area ── */
    + '<main class="main">'
    +   '<header class="topbar">'
    +     '<div class="top-left">'
    +       '<button class="icon-btn mobile-menu" id="menuToggle" aria-label="Open navigation">\u2630</button>'
    +       '<button class="icon-btn back-button" id="backButton" aria-label="Go back" title="Go back"' + (pageHistory.length ? "" : " disabled") + ">\u2190</button>"
    +       '<div class="crumb topbar-badge">' + BADGE_SVG
    +         + "<span>Kasese Hills Academy <span class=\"muted\">/</span> <strong>" + esc(page) + "</strong></span>"
    +       "</div>"
    +     "</div>"
    +     '<div class="top-actions">'
    +       '<span class="today">Monday, 5 October 2026</span>'
    +       '<button class="icon-btn" id="notifications" aria-label="Notifications">\u2667<i class="notification-dot"></i></button>'
    +       '<span class="avatar">' + userInitials + "</span>"
    +     "</div>"
    +   "</header>"
    +   '<section class="content" id="content"></section>'
    + "</main>"
    + "</div>";

  /* Bind shell event listeners */
  root.querySelectorAll("[data-page]").forEach(function (btn) {
    btn.addEventListener("click", function () { navigateTo(btn.dataset.page); });
  });
  document.getElementById("backButton").addEventListener("click", goBack);
  document.getElementById("switchPortal").addEventListener("click", function () {
    sessionStorage.removeItem("kasese-school-role");
    sessionStorage.removeItem("kasese-school-user");
    window.location.href = "index.html";
  });
  document.getElementById("menuToggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open");
  });
  document.getElementById("notifications").addEventListener("click", function () {
    showToast("You're all caught up.");
  });

  /* Delegate all content-area events */
  var content = document.getElementById("content");
  content.addEventListener("click",  onContentClick);
  content.addEventListener("input",  onContentInput);
  content.addEventListener("change", onContentInput);
  content.addEventListener("submit", onContentSubmit);

  renderPage();
}

/* render() — top-level dispatcher; redirects to login if session is invalid */
function render() {
  if (!role || !roles[role]) { window.location.href = "index.html"; return; }
  shell();
}

/* renderPage() — chooses the right page renderer for the active `page` variable */
function renderPage() {
  var content = document.getElementById("content");
  if (page === "Overview")                            { content.innerHTML = overviewPage();     return; }
  if (page === "Portal access")                       { content.innerHTML = portalAccessPage(); return; }
  if (page === "Custom fields" && role === "admin")   { content.innerHTML = customFieldsPage(); return; }
  if (page === "Reports")                             { content.innerHTML = reportsPage();      return; }
  if (page === "Timetables & Exams")                  { content.innerHTML = timetablePage();    return; }
  if (page === "Student transfers")                   { content.innerHTML = studentsPage(true); return; }
  if (["Students","Teachers","Finance","Attendance",
       "Property & Transport","Boarding","Academics"].indexOf(page) !== -1) {
    content.innerHTML = dataPage(page); return;
  }
  content.innerHTML = '<div class="access-denied panel"><div class="stat-icon">\u25a4</div>'
    + "<h2>" + esc(page) + "</h2><p class=\"muted\">Select a section from your portal navigation.</p></div>";
}


/* ─────────────────────────────────────────────────────────────
   13. Navigation
   ───────────────────────────────────────────────────────────── */

/* navigateTo — push current page to history stack, set new page, re-render */
function navigateTo(nextPage) {
  if (!nextPage || nextPage === page) return;
  pageHistory.push(page);
  page = nextPage;
  searchTerm = "";
  render();
}

/* goBack — pop previous page from history and navigate to it */
function goBack() {
  page = pageHistory.pop() || "Overview";
  searchTerm = "";
  render();
}


/* ─────────────────────────────────────────────────────────────
   14. Page renderers
   ───────────────────────────────────────────────────────────── */

/* overviewPage — dashboard with stat cards, fees chart, activity, attendance, quick actions */
function overviewPage() {
  var isAcc = role === "accountant";
  /* Accountant sees finance stats; all other roles see school-wide stats */
  var stats = isAcc
    ? [["Fees collected","UGX 48.6M","\u2191 8.4% this term","\uff04"],
       ["Outstanding fees","UGX 12.8M","Across 186 invoices","!"],
       ["Payments today","UGX 1.25M","24 transactions","\u2197"],
       ["Scholarships","UGX 3.2M","41 pupils supported","\u2606"]]
    : [["Total pupils","1,248","\u2191 4.2% from last term","\u2659"],
       ["Teaching staff","48","42 present today","\u2667"],
       ["Classes & streams","28","P.1 \u2013 P.7 \u00b7 2 streams","\u25a4"],
       ["Fees collected","UGX 48.6M","UGX 12.8M outstanding","\uff04"]];

  var statCards = stats.map(function (s) {
    return '<article class="stat-card"><div class="stat-top">'
      + '<span class="stat-label">' + s[0] + '</span><span class="stat-icon">' + s[3] + "</span></div>"
      + '<div class="stat-value">' + s[1] + "</div>"
      + '<div class="stat-foot"><span class="positive">' + (s[2].charAt(0) === "\u2191" ? "\u2197 " : "") + "</span>"
      + s[2].replace(/^\u2191 /, "") + "</div></article>";
  }).join("");

  /* Month labels for the SVG chart x-axis */
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"];
  var monthLabels = months.map(function (m, i) {
    return '<text x="' + (50 + i * 59) + '" y="181" class="chart-text">' + m + "</text>";
  }).join("");

  var todayStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return heading("Good morning \ud83d\udc4b", "Here's what's happening at Kasese Hills Academy today.")
    + '<div class="stats-grid">' + statCards + "</div>"
    + '<div class="dashboard-grid">'
    /* Fees chart */
    +   '<article class="panel"><div class="panel-head"><div><h2>Fees overview</h2><small>Collections across the school year</small></div>'
    +   '<div class="chart-legend"><span><i class="legend-dot"></i>Collected</span><span><i class="legend-dot orange"></i>Outstanding</span></div></div>'
    +   '<div class="chart-wrap"><svg viewBox="0 0 600 200" role="img" aria-label="Fees collected trend">'
    +     '<line x1="44" y1="25" x2="590" y2="25" class="chart-gridline"/><line x1="44" y1="68" x2="590" y2="68" class="chart-gridline"/>'
    +     '<line x1="44" y1="111" x2="590" y2="111" class="chart-gridline"/><line x1="44" y1="154" x2="590" y2="154" class="chart-gridline"/>'
    +     '<text x="2" y="28" class="chart-text">50M</text><text x="2" y="71" class="chart-text">35M</text>'
    +     '<text x="2" y="114" class="chart-text">20M</text><text x="2" y="157" class="chart-text">5M</text>'
    +     '<path d="M50 128 C95 118,105 96,145 102 S195 86,240 92 S288 58,335 72 S388 52,430 61 S482 34,530 46 S560 35,585 28" fill="none" stroke="#4263eb" stroke-width="3" stroke-linecap="round"/>'
    +     '<path d="M50 151 C90 143,107 138,145 141 S200 127,240 133 S292 119,335 127 S384 106,430 117 S484 98,530 106 S560 93,585 99" fill="none" stroke="#f0ad5a" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 5"/>'
    +     monthLabels + "</svg></div></article>"
    /* Activity feed */
    +   '<article class="panel"><div class="panel-head"><div><h2>Recent activity</h2><small>Latest school updates</small></div>'
    +   '<button class="btn btn-secondary btn-small" data-page="Reports">View all</button></div>'
    +   '<div class="activities">'
    +     '<div class="activity"><span class="activity-icon">\uff04</span><div><p><strong>UGX 350,000</strong> fees payment recorded for Amina Muhindo</p><time>12 minutes ago \u00b7 Finance</time></div></div>'
    +     '<div class="activity"><span class="activity-icon">\u2659</span><div><p><strong>New pupil registered</strong> in Primary 4, Stream A</p><time>48 minutes ago \u00b7 Registrar</time></div></div>'
    +     '<div class="activity"><span class="activity-icon">\u25a4</span><div><p><strong>Term 3 assessment marks</strong> updated for P.7</p><time>2 hours ago \u00b7 DOS</time></div></div>'
    +     '<div class="activity"><span class="activity-icon">\u25f7</span><div><p><strong>Morning attendance</strong> completed for 26 classes</p><time>Today, 8:15 AM \u00b7 Staff</time></div></div>'
    +   "</div></article>"
    + "</div>"
    /* Bottom: attendance + quick actions */
    + '<div class="bottom-grid">'
    +   '<article class="panel"><div class="panel-head"><div><h2>Today\'s attendance</h2><small>Pupils marked in \u00b7 ' + todayStr + "</small></div>"
    +   '<button class="btn btn-secondary btn-small" data-page="Attendance">View register \u2192</button></div>'
    +   '<div class="attendance-summary"><div class="donut"><div class="donut-center"><strong>92%</strong><span>present</span></div></div>'
    +   '<div class="attendance-keys">'
    +     '<div class="attendance-key"><span class="key-label"><i class="key-swatch"></i>Present</span><strong>1,148</strong></div>'
    +     '<div class="attendance-key"><span class="key-label"><i class="key-swatch late"></i>Late</span><strong>36</strong></div>'
    +     '<div class="attendance-key"><span class="key-label"><i class="key-swatch absent"></i>Absent</span><strong>64</strong></div>'
    +   "</div></div></article>"
    +   '<article class="panel"><div class="panel-head"><div><h2>Quick actions</h2><small>Common tasks</small></div></div>'
    +   '<div class="quick-actions">'
    +     '<button class="quick-action" data-action="addStudent"><span>\uff0b</span>Register pupil</button>'
    +     '<button class="quick-action" data-page="Finance"><span>\uff04</span>Record payment</button>'
    +     '<button class="quick-action" data-page="Attendance"><span>\u25f7</span>Take attendance</button>'
    +     '<button class="quick-action" data-page="Timetables &amp; Exams"><span>\u25a6</span>View timetable</button>'
    +   "</div></article>"
    + "</div>";
}

/* dataPage — generic section table page (Teachers, Finance, Attendance, …) */
function dataPage(section) {
  if (section === "Students" || section === "Student transfers") return studentsPage(section === "Student transfers");

  var confs = {
    Teachers:              { title: "Teachers & staff",       dataset: "teachers",   add: "Add teacher",    desc: "Teacher profiles, subjects, assigned classes and attendance.",                             cols: ["Teacher","Staff ID","Subjects","Classes assigned","Contact","Status"],                    stats: [["Teaching staff","48","Across the school"],["Present today","42","87.5% attendance"],["Subjects covered","16","Primary curriculum"]] },
    Finance:               { title: "Fees & finance",         dataset: "payments",   add: "Record payment", desc: "Track school fees, invoices, payments, balances and receipts.",                           cols: ["Pupil","Reference","Class","Amount","Date","Status"],                                      stats: [["Collected this term","UGX 48.6M","72% of expected fees"],["Outstanding","UGX 12.8M","186 pupil balances"],["Scholarships","UGX 3.2M","41 supported pupils"]] },
    Attendance:            { title: "Attendance register",    dataset: "attendance", add: "Mark attendance", desc: "Daily pupil attendance \u2014 present, absent and late.",                               cols: ["Pupil","Admission no.","Class","Check-in","Status"],                                       stats: [["Present","1,148","92% of enrolled pupils"],["Late","36","Requires follow-up"],["Absent","64","Parent notices pending"]] },
    "Property & Transport":{ title: "Property & transport",   dataset: "inventory",  add: "Add property",   desc: "Books, school buses, routes, drivers and pupil transport assignments.",                  cols: ["Item / vehicle","Asset ID","Category / route","Quantity / capacity","Location / driver","Status"], stats: [["Book titles","186","Library & class readers"],["School buses","4","3 active routes"],["Pupils on transport","112","UGX 8.4M transport fees"]] },
    Boarding:              { title: "Boarding & hostel",      dataset: "boarding",   add: "Assign pupil",   desc: "Dormitories, beds, pupil room assignments and boarding fees.",                           cols: ["Pupil","Admission no.","Dormitory & bed","Boarding fees","Term","Status"],                  stats: [["Boarding pupils","186","Across 4 dormitories"],["Beds available","24","210 total capacity"],["Boarding fees","UGX 42.3M","Term 3 billed"]] },
    Academics:             { title: "Academics & results",    dataset: "academics",  add: "Add subject",    desc: "Manage classes, streams, subjects, marks, grades and pupil report cards.",               cols: ["Subject","Subject ID","Classes","Assigned teacher","Timetable","Status"],                  stats: [["Classes","28","P.1 to P.7"],["Subjects","16","Core & co-curricular"],["Marks entered","84%","Term 3 assessments"]] }
  };
  var conf = confs[section];
  var allRows = db[conf.dataset] || [];
  var rows = allRows.filter(function (r) { return searchableRecord(r).indexOf(searchTerm.toLowerCase()) !== -1; });
  var lastStatus = conf.cols[conf.cols.length - 1] === "Status";
  var scFields   = customFieldsFor(section);
  var statIcons  = ["\u25a4", "\u25f7", "\u2197"];

  /* Summary stat mini-cards */
  var miniStats = conf.stats.map(function (s, i) {
    return '<article class="panel module-card"><span class="stat-icon">' + statIcons[i] + "</span><h3>" + s[1] + "</h3><p>" + s[0] + " \u00b7 " + s[2] + "</p></article>";
  }).join("");

  /* Finance notice */
  var financeNotice = section === "Finance"
    ? '<div class="notice">\ud83d\udca1 Payment reminders can be sent to parents by SMS or WhatsApp once a school messaging provider is connected.</div>'
    : "";

  /* Academics quick-links */
  var academicsLinks = section === "Academics"
    ? '<div class="record-links"><button class="record-link" data-action="marks">Enter marks</button>'
    +   '<button class="record-link" data-action="reportCard">Preview report card</button>'
    +   '<button class="record-link" data-page="Timetables &amp; Exams">Manage timetables &amp; exams</button>'
    +   '<button class="record-link" data-action="createClass">Create class / stream</button></div>'
    : "";

  /* Table heading */
  var tableHeading = section === "Finance" ? "Recent transactions &amp; invoices"
                   : section === "Attendance" ? "Today's pupil register" : "Records";

  /* Header cells */
  var headerCols = conf.cols.slice(0, lastStatus ? -1 : undefined).map(function (c) { return "<th>" + c + "</th>"; }).join("")
    + scFields.map(function (f) { return "<th>" + esc(f.label) + "</th>"; }).join("")
    + (lastStatus ? "<th>" + conf.cols[conf.cols.length - 1] + "</th>" : "");

  /* Data rows */
  var dataRows = rows.map(function (row) {
    var cells = tableValues(section, row).map(function (v) { return "<td>" + esc(v || "\u2014") + "</td>"; }).join("");
    var customCells = scFields.map(function (f) { return "<td>" + esc((row.customFields && row.customFields[f.id]) || "\u2014") + "</td>"; }).join("");
    return "<tr><td><div class=\"person\">" + avatarMarkup(row)
      + '<span><strong>' + esc(row.name) + "</strong><small>" + esc(row.id) + "</small></span></div></td>"
      + cells + customCells + (lastStatus ? "<td>" + statusBadge(row.status) + "</td>" : "") + "</tr>";
  }).join("");

  var tableBody = rows.length
    ? '<div class="table-scroll"><table><thead><tr>' + headerCols + "</tr></thead><tbody>" + dataRows + "</tbody></table></div>"
    : '<div class="empty-state"><strong>No matching records</strong>Try another search or add a record.</div>';

  return heading(conf.title, conf.desc, "add", conf.add)
    + '<div class="module-grid">' + miniStats + "</div>"
    + financeNotice + academicsLinks
    + '<section class="panel table-panel">'
    +   '<div class="table-toolbar"><h2>' + tableHeading + "</h2>"
    +   '<div class="table-filters">'
    +     '<input class="search-input" data-search placeholder="Search records\u2026" value="' + esc(searchTerm) + '">'
    +     '<select class="filter-select" aria-label="Filter records"><option>All records</option><option>Active</option><option>Pending</option></select>'
    +   "</div></div>"
    +   tableBody
    + "</section>";
}

/* tableValues — ordered cell values for a data row by section */
function tableValues(section, row) {
  var fieldMap = {
    Teachers: ["id","subject","class","phone"],
    Finance:  ["id","class","amount","date"],
    Attendance: ["id","class","time"],
    "Property & Transport": ["id","class","amount","date"],
    Boarding: ["id","class","amount","date"],
    Academics: ["id","class","amount","date"]
  };
  return (fieldMap[section] || []).map(function (f) { return row[f]; });
}

/* studentsPage — pupil register or student transfers */
function studentsPage(transfer) {
  transfer = transfer || false;
  var rows    = db.students.filter(function (r) { return searchableRecord(r).indexOf(searchTerm.toLowerCase()) !== -1; });
  var scFields = customFieldsFor("Students");

  var headerCols = "<th>Pupil</th><th>Admission no.</th><th>Class</th><th>Parent / guardian</th><th>Parent contact</th>"
    + scFields.map(function (f) { return "<th>" + esc(f.label) + "</th>"; }).join("") + "<th>Status</th>";

  var dataRows = rows.map(function (row) {
    var customCells = scFields.map(function (f) { return "<td>" + esc((row.customFields && row.customFields[f.id]) || "\u2014") + "</td>"; }).join("");
    return "<tr><td><div class=\"person\">" + avatarMarkup(row)
      + '<span><strong>' + esc(row.name) + "</strong><small>" + (row.gender ? esc(row.gender) + " \u00b7 " : "") + "Pupil profile</small></span></div></td>"
      + "<td>" + esc(row.id) + "</td>"
      + "<td>" + esc(row.class) + " \u00b7 Stream " + esc(row.stream) + "</td>"
      + "<td>" + esc(row.parent || "\u2014") + "</td>"
      + "<td>" + esc(row.phone  || "\u2014") + "</td>"
      + customCells + "<td>" + statusBadge(row.status) + "</td></tr>";
  }).join("");

  var tableBody = rows.length
    ? '<div class="table-scroll"><table><thead><tr>' + headerCols + "</tr></thead><tbody>" + dataRows + "</tbody></table></div>"
    : '<div class="empty-state"><strong>No matching pupils</strong>Try another search.</div>';

  return heading(
      transfer ? "Student transfers" : "Pupil register",
      transfer ? "Record pupils joining or leaving Kasese Hills Academy."
               : "Admissions, pupil profiles, parent contacts and class placement.",
      "addStudent",
      transfer ? "Record transfer" : "Register pupil"
    )
    + '<div class="module-grid">'
    +   '<article class="panel module-card"><span class="stat-icon">\u2659</span><h3>1,248</h3><p>Enrolled pupils \u00b7 624 girls, 624 boys</p></article>'
    +   '<article class="panel module-card"><span class="stat-icon">\u25a4</span><h3>28 classes</h3><p>Primary 1 to Primary 7 \u00b7 2 streams each</p></article>'
    +   '<article class="panel module-card"><span class="stat-icon">\u21c4</span><h3>12 transfers</h3><p>Processed this academic year</p></article>'
    + "</div>"
    + '<section class="panel table-panel">'
    +   '<div class="table-toolbar"><h2>' + (transfer ? "Transfer history" : "All pupils") + "</h2>"
    +   '<div class="table-filters"><input class="search-input" data-search placeholder="Search name, admission no.\u2026" value="' + esc(searchTerm) + '"></div></div>'
    +   tableBody
    + "</section>";
}

/* timetablePage — timetables & examinations */
function timetablePage() {
  var types = [
    ["Class timetable","Weekly lesson schedule by class and stream."],
    ["Teacher timetable","Teacher assignments and periods by day."],
    ["Subject timetable","Subject lessons, classrooms and weekly periods."],
    ["Examination timetable","Exam dates, rooms, classes and invigilators."],
    ["P.7 revision timetable","Primary 7 revision sessions and study periods."],
    ["Term calendar","School events, holidays and term dates."]
  ];
  var cards = types.map(function (t, i) {
    return '<article class="panel module-card"><span class="stat-icon">' + (i === 3 ? "\u270e" : "\u25a6") + "</span>"
      + "<h3>" + t[0] + "</h3><p>" + t[1] + "</p>"
      + '<div class="record-links"><button class="record-link" data-action="createTimetable">' + (i === 3 ? "Create exam schedule" : "Create / edit") + "</button>"
      + '<button class="record-link" data-action="print">Print preview</button></div></article>';
  }).join("");

  return heading("Timetables &amp; examinations",
      "Create and manage class, teacher, subject and examination timetables.",
      "createTimetable", "Create timetable")
    + '<div class="notice">The Director of Studies manages all timetables and examination schedules. Update schedules here for the whole school.</div>'
    + '<div class="module-grid">' + cards + "</div>"
    + '<section class="panel"><div class="panel-head"><h2>Today \u00b7 Monday</h2><span class="badge">Term 3 \u00b7 2026</span></div>'
    + '<div class="table-scroll"><table><thead><tr><th>Period</th><th>P.7 A</th><th>P.7 B</th><th>P.6 A</th><th>P.6 B</th></tr></thead><tbody>'
    + "<tr><td>08:00 \u2013 08:40</td><td>Mathematics \u00b7 R. Kisembo</td><td>English \u00b7 J. Kabugho</td><td>Science \u00b7 P. Bwambale</td><td>Social Studies \u00b7 M. Kule</td></tr>"
    + "<tr><td>08:40 \u2013 09:20</td><td>English \u00b7 J. Kabugho</td><td>Mathematics \u00b7 R. Kisembo</td><td>Social Studies \u00b7 M. Kule</td><td>Science \u00b7 P. Bwambale</td></tr>"
    + "<tr><td>09:20 \u2013 10:00</td><td>Science \u00b7 P. Bwambale</td><td>Social Studies \u00b7 M. Kule</td><td>Mathematics \u00b7 R. Kisembo</td><td>English \u00b7 J. Kabugho</td></tr>"
    + "</tbody></table></div></section>";
}

/* reportsPage — reports & report cards */
function reportsPage() {
  var types = [
    ["Academic performance","Marks, totals, averages, grades and class positions."],
    ["Attendance report","Daily, monthly and term attendance summaries."],
    ["Fees & balances","Collections, outstanding balances and receipts."],
    ["Pupil report cards","Term results with pupil passport photo and school badge watermark."],
    ["Enrollment report","Admissions, class lists and student transfers."],
    ["Transport & boarding","Bus routes, hostel occupancy and fee status."]
  ];
  var typeIcons = ["\u25a4","\u25f7","\uff04","\u25a7","\u2659","\u25a3"];
  var cards = types.map(function (t, i) {
    return '<article class="panel module-card"><span class="stat-icon">' + typeIcons[i] + "</span>"
      + "<h3>" + t[0] + "</h3><p>" + t[1] + "</p>"
      + '<div class="record-links"><button class="record-link" data-action="' + (i === 3 ? "reportCard" : "print") + '">'
      + (i === 3 ? "Preview report card" : "Open report") + "</button></div></article>";
  }).join("");

  var tableRows = ["P.7","P.6","P.5","P.4"].map(function (c, i) {
    return "<tr><td><strong>" + c + "</strong> \u00b7 Streams A &amp; B</td>"
      + "<td>" + (168 - i * 7) + "</td>"
      + "<td><span class=\"badge\">" + [92,84,76,65][i] + "% complete</span></td>"
      + "<td>" + [144,120,103,72][i] + " ready</td>"
      + "<td><button class=\"record-link\" data-action=\"reportCard\">Preview</button></td></tr>";
  }).join("");

  return heading("Reports &amp; report cards",
      "Review school performance and create pupil report cards for parents.",
      "reportCard", "Create report card")
    + '<div class="module-grid">' + cards + "</div>"
    + '<section class="panel"><div class="panel-head"><div><h2>Term 3 assessment progress</h2><small>Primary section \u00b7 2026</small></div></div>'
    + '<div class="table-scroll"><table><thead><tr><th>Class</th><th>Pupils</th><th>Marks entered</th><th>Report cards</th><th>Action</th></tr></thead>'
    + "<tbody>" + tableRows + "</tbody></table></div></section>";
}

/* portalAccessPage — lists all role portals (admin only) */
function portalAccessPage() {
  var cards = Object.keys(roles).map(function (key) {
    var r = roles[key];
    return '<article class="panel module-card"><span class="stat-icon">' + (iconMap[r.pages[1]] || "\u26bf") + "</span>"
      + "<h3>" + esc(r.label) + "</h3>"
      + "<p>" + r.pages.length + " sections \u00b7 " + r.pages.slice(1, 4).join(", ") + "</p>"
      + '<div class="record-links"><a class="record-link" href="portal-' + key + '.html" target="_blank">Open portal</a></div></article>';
  }).join("");

  return heading("Portal access", "Each school team has a separate portal and role-specific workspace.")
    + '<div class="notice">\ud83d\udd12 Real user accounts, password storage, role enforcement and access auditing require a secure server-side identity system.</div>'
    + '<div class="module-grid">' + cards + "</div>";
}

/* customFieldsPage — custom field management (admin only) */
function customFieldsPage() {
  var moduleOpts = customFieldModules.map(function (m) {
    return '<option value="' + esc(m) + '">' + esc(m) + "</option>";
  }).join("");

  var fieldRows = customFields.length
    ? '<div class="table-scroll"><table><thead><tr><th>Input label</th><th>Form</th><th>Type</th><th>Required</th><th>Action</th></tr></thead><tbody>'
      + customFields.map(function (f) {
          var typeLabel = f.type === "textarea" ? "Long text"
                        : f.type === "select"   ? "Dropdown \u00b7 " + (f.options || []).map(esc).join(", ")
                        : f.type;
          return "<tr><td><strong>" + esc(f.label) + "</strong></td><td>" + esc(f.module) + "</td><td>" + esc(typeLabel) + "</td>"
            + "<td>" + (f.required ? "Yes" : "No") + "</td>"
            + '<td><button class="record-link" data-action="removeCustomField" data-field-id="' + esc(f.id) + '">Remove</button></td></tr>';
        }).join("")
      + "</tbody></table></div>"
    : '<div class="empty-state"><strong>No custom inputs yet</strong>Create one above. It will appear in the selected form.</div>';

  return heading("Custom fields",
    "Add your own inputs to school forms. Custom fields appear when adding records and are saved with each record.")
    + '<section class="panel" style="margin-bottom:16px">'
    +   '<div class="panel-head"><div><h2>Create a custom input</h2><small>Choose which form should include your new field.</small></div></div>'
    +   '<form id="customFieldForm"><div class="form-grid">'
    +     '<div class="field"><label for="customModule">Add to form</label><select id="customModule" name="module" required>' + moduleOpts + "</select></div>"
    +     '<div class="field"><label for="customLabel">Input label</label><input id="customLabel" name="label" maxlength="60" placeholder="For example: House" required></div>'
    +     '<div class="field"><label for="customType">Input type</label><select id="customType" name="type" required>'
    +       '<option value="text">Short text</option><option value="number">Number</option><option value="date">Date</option>'
    +       '<option value="textarea">Long text</option><option value="select">Dropdown list</option>'
    +     "</select></div>"
    +     '<div class="field" id="customOptionsField" hidden><label for="customOptions">Dropdown choices</label>'
    +       '<input id="customOptions" name="options" maxlength="300" placeholder="Example: Red, Blue, Green">'
    +       '<small class="muted">Separate each choice with a comma.</small></div>'
    +     '<div class="field"><label><input type="checkbox" name="required"> Make this input required</label></div>'
    +   "</div><button class=\"btn\" type=\"submit\">\uff0b Create input</button></form>"
    + "</section>"
    + '<section class="panel table-panel">'
    +   '<div class="table-toolbar"><h2>Your custom inputs</h2><span class="muted">' + customFields.length + " created</span></div>"
    +   fieldRows
    + "</section>";
}


/* ─────────────────────────────────────────────────────────────
   15. Content-area event handlers
   ─────────────────────────────────────────────────────────────
   All events inside the content section are handled here via
   event delegation — one listener per event type on the container.
   ───────────────────────────────────────────────────────────── */

/* onContentSubmit — handles the "Create custom field" form */
function onContentSubmit(event) {
  if (event.target.id !== "customFieldForm") return;
  event.preventDefault();
  var fd      = new FormData(event.target);
  var label   = String(fd.get("label")   || "").trim();
  var module  = String(fd.get("module")  || "");
  var type    = String(fd.get("type")    || "");
  var options = String(fd.get("options") || "").split(",").map(function (o) { return o.trim(); }).filter(Boolean);

  if (!label || customFieldModules.indexOf(module) === -1 || customFieldTypes.indexOf(type) === -1) {
    showToast("Enter a label and choose a valid form and input type."); return;
  }
  if (customFields.filter(function (f) { return f.module === module; }).length >= 40) {
    showToast("This form already has the maximum of 40 custom inputs."); return;
  }
  if (type === "select" && !options.length) {
    showToast("Add at least one dropdown choice, separated by commas."); return;
  }
  if (type === "select" && (options.length > 20 || options.some(function (o) { return o.length > 60; }))) {
    showToast("Use up to 20 dropdown choices, each no longer than 60 characters."); return;
  }
  customFields.push({
    id: "field-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    label: label.slice(0, 60), module: module, type: type,
    required: fd.has("required"),
    options: type === "select" ? options : []
  });
  try { localStorage.setItem("kasese-school-custom-fields", JSON.stringify(customFields)); }
  catch (e) {
    customFields.pop();
    console.error("Could not save custom field configuration.", e);
    showToast("Could not save this input on this device. Check available browser storage."); return;
  }
  renderPage();
  showToast('"' + label + '" input added to ' + module + ".");
}

/* onContentInput — live search filter + custom-field type toggle */
function onContentInput(event) {
  /* Show/hide the dropdown-options field */
  if (event.target.id === "customType") {
    var opts = document.getElementById("customOptionsField");
    if (opts) opts.hidden = event.target.value !== "select";
  }
  /* Live table search — re-render with updated searchTerm */
  if (event.target.matches && event.target.matches("[data-search]")) {
    var cursor  = event.target.selectionStart;
    searchTerm  = event.target.value;
    var content = document.getElementById("content");
    var scrollY = window.scrollY;
    renderPage();
    var next = content.querySelector("[data-search]");
    if (next) { next.focus(); next.setSelectionRange(cursor, cursor); }
    window.scrollTo(0, scrollY);
  }
}

/* onContentClick — navigation, role switching, and action buttons */
function onContentClick(event) {
  /* Navigate to a page */
  var pageBtn = event.target.closest ? event.target.closest("[data-page]") : null;
  if (pageBtn) { navigateTo(pageBtn.dataset.page); return; }

  /* Role-switch (admin portal-access page) */
  var roleBtn = event.target.closest ? event.target.closest("[data-role]") : null;
  if (roleBtn) {
    role = roleBtn.dataset.role;
    sessionStorage.setItem("kasese-school-role", role);
    page = "Overview"; pageHistory = []; render(); return;
  }

  /* Action buttons */
  var actionBtn = event.target.closest ? event.target.closest("[data-action]") : null;
  if (!actionBtn) return;
  var action = actionBtn.dataset.action;

  /* Remove a custom field (admin only) */
  if (action === "removeCustomField" && role === "admin") {
    var field = customFields.find(function (f) { return f.id === actionBtn.dataset.fieldId; });
    if (!field) return;
    customFields = customFields.filter(function (f) { return f.id !== field.id; });
    try { localStorage.setItem("kasese-school-custom-fields", JSON.stringify(customFields)); }
    catch (e) {
      customFields.push(field);
      console.error("Could not remove custom field configuration.", e);
      showToast("Could not save this change on this device."); return;
    }
    renderPage();
    showToast('"' + field.label + '" input removed. Existing record values are retained.');
    return;
  }

  /* Open the matching modal */
  if (action === "addStudent") { openModal("student"); return; }
  if (action === "add") {
    var kind = page === "Students" || page === "Student transfers" ? "student"
             : page === "Teachers"   ? "teacher"
             : page === "Finance"    ? "payment"
             : page === "Attendance" ? "attendance"
             : page === "Academics"  ? "subject"
             : page === "Boarding"   ? "boarding"
             : "property";
    openModal(kind); return;
  }
  if (action === "createClass")     { openModal("class");    return; }
  if (action === "createTimetable") { openModal("timetable");return; }
  if (action === "marks")           { openModal("marks");    return; }
  if (action === "reportCard")      { openModal("report");   return; }
  if (action === "print")           { window.print();        return; }
}


/* ─────────────────────────────────────────────────────────────
   16. Modal / form system
   ─────────────────────────────────────────────────────────────
   openModal(kind) creates and injects a modal dialog.
   formDefinitions describes each form's fields.
   formModules maps each form kind to its custom-fields module.
   ───────────────────────────────────────────────────────────── */

/* formDefinitions — field descriptor: [key, label, inputType, required, options?, fullWidth?] */
var formDefinitions = {
  student:   { title: "Register pupil",                    label: "Save pupil profile",
    fields: [["name","Pupil full name","text",true],["gender","Gender","select",true,["Female","Male"]],
             ["id","Admission number","text",true],["class","Class","select",true,["P.1","P.2","P.3","P.4","P.5","P.6","P.7"]],
             ["stream","Stream","select",true,["A","B"]],["parent","Parent / guardian","text",true],
             ["phone","Parent phone (Uganda)","tel",true],["address","Home address / village","text",false],
             ["medical","Medical information / allergies","textarea",false,null,true]] },
  teacher:   { title: "Register teacher",                  label: "Save teacher",
    fields: [["name","Teacher full name","text",true],["id","Staff ID","text",true],
             ["subject","Subjects taught","text",true],["class","Classes assigned","text",true],
             ["phone","Phone number","tel",true],["status","Attendance status","select",false,["Present","Absent","On leave"]]] },
  payment:   { title: "Record school fees payment",        label: "Save payment & receipt",
    fields: [["name","Pupil full name","text",true],["id","Receipt number","text",true],
             ["class","Class & stream","text",true],["amount","Amount (UGX)","number",true],
             ["date","Payment date","date",true],["status","Payment status","select",true,["Paid","Partial","Outstanding"]]] },
  subject:   { title: "Add subject",                       label: "Save subject",
    fields: [["name","Subject name","text",true],["id","Subject code","text",true],
             ["class","Classes","text",true],["amount","Assigned teacher","text",true],
             ["date","Periods per week","text",false],["status","Status","select",true,["Active","Inactive"]]] },
  property:  { title: "Register book, vehicle or property",label: "Save property",
    fields: [["name","Item / vehicle name","text",true],["id","Asset ID","text",true],
             ["class","Category / route","text",true],["amount","Quantity / capacity","text",true],
             ["date","Location / driver","text",false],["status","Status","select",true,["In stock","Active","Low stock","Maintenance"]]] },
  boarding:  { title: "Assign boarding pupil",             label: "Save assignment",
    fields: [["name","Pupil full name","text",true],["id","Admission number","text",true],
             ["class","Dormitory & bed","text",true],["amount","Boarding fees (UGX)","text",true],
             ["date","Term","text",true],["status","Assignment status","select",true,["Assigned","Pending"]]] },
  attendance:{ title: "Mark pupil attendance",             label: "Save attendance",
    fields: [["name","Pupil full name","text",true],["id","Admission number","text",true],
             ["class","Class & stream","text",true],["time","Check-in time","time",false],
             ["status","Attendance","select",true,["Present","Absent","Late"]]] },
  class:     { title: "Create class or stream",            label: "Save class",
    fields: [["name","Class name","text",true],["id","Stream","select",true,["A","B"]],
             ["class","Class teacher","text",true],["amount","Class capacity","number",false]] },
  timetable: { title: "Create timetable entry",            label: "Save timetable entry",
    fields: [["name","Class / stream","text",true],["id","Subject","text",true],
             ["class","Teacher","text",true],["amount","Day & period","text",true],["date","Room","text",false]] },
  marks:     { title: "Enter assessment marks",            label: "Save marks",
    fields: [["name","Pupil admission number","text",true],["id","Subject","text",true],
             ["class","Class / stream","text",true],["amount","Marks (out of 100)","number",true],["date","Assessment","text",true]] },
  report:    { title: "Pupil report card preview",         label: "Print report card",
    fields: [["name","Pupil name","text",true],["id","Admission number","text",true],
             ["class","Class & stream","text",true],["amount","Term average (%)","number",true],["date","Term / academic year","text",true]] }
};

var formModules = {
  student: "Students", teacher: "Teachers", payment: "Finance",
  attendance: "Attendance", subject: "Academics", marks: "Academics",
  property: "Property & Transport", boarding: "Boarding"
};

/* renderCustomInput — builds HTML for a single custom field inside a modal */
function renderCustomInput(field) {
  var id       = "custom-" + field.id;
  var name     = "custom_" + field.id;
  var req      = field.required ? " required" : "";
  var labelTxt = esc(field.label) + (field.required ? " *" : "");
  if (field.type === "select") {
    return '<div class="field"><label for="' + esc(id) + '">' + labelTxt + "</label>"
      + '<select id="' + esc(id) + '" name="' + esc(name) + '"' + req + '><option value="">Choose\u2026</option>'
      + (field.options || []).map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("")
      + "</select></div>";
  }
  if (field.type === "textarea") {
    return '<div class="field full"><label for="' + esc(id) + '">' + labelTxt + "</label>"
      + '<textarea id="' + esc(id) + '" name="' + esc(name) + '" placeholder="' + esc(field.label) + '"' + req + "></textarea></div>";
  }
  return '<div class="field"><label for="' + esc(id) + '">' + labelTxt + "</label>"
    + '<input id="' + esc(id) + '" name="' + esc(name) + '" type="' + esc(field.type) + '" placeholder="' + esc(field.label) + '"' + req + "></div>";
}

/* openModal — builds and injects the modal for the given form kind */
function openModal(kind) {
  var def = formDefinitions[kind];
  var customInputs = customFieldsFor(formModules[kind] || "").map(renderCustomInput).join("");

  /* Build field HTML for each standard field definition */
  var fieldHTML = def.fields.map(function (f) {
    var key = f[0], label = f[1], type = f[2], req = f[3], options = f[4], full = f[5];
    var reqAttr = req ? " required" : "";
    var cls = full ? "full" : "";
    var input;
    if (type === "select") {
      input = '<select id="field-' + key + '" name="' + key + '"' + reqAttr + ">"
        + (options || []).map(function (v) { return "<option>" + v + "</option>"; }).join("")
        + "</select>";
    } else if (type === "textarea") {
      input = '<textarea id="field-' + key + '" name="' + key + '" placeholder="' + label + '"' + reqAttr + "></textarea>";
    } else {
      input = '<input id="field-' + key + '" name="' + key + '" type="' + type + '" placeholder="' + label + '"' + reqAttr
        + (key === "amount" && type === "number" ? ' min="0" max="100000000"' : "") + ">";
    }
    return '<div class="field ' + cls + '"><label for="field-' + key + '">' + label + (req ? " *" : "") + "</label>" + input + "</div>";
  }).join("");

  /* Extra elements specific to certain form kinds */
  var extras = "";
  if (kind === "student") extras += '<div class="field"><label for="photo">Pupil passport photo</label><input id="photo" name="photo" type="file" accept="image/*"></div>';
  if (kind === "teacher") extras += '<div class="field"><label for="photo">Teacher profile photo</label><input id="photo" name="photo" type="file" accept="image/*"></div>';
  if (kind === "report")  extras += '<div class="notice" style="display:flex;gap:12px;align-items:center">'
    + '<span style="width:38px;height:38px;flex-shrink:0">' + BADGE_SVG + "</span>"
    + "<span>Report card includes the <strong>Kasese Hills Academy</strong> school badge and a pupil passport photo area. "
    + "Connect approved pupil photos before issuing official report cards.</span></div>";

  var wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">'
    + '<div class="modal-head"><h2 id="modalTitle">' + def.title + "</h2>"
    + '<button class="icon-btn" type="button" data-close aria-label="Close dialog">\u00d7</button></div>'
    + '<form id="recordForm"><div class="modal-body">'
    + '<div class="form-grid">' + fieldHTML + customInputs + "</div>"
    + extras
    + '<div class="modal-actions"><button type="button" class="btn btn-secondary" data-close>Cancel</button>'
    + '<button type="submit" class="btn">' + def.label + "</button></div>"
    + "</div></form></div>";

  document.body.appendChild(wrap);

  /* Close handlers */
  wrap.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { wrap.remove(); });
  });
  wrap.addEventListener("click", function (e) { if (e.target === wrap) wrap.remove(); });

  /* Form submission */
  wrap.querySelector("#recordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var values = Object.fromEntries(new FormData(e.currentTarget).entries());

    /* Separate custom-field values from standard values */
    var customValues = {};
    customFieldsFor(formModules[kind] || "").forEach(function (field) {
      var key = "custom_" + field.id;
      if (Object.hasOwn(values, key)) { customValues[field.id] = values[key]; delete values[key]; }
    });

    /* Handle photo upload (async) */
    var photoFile = wrap.querySelector("#photo") && wrap.querySelector("#photo").files[0];
    delete values.photo;

    Promise.resolve(photoFile ? resizePhoto(photoFile) : null).then(function (photoData) {
      if (photoData) values.photo = photoData;

      /* Special-case forms that don't persist to db */
      if (kind === "report")     { wrap.remove(); window.print(); showToast("Report card print preview opened."); return; }
      if (kind === "marks")      { wrap.remove(); showToast("Marks saved in this preview session."); return; }
      if (kind === "class" || kind === "timetable") {
        wrap.remove(); showToast((kind === "class" ? "Class" : "Timetable entry") + " saved in this preview session."); return;
      }

      /* Map form kind to db dataset key */
      var dataKeyMap = { student:"students", teacher:"teachers", payment:"payments",
                         attendance:"attendance", subject:"academics", property:"inventory", boarding:"boarding" };
      var dataKey = dataKeyMap[kind];

      var record = Object.assign({}, values,
        Object.keys(customValues).length ? { customFields: customValues } : {},
        { initials: initials(values.name || "New record"), status: values.status || "Active" },
        kind === "student" ? { stream: values.stream || "A" } : {}
      );

      db[dataKey].unshift(record);
      save();
      wrap.remove();
      renderPage();
      showToast(kind === "payment" ? "Payment recorded. Receipt " + values.id + " is ready." : "Record added successfully.");
    }).catch(function (err) {
      console.error("Could not save the selected profile photo.", err);
      showToast(err.message || "Could not save the selected profile photo.");
    });
  });

  /* Auto-focus first input */
  var firstInput = wrap.querySelector("input,select,textarea");
  if (firstInput) firstInput.focus();
}


/* ─────────────────────────────────────────────────────────────
   17. Portal entry point
   ─────────────────────────────────────────────────────────────
   Called by each portal HTML file:  initPortal("admin")
   Called by the login page:         initLogin()
   ───────────────────────────────────────────────────────────── */

/**
 * initPortal(roleKey)
 * Validates the session, sets global `role`, and renders the portal shell.
 * If the stored session role doesn't match roleKey, redirects to index.html.
 */
function initPortal(roleKey) {
  root = document.getElementById("root");
  var sessionRole = sessionStorage.getItem("kasese-school-role");
  try { currentUser = JSON.parse(sessionStorage.getItem("kasese-school-user") || "{}"); }
  catch (e) { currentUser = {}; }

  if (!sessionRole || sessionRole !== roleKey) {
    /* No matching session — send to login */
    window.location.href = "index.html";
    return;
  }
  role = roleKey;
  render();
}
