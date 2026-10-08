/**
 * staff-team.js — Five Star Model School
 * ========================================
 * Shared staff directory used by every portal.
 * 
 * HOW TO ADD REAL PHOTOS LATER:
 * - Each staff member has a "photo" field — set it to the path of their image
 *   e.g.  photo: "photos/robert_bwambale.jpg"
 * - Place photos inside a /photos/ folder next to the portal files
 * - If photo is "" (empty), the system shows a coloured circle with initials
 *
 * Exports:
 *   window.SCHOOL_TEAM        — array of all staff objects
 *   window.renderSchoolTeam() — returns the full HTML for the team page
 *   window.wireTeamPage()     — attaches search/filter/click events after render
 */
"use strict";

/* ─────────────────────────────────────────────────────────────
   STAFF DATA  (35 staff members)
   To add a real photo later, set photo: "photos/filename.jpg"
   Leave photo: "" to show the coloured initials avatar.
───────────────────────────────────────────────────────────── */
window.SCHOOL_TEAM = [

  /* ── LEADERSHIP ── */
  { id:"ST001", photo:"",
    name:"Mr. Robert Bwambale",      role:"Head Teacher / Principal",
    dept:"Administration",            phone:"+256 772 100 001",
    email:"principal@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2010",
    color:"#1a3d6b", initials:"RB",
    quote:"Education is the passport to the future." },

  { id:"ST002", photo:"",
    name:"Mrs. Grace Muhindo",        role:"Deputy Head Teacher",
    dept:"Administration",            phone:"+256 772 100 002",
    email:"deputy@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2012",
    color:"#2d6abf", initials:"GM",
    quote:"Every child deserves a champion." },

  { id:"ST003", photo:"",
    name:"Ms. Harriet Nyakato",       role:"Director of Studies (DOS)",
    dept:"Academics",                 phone:"+256 772 100 003",
    email:"dos@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2013",
    color:"#7c3aed", initials:"HN",
    quote:"Excellence is a journey, not a destination." },

  { id:"ST004", photo:"",
    name:"Mr. Patrick Kule",          role:"School Administrator",
    dept:"Administration",            phone:"+256 772 100 004",
    email:"admin@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2011",
    color:"#4863de", initials:"PK",
    quote:"Organisation is the key to progress." },

  { id:"ST005", photo:"",
    name:"Mrs. Alice Biira",          role:"Admissions Registrar",
    dept:"Registry",                  phone:"+256 772 100 005",
    email:"registrar@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2015",
    color:"#168560", initials:"AB",
    quote:"Every pupil who walks through our doors is a future leader." },

  { id:"ST006", photo:"",
    name:"Mr. David Mumbere",         role:"School Accountant",
    dept:"Finance",                   phone:"+256 772 100 006",
    email:"accounts@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2014",
    color:"#b45309", initials:"DM",
    quote:"Transparency builds trust." },

  /* ── NURSERY / LOWER PRIMARY ── */
  { id:"ST007", photo:"",
    name:"Mrs. Judith Kabaseke",      role:"Class Teacher — Baby class",
    dept:"Lower Primary",             phone:"+256 772 100 007",
    email:"j.kabaseke@fivestarschool.ac.ug",
    subjects:"All nursery subjects",  classes:"Baby class",  joined:"2016",
    color:"#0369a1", initials:"JK",
    quote:"Little minds, big dreams." },

  { id:"ST008", photo:"",
    name:"Ms. Esther Masika",         role:"Class Teacher — Middle class",
    dept:"Lower Primary",             phone:"+256 772 100 008",
    email:"e.masika@fivestarschool.ac.ug",
    subjects:"All nursery subjects",  classes:"Middle class", joined:"2018",
    color:"#be185d", initials:"EM",
    quote:"Play is the work of childhood." },

  { id:"ST009", photo:"",
    name:"Mr. Joshua Kiwanuka",       role:"Class Teacher — Top class",
    dept:"Lower Primary",             phone:"+256 772 100 009",
    email:"j.kiwanuka@fivestarschool.ac.ug",
    subjects:"All nursery subjects",  classes:"Top class",   joined:"2017",
    color:"#0f766e", initials:"JK",
    quote:"Patience and persistence make great teachers." },

  { id:"ST010", photo:"",
    name:"Mrs. Rose Kyomugisha",      role:"Class Teacher — P.1",
    dept:"Lower Primary",             phone:"+256 772 100 010",
    email:"r.kyomugisha@fivestarschool.ac.ug",
    subjects:"English, Mathematics, MTC", classes:"P.1",    joined:"2016",
    color:"#168560", initials:"RK",
    quote:"A good teacher inspires hope." },

  { id:"ST011", photo:"",
    name:"Mr. Samuel Kato",           role:"Class Teacher — P.2",
    dept:"Lower Primary",             phone:"+256 772 100 011",
    email:"s.kato@fivestarschool.ac.ug",
    subjects:"English, Mathematics, Science", classes:"P.2", joined:"2019",
    color:"#4863de", initials:"SK",
    quote:"Knowledge is power — share it freely." },

  { id:"ST012", photo:"",
    name:"Ms. Margret Tibamwenda",    role:"Class Teacher — P.3",
    dept:"Lower Primary",             phone:"+256 772 100 012",
    email:"m.tibamwenda@fivestarschool.ac.ug",
    subjects:"English, Mathematics, SST", classes:"P.3",    joined:"2020",
    color:"#7c3aed", initials:"MT",
    quote:"Every lesson is a seed planted for tomorrow." },

  /* ── UPPER PRIMARY ── */
  { id:"ST013", photo:"",
    name:"Mr. Gerald Mutesasira",     role:"Class Teacher — P.4 / Science",
    dept:"Upper Primary",             phone:"+256 772 100 013",
    email:"g.mutesasira@fivestarschool.ac.ug",
    subjects:"Science, Mathematics",  classes:"P.4",         joined:"2015",
    color:"#0369a1", initials:"GM",
    quote:"Science makes sense of the world around us." },

  { id:"ST014", photo:"",
    name:"Mrs. Faith Nanyonga",       role:"Class Teacher — P.5 / English",
    dept:"Upper Primary",             phone:"+256 772 100 014",
    email:"f.nanyonga@fivestarschool.ac.ug",
    subjects:"English, Creative Arts", classes:"P.5",        joined:"2014",
    color:"#be185d", initials:"FN",
    quote:"Language is the road map of a culture." },

  { id:"ST015", photo:"",
    name:"Mr. Isaac Byaruhanga",      role:"Class Teacher — P.6 / Maths",
    dept:"Upper Primary",             phone:"+256 772 100 015",
    email:"i.byaruhanga@fivestarschool.ac.ug",
    subjects:"Mathematics, ICT",      classes:"P.6",         joined:"2013",
    color:"#1a3d6b", initials:"IB",
    quote:"Mathematics is the language of the universe." },

  { id:"ST016", photo:"",
    name:"Mrs. Christine Kabugho",    role:"Class Teacher — P.7",
    dept:"Upper Primary",             phone:"+256 772 100 016",
    email:"c.kabugho@fivestarschool.ac.ug",
    subjects:"English, SST, CRE",    classes:"P.7",         joined:"2012",
    color:"#168560", initials:"CK",
    quote:"P.7 is not a destination — it is a launchpad." },

  /* ── SUBJECT SPECIALISTS ── */
  { id:"ST017", photo:"",
    name:"Mr. Emmanuel Kanyonyi",     role:"Physical Education Teacher",
    dept:"Sports & PE",               phone:"+256 772 100 017",
    email:"e.kanyonyi@fivestarschool.ac.ug",
    subjects:"Physical Education, Health", classes:"P.1–P.7", joined:"2016",
    color:"#b45309", initials:"EK",
    quote:"A healthy body feeds a healthy mind." },

  { id:"ST018", photo:"",
    name:"Ms. Vivian Naturinda",      role:"Music & Art Teacher",
    dept:"Creative Arts",             phone:"+256 772 100 018",
    email:"v.naturinda@fivestarschool.ac.ug",
    subjects:"Music, Art & Craft",    classes:"Baby–P.7",    joined:"2019",
    color:"#7c3aed", initials:"VN",
    quote:"Creativity is intelligence having fun." },

  { id:"ST019", photo:"",
    name:"Mr. Henry Ssemakula",       role:"ICT Teacher",
    dept:"Technology",                phone:"+256 772 100 019",
    email:"h.ssemakula@fivestarschool.ac.ug",
    subjects:"ICT, Mathematics",      classes:"P.4–P.7",     joined:"2020",
    color:"#0f766e", initials:"HS",
    quote:"Technology is the tool; character is the compass." },

  { id:"ST020", photo:"",
    name:"Mrs. Lydia Muhwezi",        role:"Religious Education Teacher",
    dept:"Humanities",                phone:"+256 772 100 020",
    email:"l.muhwezi@fivestarschool.ac.ug",
    subjects:"CRE, IRE, SST",        classes:"P.1–P.7",     joined:"2017",
    color:"#b45309", initials:"LM",
    quote:"Values form the foundation of every great person." },

  { id:"ST021", photo:"",
    name:"Mr. Daniel Wesonga",        role:"Luganda Teacher",
    dept:"Languages",                 phone:"+256 772 100 021",
    email:"d.wesonga@fivestarschool.ac.ug",
    subjects:"Luganda, Local Language", classes:"P.1–P.7",  joined:"2018",
    color:"#4863de", initials:"DW",
    quote:"A language is a window to a culture." },

  { id:"ST022", photo:"",
    name:"Ms. Sandra Nabirye",        role:"Library Teacher",
    dept:"Library",                   phone:"+256 772 100 022",
    email:"s.nabirye@fivestarschool.ac.ug",
    subjects:"Reading, Library skills", classes:"All classes", joined:"2021",
    color:"#0369a1", initials:"SN",
    quote:"Reading is dreaming with open eyes." },

  /* ── SUPPORT STAFF ── */
  { id:"ST023", photo:"",
    name:"Mr. Francis Tumwesige",     role:"Property Officer",
    dept:"Property",                  phone:"+256 772 100 023",
    email:"property@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2015",
    color:"#0369a1", initials:"FT",
    quote:"Good maintenance keeps the school running." },

  { id:"ST024", photo:"",
    name:"Mr. Alex Asiimwe",          role:"School Bus Driver",
    dept:"Transport",                 phone:"+256 772 100 024",
    email:"a.asiimwe@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2016",
    color:"#374151", initials:"AA",
    quote:"Safety first, always." },

  { id:"ST025", photo:"",
    name:"Mr. Peter Mugisa",          role:"School Bus Driver",
    dept:"Transport",                 phone:"+256 772 100 025",
    email:"p.mugisa@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2018",
    color:"#374151", initials:"PM",
    quote:"Every trip is a safe trip." },

  { id:"ST026", photo:"",
    name:"Mrs. Prossy Asiimwe",       role:"School Nurse",
    dept:"Health",                    phone:"+256 772 100 026",
    email:"nurse@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2017",
    color:"#be185d", initials:"PA",
    quote:"Healthy pupils learn better." },

  { id:"ST027", photo:"",
    name:"Mrs. Beatrice Kamuhabwa",   role:"Head Matron",
    dept:"Boarding",                  phone:"+256 772 100 027",
    email:"matron@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2014",
    color:"#be185d", initials:"BK",
    quote:"A home away from home for every child." },

  { id:"ST028", photo:"",
    name:"Mr. Wilson Kiggundu",       role:"Assistant House Master",
    dept:"Boarding",                  phone:"+256 772 100 028",
    email:"w.kiggundu@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2019",
    color:"#1a3d6b", initials:"WK",
    quote:"Discipline and care go hand in hand." },

  { id:"ST029", photo:"",
    name:"Ms. Annet Kobusinge",       role:"School Secretary",
    dept:"Administration",            phone:"+256 772 100 029",
    email:"secretary@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2016",
    color:"#4863de", initials:"AK",
    quote:"Behind every great school is a great secretary." },

  { id:"ST030", photo:"",
    name:"Mr. Godfrey Baluku",        role:"School Counsellor",
    dept:"Welfare",                   phone:"+256 772 100 030",
    email:"counsellor@fivestarschool.ac.ug",
    subjects:"Guidance & Counselling", classes:"All classes", joined:"2020",
    color:"#0f766e", initials:"GB",
    quote:"Every child deserves to be heard." },

  { id:"ST031", photo:"",
    name:"Mrs. Juliet Muhindo",       role:"Catering Officer",
    dept:"Catering",                  phone:"+256 772 100 031",
    email:"catering@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2015",
    color:"#b45309", initials:"JM",
    quote:"Good nutrition fuels great learning." },

  { id:"ST032", photo:"",
    name:"Mr. Charles Mwesigwa",      role:"Security Officer",
    dept:"Security",                  phone:"+256 772 100 032",
    email:"security@fivestarschool.ac.ug",
    subjects:"",  classes:"",         joined:"2013",
    color:"#374151", initials:"CM",
    quote:"A safe school is a learning school." },

  { id:"ST033", photo:"",
    name:"Ms. Patience Katusiime",    role:"P.7 Assistant Teacher",
    dept:"Upper Primary",             phone:"+256 772 100 033",
    email:"p.katusiime@fivestarschool.ac.ug",
    subjects:"Mathematics, Science",  classes:"P.7",         joined:"2022",
    color:"#168560", initials:"PK",
    quote:"Consistency is the key to mastery." },

  { id:"ST034", photo:"",
    name:"Mr. Ronald Tibenda",        role:"Games Master",
    dept:"Sports & PE",               phone:"+256 772 100 034",
    email:"r.tibenda@fivestarschool.ac.ug",
    subjects:"Sports, PE",            classes:"P.4–P.7",     joined:"2021",
    color:"#b45309", initials:"RT",
    quote:"Sport builds character, discipline and teamwork." },

  { id:"ST035", photo:"",
    name:"Mrs. Fortunate Bamuturaki", role:"Social Studies Teacher",
    dept:"Humanities",                phone:"+256 772 100 035",
    email:"f.bamuturaki@fivestarschool.ac.ug",
    subjects:"SST, CRE",              classes:"P.5–P.7",     joined:"2018",
    color:"#7c3aed", initials:"FB",
    quote:"Understanding our world makes us better citizens." }
];

/* ─────────────────────────────────────────────────────────────
   renderSchoolTeam()
   Returns full HTML string for the "School team" page.
   Called by every portal when the user navigates to "School team".
───────────────────────────────────────────────────────────── */
window.renderSchoolTeam = function () {

  /* Unique sorted department list for the filter dropdown */
  var depts = [];
  SCHOOL_TEAM.forEach(function (s) {
    if (depts.indexOf(s.dept) === -1) depts.push(s.dept);
  });
  depts.sort();

  /* Dept → accent colour map */
  var DC = {
    "Administration":"#4863de","Academics":"#7c3aed","Registry":"#168560",
    "Finance":"#b45309","Lower Primary":"#0369a1","Upper Primary":"#1a3d6b",
    "Sports & PE":"#b45309","Creative Arts":"#7c3aed","Technology":"#0f766e",
    "Humanities":"#be185d","Languages":"#4863de","Library":"#0369a1",
    "Property":"#0369a1","Transport":"#374151","Health":"#be185d",
    "Boarding":"#be185d","Welfare":"#0f766e","Catering":"#b45309",
    "Security":"#374151"
  };

  /* ── CSS (injected once) ── */
  var css = '<style id="team-css">'
    /* Overall grid */
    + '.team-pg .pg-hd{display:flex;align-items:flex-end;justify-content:space-between;'
    +   'gap:12px;flex-wrap:wrap;margin-bottom:18px}'
    + '.team-pg .pg-hd h1{margin:0;font-size:22px;letter-spacing:-.5px}'
    + '.team-pg .pg-hd p{margin:4px 0 0;color:#748198;font-size:11px}'
    /* Toolbar */
    + '.team-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px}'
    + '.team-bar input{flex:1;min-width:180px;height:36px;padding:0 12px;'
    +   'border:1px solid #dde3ec;border-radius:8px;font-size:12px;outline:0}'
    + '.team-bar input:focus{border-color:#8999eb;box-shadow:0 0 0 3px #edf0ff}'
    + '.team-bar select{height:36px;padding:0 10px;border:1px solid #dde3ec;'
    +   'border-radius:8px;font-size:11px;background:#fff;cursor:pointer}'
    + '.team-bar .cnt{font-size:11px;color:#748198;white-space:nowrap;margin-left:4px}'
    /* Card grid */
    + '.team-grid{display:grid;'
    +   'grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:16px}'
    /* Individual card */
    + '.sc{background:#fff;border-radius:13px;overflow:hidden;'
    +   'box-shadow:0 2px 14px rgba(0,0,0,.07);border:1px solid #edf0f4;'
    +   'cursor:pointer;transition:transform .15s,box-shadow .15s;'
    +   'display:flex;flex-direction:column;align-items:center;'
    +   'padding:0 14px 16px}'
    + '.sc:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.13)}'
    /* Coloured strip at the top */
    + '.sc-strip{width:100%;height:7px;flex-shrink:0;margin-bottom:0}'
    /* Photo / avatar */
    + '.sc-photo{width:80px;height:80px;border-radius:50%;margin:16px 0 11px;'
    +   'flex-shrink:0;overflow:hidden;'
    +   'display:flex;align-items:center;justify-content:center;'
    +   'font-size:26px;font-weight:700;color:#fff;'
    +   'box-shadow:0 4px 12px rgba(0,0,0,.18)}'
    + '.sc-photo img{width:100%;height:100%;object-fit:cover;border-radius:50%}'
    /* Name */
    + '.sc-name{font-size:12px;font-weight:700;color:#17243a;text-align:center;'
    +   'line-height:1.35;padding:0 4px}'
    /* Role */
    + '.sc-role{font-size:10px;color:#748198;text-align:center;'
    +   'padding:3px 6px 7px;line-height:1.4}'
    /* Dept pill */
    + '.sc-dept{font-size:9px;font-weight:700;padding:3px 10px;border-radius:99px;'
    +   'text-transform:uppercase;letter-spacing:.4px;margin-bottom:9px}'
    /* Contact */
    + '.sc-ph{font-size:9.5px;color:#748198;text-align:center;line-height:1.7}'
    /* ── Profile modal ── */
    + '.sp{display:flex;gap:18px;align-items:flex-start;padding-bottom:14px}'
    + '.sp-av{width:90px;height:90px;border-radius:50%;flex-shrink:0;overflow:hidden;'
    +   'display:flex;align-items:center;justify-content:center;'
    +   'font-size:28px;font-weight:700;color:#fff;'
    +   'box-shadow:0 4px 16px rgba(0,0,0,.2)}'
    + '.sp-av img{width:100%;height:100%;object-fit:cover;border-radius:50%}'
    + '.sp h3{margin:0 0 3px;font-size:16px;font-weight:700}'
    + '.sp .sp-role{font-size:12px;color:#748198;margin-bottom:8px}'
    + '.sp-tbl{width:100%;border-collapse:collapse;font-size:11px;margin-top:12px}'
    + '.sp-tbl td{padding:6px 10px 6px 0;border-bottom:1px solid #f0f2f5;vertical-align:top}'
    + '.sp-tbl td:first-child{color:#748198;font-weight:700;width:110px;white-space:nowrap}'
    + '.sp-tbl tr:last-child td{border:0}'
    + '.sp-quote{border-left:3px solid #4863de;background:#f4f6fa;'
    +   'padding:9px 12px;border-radius:0 6px 6px 0;font-size:11px;'
    +   'color:#536177;font-style:italic;margin-top:12px}'
    /* Upload label in modal */
    + '.sp-upload{display:inline-block;margin-top:8px;padding:5px 12px;'
    +   'border:1px dashed #aab;border-radius:7px;font-size:10px;color:#748198;'
    +   'cursor:pointer;transition:background .15s}'
    + '.sp-upload:hover{background:#f0f2f5}'
    /* Empty state */
    + '.team-empty{padding:48px 20px;text-align:center;color:#748198}'
    + '.team-empty b{display:block;font-size:15px;margin-bottom:6px;color:#36445a}'
    /* Responsive */
    + '@media(max-width:640px){'
    +   '.team-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:11px}'
    +   '.sc-photo{width:64px;height:64px;font-size:20px}'
    +   '.sp{flex-direction:column}'
    + '}'
    /* Print */
    + '@media print{'
    +   '.team-pg{display:none!important}'
    + '}'
    + '</style>';

  /* ── Stats row ── */
  var teachers = SCHOOL_TEAM.filter(function (s) { return !!s.subjects; }).length;
  var statsHTML = '<div class="stats" style="margin-bottom:16px">'
    + '<article class="stat"><div class="stat-ico">👥</div>'
    +   '<span class="stat-label">Total staff</span>'
    +   '<strong>' + SCHOOL_TEAM.length + '</strong>'
    +   '<small>All departments</small></article>'
    + '<article class="stat"><div class="stat-ico">👩‍🏫</div>'
    +   '<span class="stat-label">Teaching staff</span>'
    +   '<strong>' + teachers + '</strong>'
    +   '<small>Classroom teachers</small></article>'
    + '<article class="stat accent"><div class="stat-ico">🏢</div>'
    +   '<span class="stat-label">Departments</span>'
    +   '<strong>' + depts.length + '</strong>'
    +   '<small>School departments</small></article>'
    + '<article class="stat"><div class="stat-ico">🎓</div>'
    +   '<span class="stat-label">Support staff</span>'
    +   '<strong>' + (SCHOOL_TEAM.length - teachers) + '</strong>'
    +   '<small>Non-teaching staff</small></article>'
    + '</div>';

  /* ── Toolbar ── */
  var toolbarHTML = '<div class="team-bar">'
    + '<input type="text" id="team-q" placeholder="🔍  Search by name, role or department…" '
    +   'oninput="window._teamFilter()" autocomplete="off">'
    + '<select id="team-dept" onchange="window._teamFilter()">'
    +   '<option value="">All departments</option>'
    +   depts.map(function (d) {
        return '<option value="' + d + '">' + d + '</option>';
      }).join("")
    + '</select>'
    + '<span class="cnt" id="team-cnt">' + SCHOOL_TEAM.length + ' staff</span>'
    + '</div>';

  /* ── Build one card HTML ── */
  function cardHTML(s) {
    var dc = DC[s.dept] || "#4863de";
    /* Photo: real image if set, otherwise coloured circle with initials */
    var photoEl = s.photo
      ? '<div class="sc-photo"><img src="' + s.photo + '" alt="' + s.name + '"></div>'
      : '<div class="sc-photo" style="background:' + s.color + '">' + s.initials + '</div>';
    return '<div class="sc" data-sid="' + s.id + '">'
      + '<div class="sc-strip" style="background:' + dc + '"></div>'
      + photoEl
      + '<div class="sc-name">' + s.name + '</div>'
      + '<div class="sc-role">' + s.role + '</div>'
      + '<div class="sc-dept" style="background:' + dc + '1a;color:' + dc + '">' + s.dept + '</div>'
      + '<div class="sc-ph">📞 ' + s.phone + '</div>'
      + '</div>';
  }

  /* ── Initial grid ── */
  var gridHTML = '<div class="team-grid" id="team-grid">'
    + SCHOOL_TEAM.map(cardHTML).join("")
    + '</div>';

  /* ── JavaScript for filter + modal (plain ES5, no template literals) ── */
  var scriptHTML = '<script>'
    /* Dept colour map (duplicated so it works inside inline script) */
    + 'var _DC={"Administration":"#4863de","Academics":"#7c3aed","Registry":"#168560",'
    +   '"Finance":"#b45309","Lower Primary":"#0369a1","Upper Primary":"#1a3d6b",'
    +   '"Sports & PE":"#b45309","Creative Arts":"#7c3aed","Technology":"#0f766e",'
    +   '"Humanities":"#be185d","Languages":"#4863de","Library":"#0369a1",'
    +   '"Property":"#0369a1","Transport":"#374151","Health":"#be185d",'
    +   '"Boarding":"#be185d","Welfare":"#0f766e","Catering":"#b45309","Security":"#374151"};'

    /* Filter function */
    + 'window._teamFilter=function(){'
    +   'var q=(document.getElementById("team-q").value||"").toLowerCase();'
    +   'var d=document.getElementById("team-dept").value;'
    +   'var list=SCHOOL_TEAM.filter(function(s){'
    +     'var tm=!q||(s.name+"|"+s.role+"|"+s.dept+"|"+s.subjects).toLowerCase().indexOf(q)>-1;'
    +     'var dm=!d||s.dept===d;'
    +     'return tm&&dm;'
    +   '});'
    +   'var grid=document.getElementById("team-grid");'
    +   'if(!list.length){'
    +     'grid.innerHTML=\'<div class="team-empty"><b>No staff found</b>Try a different search.</div>\';'
    +   '}else{'
    +     'grid.innerHTML=list.map(function(s){'
    +       'var dc=_DC[s.dept]||"#4863de";'
    +       'var ph=s.photo'
    +         '?\'<div class="sc-photo"><img src="\'+s.photo+\'" alt="\'+s.name+\'"></div>\''
    +         ':\'<div class="sc-photo" style="background:\'+s.color+\'">\'+s.initials+\'</div>\';'
    +       'return \'<div class="sc" data-sid="\'+s.id+\'">\''
    +         '+\'<div class="sc-strip" style="background:\'+dc+\'"></div>\''
    +         '+ph'
    +         '+\'<div class="sc-name">\'+s.name+\'</div>\''
    +         '+\'<div class="sc-role">\'+s.role+\'</div>\''
    +         '+\'<div class="sc-dept" style="background:\'+dc+\'1a;color:\'+dc+\'">\'+s.dept+\'</div>\''
    +         '+\'<div class="sc-ph">📞 \'+s.phone+\'</div>\''
    +         '+\'</div>\';'
    +     '}).join("");'
    +   '}'
    +   'document.getElementById("team-cnt").textContent=list.length+" staff";'
    +   'window._wireCards();'
    + '};'

    /* Wire card clicks → profile modal */
    + 'window._wireCards=function(){'
    +   'document.querySelectorAll(".sc").forEach(function(card){'
    +     'card.onclick=function(){'
    +       'var s=SCHOOL_TEAM.find(function(x){return x.id===card.dataset.sid;});'
    +       'if(!s)return;'
    +       'var dc=_DC[s.dept]||"#4863de";'
    /* Photo in modal */
    +       'var ph=s.photo'
    +         '?\'<div class="sp-av"><img src="\'+s.photo+\'" alt="\'+s.name+\'"></div>\''
    +         ':\'<div class="sp-av" style="background:\'+s.color+\'">\'+s.initials+\'</div>\';'
    /* Upload-photo hint */
    +       'var upHint=\'<label class="sp-upload">📷 Add real photo later'
    +         '<input type="file" accept="image/*" style="display:none" '
    +         'onchange="window._uploadTeamPhoto(this,\\"\'+s.id+\'\\")"></label>\';'
    /* Build modal body */
    +       'var body=\'<div class="modal-head"><h2>Staff profile</h2>\''
    +         '+\'<button class="btn secondary small" onclick="KHA.closeModal()">✕ Close</button></div>\''
    +         '+\'<div class="modal-body">\''
    +         '+\'<div class="sp">\'+ph+\'<div>\''
    +         '+\'<h3>\'+s.name+\'</h3>\''
    +         '+\'<div class="sp-role">\'+s.role+\'</div>\''
    +         '+\'<span style="display:inline-flex;padding:3px 10px;border-radius:99px;\''
    +           '+\'font-size:9px;font-weight:700;background:\'+dc+\'1a;color:\'+dc+\'">\'+s.dept+\'</span>\''
    +         '+upHint'
    +         '+\'</div></div>\''
    +         '+\'<table class="sp-tbl">\''
    +           '+(s.subjects?\'<tr><td>Subjects</td><td>\'+s.subjects+\'</td></tr>\':"")'
    +           '+(s.classes?\'<tr><td>Classes</td><td>\'+s.classes+\'</td></tr>\':"")'
    +           '+\'<tr><td>Phone</td><td><a href="tel:\'+s.phone+\'">\'+s.phone+\'</a></td></tr>\''
    +           '+\'<tr><td>Email</td><td><a href="mailto:\'+s.email+\'">\'+s.email+\'</a></td></tr>\''
    +           '+\'<tr><td>Joined</td><td>\'+s.joined+\'</td></tr>\''
    +         '+\'</table>\''
    +         '+(s.quote?\'<div class="sp-quote">&ldquo;\'+s.quote+\'&rdquo;</div>\':"")'
    +         '+\'</div>\';'
    +       'KHA.openModal(body);'
    +     '};'
    +   '});'
    + '};'

    /* Upload a real photo — saves to localStorage keyed by staff ID */
    + 'window._uploadTeamPhoto=function(input,staffId){'
    +   'var file=input.files&&input.files[0]; if(!file)return;'
    +   'var reader=new FileReader();'
    +   'reader.onload=function(e){'
    +     'var src=e.target.result;'
    +     /* Update the in-memory team array */
    +     'var s=SCHOOL_TEAM.find(function(x){return x.id===staffId;});'
    +     'if(s) s.photo=src;'
    +     /* Persist in localStorage so it survives page reload */
    +     'var photos=JSON.parse(localStorage.getItem("kha_team_photos")||"{}");'
    +     'photos[staffId]=src;'
    +     'localStorage.setItem("kha_team_photos",JSON.stringify(photos));'
    +     'KHA.closeModal();'
    +     'KHA.toast("Photo saved! It will appear on the card.","ok"||"success");'
    +     'window._teamFilter();'   /* Refresh the grid */
    +   '};'
    +   'reader.readAsDataURL(file);'
    + '};'

    /* Restore saved photos from localStorage on page load */
    + '(function _restorePhotos(){'
    +   'var photos=JSON.parse(localStorage.getItem("kha_team_photos")||"{}");'
    +   'Object.keys(photos).forEach(function(id){'
    +     'var s=SCHOOL_TEAM.find(function(x){return x.id===id;});'
    +     'if(s) s.photo=photos[id];'
    +   '});'
    + '})();'

    /* Initial card wiring */
    + 'window._wireCards();'
    + '<\/script>';

  return css
    + '<div class="team-pg">'
    + '<div class="pg-hd no-print"><div><h1>🏫 School team</h1>'
    + '<p>Five Star Model School · ' + SCHOOL_TEAM.length + ' staff members</p></div>'
    + '</div>'
    + statsHTML
    + toolbarHTML
    + gridHTML
    + '</div>'
    + scriptHTML;
};
