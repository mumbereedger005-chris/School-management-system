/**
 * =============================================================================
 * shared.js — Five Star Model School Management System
 * =============================================================================
 * This file is the foundation shared by ALL portals (admin, registrar, DOS,
 * accountant, property, boarding).  It provides:
 *   • School identity constants (name, motto, badge SVG)
 *   • Role / navigation definitions for every portal
 *   • localStorage database helpers (load / save)
 *   • PBKDF2-SHA256 password hashing for secure accounts
 *   • Full authentication flow: sign-up, sign-in, forgot password
 *   • CSS injection (one stylesheet served to all portals)
 *   • App-shell builder: sidebar, topbar, crumb trail
 *   • Modal open/close helpers
 *   • Photo upload helpers (file → base64 data-URL)
 *   • Reusable table builder
 *   • Grade calculation (Uganda Primary curriculum D1–F9 scale)
 *   • Toast notification utility
 *
 * Usage in every portal HTML file:
 *   <script src="shared.js"></script>
 *   <script>
 *     KHA.init("roleName", function(session) { // boot your portal
 *     });
 *   </script>
 * =============================================================================
 */
"use strict";

/**
 * The entire library is wrapped in an IIFE that returns a public object KHA.
 * Nothing leaks into the global scope except the KHA namespace itself.
 */
window.KHA = (function () {

  /* ===========================================================================
     SCHOOL IDENTITY CONSTANTS
     Change these when deploying to a different school.
  =========================================================================== */

  /** Full school name shown in the login screen, sidebar, and report cards. */
  const SCHOOL_NAME  = "Five Star Model School";

  /** Short geographic sub-title shown under the school name. */
  const SCHOOL_SUB   = "Kasese · Western Uganda";

  /** Motto printed at the bottom of report cards and receipts. */
  const SCHOOL_MOTTO = "Excellence in Learning";

  /** Current academic year label displayed throughout the system. */
  const CURRENT_YEAR = "2025–2026";

  /**
   * Complete ordered list of ALL classes at Five Star Model School.
   * Includes the three nursery / kindergarten levels followed by
   * the seven primary classes.
   *
   * Baby class   – youngest learners (approx. age 3–4)
   * Middle class – middle nursery   (approx. age 4–5)
   * Top class    – senior nursery   (approx. age 5–6)
   * P.1 – P.7   – Uganda Primary curriculum
   *
   * This single constant is exported so every portal (registrar, DOS,
   * admin, accountant, etc.) always uses the same class list.
   */
  const CLASS_LIST = [
    "Baby class",   // Nursery level 1
    "Middle class", // Nursery level 2
    "Top class",    // Nursery level 3 / Reception
    "P.1",
    "P.2",
    "P.3",
    "P.4",
    "P.5",
    "P.6",
    "P.7"
  ];

  /* Shared school logo used in the hub, login screens, and school documents. */
  const BADGE_SVG =
    '<img src="star%20logo.png" alt="Five Star Model School logo" style="width:100%;height:100%;object-fit:contain">';

  /* ===========================================================================
     PORTAL / ROLE DEFINITIONS
     Each key maps to a portal file (portal-{key}.html).
     • label   – short name used in the sidebar tag and login screen
     • title   – full job-title name
     • color   – brand accent color used on the hub cards
     • groups  – sidebar navigation: { "Group heading": ["Page 1", "Page 2"] }
  =========================================================================== */
  const ROLES = {

    /**
     * Administrator – sees everything across all departments.
     * Can view records from every module and manage portal accounts.
     */
    admin: {
      label: "Administrator",
      title: "School Administrator",
      color: "#4863de",
      groups: {
        "School overview":   ["Dashboard", "Department activity", "Messages", "Portal access", "Announcements", "School calendar", "Parent updates"],
        "People":            ["Students", "Teachers", "Staff profiles", "School team"],
        "Academics":         ["Classes", "Subjects", "Marks", "Report cards", "Examinations"],
        "Attendance":        ["Student attendance", "Daily enrollment", "Teacher attendance"],
        "Timetables":        ["Class timetable", "Examination timetable"],
        "Finance":           ["Fees structure", "Payments", "Scholarships", "Financial reports"],
        "Property":          ["School assets", "Books", "Buses", "Drivers", "Routes", "Transport assignments"],
        "Boarding":          ["Dormitories", "Beds", "Boarding assignments", "House masters"],
        "System":            ["User accounts", "Settings"]
      }
    },

    /**
     * Registrar – handles student admissions and enrollment records.
     * Can register new pupils, upload pupil and parent photos, record parent
     * contacts, and assign classes and boarding status.
     */
    registrar: {
      label: "Registrar",
      title: "Admissions Registrar",
      color: "#168560",
      groups: {
        "Admissions & Records": ["Dashboard", "Students", "Admissions report", "School team", "Messages", "Parent updates"]
      }
    },

    /**
     * Director of Studies (DOS) – manages the academic programme.
     * Registers teachers, creates classes and streams, assigns subjects,
     * builds timetables, enters marks, and generates report cards.
     */
    dos: {
      label: "Director of Studies",
      title: "Director of Studies",
      color: "#7c3aed",
      groups: {
        "Staff management":  ["Dashboard", "Teachers", "Staff profiles", "School team", "Messages", "Parent updates"],
        "Curriculum":        ["Classes", "Streams", "Subjects"],
        "Timetables":        ["Class timetable", "Teacher timetable", "Subject timetable", "Examination timetable"],
        "Assessment":        ["Marks", "Report cards", "Examinations"],
        "Attendance":        ["Student attendance", "Daily enrollment", "Teacher attendance"]
      }
    },

    /**
     * Accountant – manages all financial transactions.
     * Creates fees structures, assesses term charges, records payments,
     * issues receipts, and generates financial reports.
     */
    accountant: {
      label: "Accountant",
      title: "School Accountant",
      color: "#b45309",
      groups: {
        "Finance management": ["Dashboard", "Fees structure", "Payments", "Scholarships", "School team", "Payment requests", "Payment settings", "Messages", "Parent updates"],
        "Reports":            ["Financial reports", "Payment receipts"]
      }
    },

    /**
     * Property Officer – manages school assets and transport.
     * Maintains the library inventory, registers buses and drivers,
     * defines routes, assigns pupils to transport, and prints manifests.
     */
    property: {
      label: "Property Officer",
      title: "Property Department",
      color: "#0369a1",
      groups: {
        "Library":   ["Dashboard", "Books", "Book categories", "Book issues", "School team"],
        "Transport": ["School assets", "Buses", "Drivers", "Routes", "Transport assignments", "Messages", "Parent updates"]
      }
    },

    /**
     * Boarding Officer – manages the hostel / dormitory.
     * Creates dormitories, registers beds, assigns pupils,
     * records boarding fees, and manages house masters / matrons.
     */
    boarding: {
      label: "Boarding Officer",
      title: "Boarding & Hostel",
      color: "#be185d",
      groups: {
        "Hostel management": ["Dashboard", "Dormitories", "Beds", "Boarding assignments", "House masters", "School team", "Messages", "Parent updates"]
      }
    },

    parent: {
      label: "Parent",
      title: "Parent Portal",
      color: "#0f766e",
      groups: {
        "My family": ["Dashboard", "My children", "Fees & payments", "School calendar", "Announcements", "Department updates", "Messages", "Parent profile"]
      }
    }
  };

  /* ===========================================================================
     NAVIGATION ICON MAP
     Emoji icons shown beside every sidebar nav item.
     Keys match the page names used in ROLES[x].groups above.
  =========================================================================== */
  const ICONS = {
    "Dashboard":              "⌂",
    "Department activity":   "🕵️",
    "Messages":              "✉️",
    "Payment requests":      "🏦",
    "Payment settings":      "⚙️",
    "Portal access":          "⚿",
    "Announcements":          "📢",
    "School calendar":       "🗓️",
    "Parent updates":        "📬",
    "Students":               "🎓",
    "Admissions report":      "📊",
    "Teachers":               "👩‍🏫",
    "Staff profiles":         "👥",
    "School team":            "🏅",
    "Classes":                "🏫",
    "Streams":                "▤",
    "Subjects":               "📚",
    "Marks":                  "✏️",
    "Report cards":           "📄",
    "Examinations":           "📝",
    "Student attendance":     "📋",
    "Daily enrollment":       "🧾",
    "Teacher attendance":     "📋",
    "Class timetable":        "📅",
    "Examination timetable":  "📅",
    "School assets":          "🪑",
    "Fees structure":         "💰",
    "Payments":               "💵",
    "Scholarships":           "🏅",
    "Financial reports":      "📊",
    "Payment receipts":       "🧾",
    "Books":                  "📖",
    "Book categories":        "🗂️",
    "Book issues":            "📤",
    "Buses":                  "🚌",
    "Drivers":                "🚗",
    "Routes":                 "🗺️",
    "Transport assignments":  "📍",
    "Dormitories":            "🏠",
    "Beds":                   "🛏️",
    "Boarding assignments":   "📋",
    "House masters":          "👮",
    "User accounts":          "👤",
    "Settings":               "⚙️",
    "My children":            "🎓",
    "Fees & payments":        "💳",
    "Parent profile":         "👪",
    "Department updates":     "📬"
  };

  /* ===========================================================================
     DATA STORE KEYS
     Every collection is persisted as a JSON array in localStorage under
     one of these keys.  Keeping keys in one place prevents typos across files.
  =========================================================================== */
  const STORE = {
    students:      "kha_students",       // Pupil registration records
    teachers:      "kha_teachers",       // Teaching staff records
    classes:       "kha_classes",        // Class / stream definitions
    subjects:      "kha_subjects",       // Curriculum subjects
    marks:         "kha_marks",          // Assessment marks per pupil per subject
    reportCards:   "kha_report_cards",   // Report cards prepared by the DOS
    attendance:    "kha_attendance",     // Daily student attendance
    enrollment:    "kha_enrollment",     // Daily student enrollment register
    teacherAtt:    "kha_teacher_att",    // Teacher check-in records
    timetable:     "kha_timetable",      // All timetable slots (class/teacher/subject/exam)
    exams:         "kha_exams",          // Examination schedule
    fees:          "kha_fees",           // Fees structure definitions
    invoices:      "kha_invoices",       // Per-student fee invoices
    payments:      "kha_payments",       // Fee payment records
    scholarships:  "kha_scholarships",   // Discounts, bursaries, scholarships
    books:         "kha_books",          // Library book inventory
    propertyAssets:"kha_property_assets",// Furniture and school asset inventory
    bookCats:      "kha_book_cats",      // Book category definitions
    bookIssues:    "kha_book_issues",    // Book lending / return records
    buses:         "kha_buses",          // School bus register
    drivers:       "kha_drivers",        // Bus driver records
    routes:        "kha_routes",         // Transport route definitions
    transport:     "kha_transport",      // Pupil-to-bus assignments
    dormitories:   "kha_dormitories",    // Dormitory / house definitions
    beds:          "kha_beds",           // Individual bed register
    boarding:      "kha_boarding",       // Pupil-to-bed assignments
    houseMasters:  "kha_house_masters",  // House masters and matrons
    accounts:      "kha_accounts",       // Portal user accounts (hashed)
    announcements: "kha_announcements", // School-wide announcements
    calendarEvents:"kha_calendar_events",// School calendar events
    parentLinks:   "kha_parent_links",   // Verified parent-account to student links
    parentProfiles:"kha_parent_profiles",// Parent contact profiles keyed by account ID
    parentUpdates: "kha_parent_updates", // Department updates published to parents
    departmentActivity:"kha_department_activity",// Record changes made in department portals
    messages:      "kha_messages",        // Parent and department portal conversations
    paymentRequests:"kha_payment_requests",// Parent-submitted payment claims for accountant review
    paymentSettings:"kha_payment_settings" // School mobile-money and bank instructions
  };

  /* ===========================================================================
     UTILITY HELPERS
  =========================================================================== */

  /**
   * HTML-escape a value for safe insertion into innerHTML.
   * Prevents XSS when displaying user-supplied data in the UI.
   * @param {*} v - Any value; converted to string first.
   * @returns {string}
   */
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /**
   * Return today's date as an ISO-8601 string (YYYY-MM-DD).
   * Used as the default value for date fields and attendance queries.
   */
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  /** Full ISO-8601 timestamp for createdAt / updatedAt fields. */
  function nowISO() {
    return new Date().toISOString();
  }

  /**
   * Generate a short unique id: timestamp base-36 + random suffix.
   * Collision probability is negligible for a school with < 10 000 records.
   */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /**
   * Extract up to two initials from a full name string.
   * e.g. "Alice Namukasa" → "AN", "Bob" → "BO" (or "B" if only one word)
   */
  function initials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0] || "")
      .join("")
      .toUpperCase() || "??";
  }

  /**
   * Format a number as Ugandan shillings.
   * e.g. 150000 → "UGX 150,000"
   */
  function fmtMoney(n) {
    return "UGX " + (Number(n) || 0).toLocaleString("en-UG");
  }

  /**
   * Format a date string or ISO timestamp as a human-readable date.
   * Returns "—" for missing / invalid values.
   */
  function fmtDate(d) {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch (_) { return d; }
  }

  /**
   * Convert a raw score into a Uganda Primary Assessment grade (D1–F9).
   * Scale used by most Ugandan primary schools:
   *   90–100 → D1, 80–89 → D2, 70–79 → C3, 65–69 → C4,
   *   60–64 → C5, 55–59 → C6, 45–54 → P7, 40–44 → P8, <40 → F9
   *
   * @param {number|string} score  - Marks obtained
   * @param {number|string} outOf  - Maximum possible marks
   * @returns {string} Grade label
   */
  function gradeFromScore(score, outOf) {
    const pct = (Number(score) / Math.max(Number(outOf), 1)) * 100;
    if (pct >= 90) return "D1";
    if (pct >= 80) return "D2";
    if (pct >= 70) return "C3";
    if (pct >= 65) return "C4";
    if (pct >= 60) return "C5";
    if (pct >= 55) return "C6";
    if (pct >= 45) return "P7";
    if (pct >= 40) return "P8";
    return "F9";
  }

  /**
   * Return a plain-English remark for a grade letter.
   * Printed in the "Remarks" column of report cards.
   */
  function gradeRemark(grade) {
    return {
      D1: "Excellent", D2: "Very good", C3: "Good", C4: "Good",
      C5: "Credit",    C6: "Credit",    P7: "Pass",  P8: "Pass", F9: "Fail"
    }[grade] || "";
  }

  /* ===========================================================================
     CRYPTOGRAPHIC HELPERS (Password security)
  =========================================================================== */

  /**
   * Generate n random bytes as an uppercase hex string.
   * Used to create password salts and one-time recovery codes.
   */
  function randHex(n) {
    return Array.from(
      crypto.getRandomValues(new Uint8Array(n)),
      b => b.toString(16).padStart(2, "0")
    ).join("").toUpperCase();
  }

  /**
   * Derive a 256-bit key from a password + salt using PBKDF2-SHA256.
   * 150 000 iterations makes brute-force attacks impractical.
   * Returns a hex string suitable for localStorage storage.
   *
   * NOTE: Requires SubtleCrypto (available on localhost and HTTPS).
   */
  async function hashPwd(password, salt) {
    if (!crypto?.subtle) {
      throw new Error(
        "Secure password hashing requires HTTPS or localhost. " +
        "Open the file through a local web server."
      );
    }
    const enc  = new TextEncoder();
    const key  = await crypto.subtle.importKey(
      "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 150000, hash: "SHA-256" },
      key, 256
    );
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, "0")).join("");
  }

  /* ===========================================================================
     LOCAL STORAGE DATABASE HELPERS
     All school data is stored in localStorage as JSON arrays.
     In a production system, replace these with authenticated API calls
     to a server-side database with proper backups.
  =========================================================================== */

  /**
   * Load and JSON-parse a value from localStorage.
   * @param {string} key      - The localStorage key from STORE.*
   * @param {*}      fallback - Value returned when key is missing or corrupt
   */
  function load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
    } catch (_) {
      return fallback; // Corrupt data — return the default safely
    }
  }

  /**
   * JSON-stringify and save a value to localStorage.
   * Shows a toast if the browser storage quota is exceeded.
   * @returns {boolean} true on success
   */
  function save(key, value) {
    try {
      const previous = load(key, null);
      localStorage.setItem(key, JSON.stringify(value));
      if (key !== STORE.departmentActivity && key !== STORE.accounts) {
        try {
          trackDepartmentChanges(key, previous, value);
        } catch (error) {
          console.error("Department activity could not be recorded:", error);
        }
      }
      return true;
    } catch (_) {
      toast("Storage full — record could not be saved.", "error");
      return false;
    }

    function trackDepartmentChanges(key, previous, next) {
      if (!Array.isArray(next)) return;
      const session = getSession();
      const storeInfo = departmentStoreInfo(key);
      if (!storeInfo) return;
      const before = Array.isArray(previous) ? previous : [];
      const beforeById = new Map(before.filter(record => record && record.id).map(record => [record.id, record]));
      const afterById = new Map(next.filter(record => record && record.id).map(record => [record.id, record]));
      const changes = [];
      next.forEach(record => {
        if (!record || !record.id) return;
        const oldRecord = beforeById.get(record.id);
        if (!oldRecord) changes.push({action:"Added", record});
        else if (JSON.stringify(oldRecord) !== JSON.stringify(record)) changes.push({action:"Updated", record});
      });
      before.forEach(record => {
        if (record && record.id && !afterById.has(record.id)) changes.push({action:"Deleted", record});
      });
      if (!changes.length) return;
      const activity = load(STORE.departmentActivity, []);
      changes.forEach(change => {
        activity.push({
          id: uid(),
          department: session && ROLES[session.role] ? session.role : "unknown",
          departmentName: session && ROLES[session.role] ? ROLES[session.role].title : "Unknown user",
          actorId: session && session.id || "",
          actorName: session && session.name || "Unknown user",
          store: key,
          area: storeInfo.area,
          action: change.action,
          recordId: change.record.id,
          recordName: activityRecordName(change.record),
          at: nowISO()
        });
      });
      localStorage.setItem(STORE.departmentActivity, JSON.stringify(activity.slice(-1000)));
    }

    function departmentStoreInfo(key) {
      const stores = {
        students:["registrar","Student records"],
        teachers:["dos","Teaching staff"],
        classes:["dos","Classes"],
        subjects:["dos","Subjects"],
        marks:["dos","Assessment marks"],
        reportCards:["dos","Report cards"],
        attendance:["dos","Student attendance"],
        enrollment:["dos","Daily enrollment"],
        teacherAtt:["dos","Teacher attendance"],
        timetable:["dos","Timetables"],
        exams:["dos","Examinations"],
        fees:["accountant","Fees structures"],
        invoices:["accountant","Fee charges"],
        payments:["accountant","Payments"],
        paymentRequests:["accountant","Parent payment requests"],
        paymentSettings:["accountant","Payment instructions"],
        scholarships:["accountant","Scholarships"],
        books:["property","Library books"],
        propertyAssets:["property","School assets"],
        bookCats:["property","Book categories"],
        bookIssues:["property","Book issues"],
        buses:["property","Buses"],
        drivers:["property","Drivers"],
        routes:["property","Routes"],
        transport:["property","Transport assignments"],
        dormitories:["boarding","Dormitories"],
        beds:["boarding","Beds"],
        boarding:["boarding","Boarding assignments"],
        houseMasters:["boarding","Boarding staff"],
        announcements:["admin","Announcements"],
        calendarEvents:["admin","School calendar"],
        parentUpdates:["admin","Parent updates"],
        parentLinks:["parent","Linked children"],
        parentProfiles:["parent","Parent profiles"]
      };
      const match = Object.keys(STORE).find(name => STORE[name] === key);
      const info = match && stores[match];
      return info ? {department:info[0],area:info[1]} : null;
    }

    function activityRecordName(record) {
      return record.name || record.title || record.pupilName || record.borrowerName
        || record.admission || record.receiptNo || record.staffId || record.registration
        || record.class || record.subject || record.id || "Record";
    }
  }

  /* ===========================================================================
     CSS INJECTION
     All portals share one stylesheet injected once per page load.
     Using a <style> tag avoids a separate HTTP request and keeps
     the system fully self-contained.
  =========================================================================== */

  /**
   * Inject the shared stylesheet into <head> if not already present.
   * Called by KHA.init() before the portal boots.
   */
  function injectCSS() {
    if (document.getElementById("kha-css")) return; // Already injected

    const style = document.createElement("style");
    style.id    = "kha-css";
    style.textContent = `
/* ── CSS CUSTOM PROPERTIES (design tokens) ─────────────────────────── */
:root {
  --ink:         #17243a;   /* Main body text */
  --muted:       #748198;   /* Secondary / label text */
  --line:        #e6eaf1;   /* Borders and dividers */
  --paper:       #ffffff;   /* Card / panel backgrounds */
  --canvas:      #f6f7fb;   /* Page background */
  --navy:        #17263d;   /* Sidebar background */
  --blue:        #4863de;   /* Primary accent (admin portal) */
  --blue-soft:   #eef1ff;   /* Light blue tint */
  --green:       #168560;   /* Success / active states */
  --green-soft:  #e8f7f0;
  --amber:       #a97015;   /* Warning states */
  --amber-soft:  #fff5e5;
  --red:         #bd4a4a;   /* Danger / error states */
  --red-soft:    #fff0ef;
  --purple:      #7c3aed;   /* DOS portal accent */
  --purple-soft: #f5f3ff;
  --shadow:      0 4px 18px #20345408;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

/* ── RESET ──────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; color: var(--ink); background: var(--canvas); font-size: 14px; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: .45; }
a { color: inherit; }

/* ── LOGIN SCREEN ───────────────────────────────────────────────────── */
/* Two-column layout: coloured hero panel on the left, auth form on the right */
.login-wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background:
    linear-gradient(135deg, rgba(13, 29, 53, 0.48), rgba(17, 39, 72, 0.28)),
    url("house.jpg") center / cover no-repeat fixed;
}
.login-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(28px, 5vw, 70px);
  color: #fff;
  /* Deep blue gradient with subtle radial highlight */
  background: linear-gradient(150deg, rgba(18, 33, 58, 0.78), rgba(30, 63, 120, 0.56));
}
/* School crest + name in the top-left corner of the login panel */
.login-brand       { display: flex; gap: 14px; align-items: center; }
.login-badge       { width: 52px; height: 60px; flex: 0 0 auto; }
.login-brand-text  { font-size: 18px; font-weight: 750; line-height: 1.2; }
.login-brand-text small {
  display: block; font-size: 10px; color: #9ab;
  font-weight: 500; letter-spacing: 1px; margin-top: 2px;
}
/* Centred hero copy (school name, motto) */
.login-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 480px; }
.login-hero small  { color: #afc2dc; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; font-size: 10px; }
.login-hero h1     { margin: 14px 0; font-size: clamp(30px, 4vw, 52px); line-height: 1.05; letter-spacing: -2px; }
.login-hero p      { color: #cde; line-height: 1.8; font-size: 13px; }
.login-footer      { color: #8aaccc; font-size: 11px; }
/* Right panel holds the auth card centred in the column */
.login-right { display: grid; place-items: center; padding: 40px 28px; }
.auth-card   {
  width: min(100%, 410px);
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid rgba(255,255,255,0.62);
  border-radius: 18px;
  background: rgba(255,255,255,0.94);
  box-shadow: 0 18px 55px rgba(10, 25, 48, 0.24);
  backdrop-filter: blur(8px);
}
.auth-card h2 { margin: 0 0 6px; font-size: 26px; letter-spacing: -.8px; }
.auth-sub    { margin: 0 0 22px; color: var(--muted); font-size: 12px; }
/* Sign-in / Create account tab switcher */
.auth-tabs { display: flex; gap: 4px; padding: 4px; border-radius: 9px; background: #f2f4f8; margin-bottom: 18px; }
.auth-tabs button {
  flex: 1; padding: 8px; border: 0; border-radius: 7px;
  font-size: 11px; font-weight: 650; color: #666; background: transparent;
}
.auth-tabs button.active { color: #344dbb; background: #fff; box-shadow: 0 1px 5px #17263d14; }

/* ── FORM FIELDS ─────────────────────────────────────────────────────── */
.field { display: grid; gap: 6px; margin: 12px 0; }
.field label {
  font-size: 10px; font-weight: 700; color: #4f5c70;
  text-transform: uppercase; letter-spacing: .4px;
}
.field input,
.field select,
.field textarea {
  width: 100%; min-height: 42px; padding: 10px 12px;
  border: 1px solid #dde3ec; border-radius: 8px;
  color: var(--ink); background: #fff; outline: none;
}
.field textarea { min-height: 80px; resize: vertical; }
.field input:focus,
.field select:focus,
.field textarea:focus { border-color: #8999eb; box-shadow: 0 0 0 3px #edf0ff; }
/* Two-column field grid inside modals */
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
.hint { color: var(--muted); font-size: 10px; line-height: 1.55; margin-top: 3px; }
/* Inline error banner shown below the form on auth failure */
.auth-err {
  padding: 10px 13px; border-radius: 7px;
  color: var(--red); background: var(--red-soft); font-size: 12px; margin-top: 10px;
}
/* Prototype disclaimer shown below the sign-in form */
.auth-note {
  margin-top: 16px; padding: 11px; border-radius: 8px;
  background: #f4f6fa; color: #647087; font-size: 10px; line-height: 1.6;
}
/* One-time recovery code display */
.recovery-card {
  width: min(100%, 460px); padding: 28px;
  border: 1px solid var(--line); border-radius: 12px; background: #fff;
}
.codebox {
  margin: 16px 0; padding: 18px;
  border: 1px dashed #9baaf4; border-radius: 9px;
  color: #263b77; background: #f5f6ff;
  text-align: center; font-size: 20px; font-weight: 750;
  letter-spacing: 1.5px; overflow-wrap: anywhere;
}
.auth-link {
  display: block; margin: 12px auto 0;
  border: 0; color: #5367d1; background: transparent;
  font-size: 11px; font-weight: 650;
}

/* ── BUTTONS ─────────────────────────────────────────────────────────── */
/* Base button style — all variants start from .btn */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  min-height: 38px; padding: 0 14px;
  border: 1px solid transparent; border-radius: 8px;
  color: #fff; background: var(--blue);
  font-size: 11px; font-weight: 700; text-decoration: none; white-space: nowrap;
}
.btn:hover                  { filter: brightness(1.1); }
.btn.full                   { width: 100%; margin-top: 8px; }
.btn.secondary              { border-color: var(--line); color: #536078; background: #fff; }
.btn.secondary:hover        { background: #f8f9fc; }
.btn.danger                 { border-color: #f3d6d4; color: var(--red); background: #fff; }
.btn.success                { background: var(--green); }
.btn.warn                   { background: var(--amber); }
.btn.ghost                  { border: 0; background: transparent; color: var(--blue); padding: 0 4px; }
.btn.small                  { min-height: 30px; padding: 0 10px; font-size: 10px; }
/* Square icon-only button used in table action cells */
.btn.icon {
  width: 30px; height: 30px; min-height: 0; padding: 0;
  border: 1px solid var(--line); color: #58677d; background: #fff; border-radius: 7px;
}

/* ── APP SHELL ───────────────────────────────────────────────────────── */
/* Main layout: fixed sidebar + scrollable content area */
.app { min-height: 100vh; display: flex; }

/* ── Sidebar ── */
.sidebar {
  position: fixed; inset: 0 auto 0 0; z-index: 30;
  display: flex; flex-direction: column;
  width: 252px; padding: 16px 12px 14px;
  color: #dce4f1; background: var(--navy);
  transition: transform .22s;
  overflow-y: auto; /* Scrollable when menu is long */
}
/* School crest + name at the top of the sidebar */
.sidebar-brand {
  display: flex; gap: 11px; align-items: center;
  padding: 0 7px 16px; border-bottom: 1px solid #ffffff1b;
  flex-shrink: 0;
}
.sidebar-badge     { width: 34px; height: 40px; flex: 0 0 auto; }
.sidebar-name      { font-size: 11px; font-weight: 750; line-height: 1.3; }
.sidebar-name small { display: block; margin-top: 3px; color: #9cabc0; font-size: 9px; font-weight: 500; letter-spacing: .8px; }
/* Portal role label beneath the brand */
.portal-tag { margin: 13px 8px 7px; color: #9cabc0; text-transform: uppercase; letter-spacing: 1.5px; font-size: 9px; font-weight: 700; }
/* Navigation section */
.nav-list   { flex: 1; overflow-y: auto; overflow-x: hidden; padding-bottom: 8px; }
.nav-group  { padding: 10px 8px 3px; color: #8193ad; text-transform: uppercase; letter-spacing: 1px; font-size: 8.5px; font-weight: 750; }
/* Individual nav button */
.nav-item {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 8px 9px; border: 0; border-radius: 7px; margin: 1px 0;
  text-align: left; color: #bac5d6; background: transparent; font-size: 11px;
}
.nav-item:hover          { color: #fff; background: #ffffff12; }
.nav-item.active         { color: #fff; background: #2b3d59; box-shadow: inset 3px 0 0 #8296ff; }
.nav-ico                 { width: 18px; text-align: center; font-size: 13px; flex: 0 0 auto; }
/* Signed-in user chip at the bottom of the sidebar */
.side-foot               { padding-top: 10px; border-top: 1px solid #ffffff1b; flex-shrink: 0; }
.user-chip               { display: flex; align-items: center; gap: 9px; padding: 7px 5px 10px; }
/* Round avatar used in sidebar, topbar, and staff profiles */
.avatar {
  width: 34px; height: 34px; flex: 0 0 auto;
  display: grid; place-items: center; border-radius: 50%; overflow: hidden;
  color: #354ba6; background: #e9ecff; font-size: 10px; font-weight: 750;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar.sm  { width: 28px; height: 28px; font-size: 9px; }
.avatar.lg  { width: 56px; height: 56px; font-size: 14px; }
.avatar.xl  { width: 80px; height: 80px; font-size: 18px; }
.user-chip strong { display: block; color: #fff; font-size: 11px; }
.user-chip small  { display: block; margin-top: 2px; color: #9babc1; font-size: 9px; }
/* Main content area (right of sidebar) */
.main { flex: 1; min-width: 0; margin-left: 252px; min-height: 100vh; }
/* Sticky topbar */
.topbar {
  height: 62px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 26px; border-bottom: 1px solid var(--line);
  background: #fff; position: sticky; top: 0; z-index: 20;
}
.top-left, .top-right  { display: flex; align-items: center; gap: 10px; }
.crumb                 { font-size: 11px; color: var(--muted); }
.crumb strong          { color: var(--ink); }
.today-date            { color: var(--muted); font-size: 10px; }
/* Content container — max-width prevents lines from becoming too wide */
.content { max-width: 1500px; padding: 26px 28px 50px; margin: auto; }

/* ── PAGE HEADER ─────────────────────────────────────────────────────── */
/* Title + description on the left, action buttons on the right */
.page-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 14px; margin-bottom: 20px;
}
.page-head h1   { margin: 0; font-size: 22px; letter-spacing: -.6px; }
.page-head p    { margin: 4px 0 0; color: var(--muted); font-size: 11px; }
.actions        { display: flex; gap: 7px; flex-wrap: wrap; }

/* ── STAT CARDS ──────────────────────────────────────────────────────── */
/* Responsive grid of KPI metric tiles */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px; margin-bottom: 16px;
}
.stat {
  padding: 16px; border: 1px solid #edf0f4;
  border-radius: 10px; background: var(--paper); box-shadow: var(--shadow);
}
.stat-ico     { font-size: 22px; margin-bottom: 8px; }
.stat-label   { color: var(--muted); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
.stat strong  { display: block; margin: 6px 0 4px; font-size: 22px; letter-spacing: -.5px; }
.stat small   { color: #909aac; font-size: 9px; }
/* Dark accent variant (used for the most important KPI) */
.stat.accent  { background: linear-gradient(135deg, #1e3a70, #2d5cbf); color: #fff; border: 0; }
.stat.accent .stat-label,
.stat.accent small { color: #adc3e8; }
.stat.accent strong { color: #fff; }

/* ── LAYOUT GRIDS ─────────────────────────────────────────────────────── */
/* Two-column panel grid (used on dashboard) */
.grid2 { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(240px, .9fr); gap: 14px; margin-bottom: 14px; }
/* Three-column panel grid */
.grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 14px; }
/* Auto-fill card grid */
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-bottom: 14px; }

/* ── PANELS ──────────────────────────────────────────────────────────── */
.panel        { border: 1px solid #edf0f4; border-radius: 10px; background: var(--paper); box-shadow: var(--shadow); }
.panel-head   { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px 0; }
.panel-head h2 { margin: 0; font-size: 13px; font-weight: 700; }
.panel-body   { padding: 14px 16px; }
.panel-foot   { padding: 10px 16px 14px; border-top: 1px solid var(--line); }

/* ── NOTICE / ALERT BARS ─────────────────────────────────────────────── */
.notice { padding: 11px 14px; border-radius: 8px; font-size: 11px; line-height: 1.55; margin-bottom: 13px; }
.notice.info    { color: #1e3a70; background: #eef3ff; }
.notice.warn    { color: #795923; background: #fff7e8; }
.notice.danger  { color: #7a1e1e; background: #fff0ef; }
.notice.success { color: #0d4f2e; background: #e6f9f1; }

/* ── BAR CHARTS ──────────────────────────────────────────────────────── */
/* Simple horizontal bars used on the dashboard KPI panels */
.bars    { display: grid; gap: 10px; padding: 14px 16px; }
.barline { display: grid; grid-template-columns: 130px 1fr 70px; align-items: center; gap: 8px; font-size: 10px; color: #67748a; }
.bar-track { height: 8px; border-radius: 8px; background: #eef0f5; }
.bar-fill  { height: 100%; border-radius: 8px; background: #526ce3; transition: width .4s; }
.barline strong { text-align: right; color: #28364c; font-size: 10px; }

/* ── ACTIVITY FEED ───────────────────────────────────────────────────── */
/* Recent-activity list shown on dashboard panels */
.activities    { padding: 0 16px 6px; }
.activity      { display: grid; grid-template-columns: 30px 1fr; gap: 9px; padding: 9px 0; border-bottom: 1px solid #f0f2f6; }
.activity:last-child { border: 0; }
.act-ico       { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; color: #5163c1; background: var(--blue-soft); font-size: 13px; }
.activity p    { margin: 0; font-size: 10px; color: #596579; line-height: 1.5; }
.activity time { font-size: 9px; color: #99a3b1; }

/* ── MODULE CARDS ────────────────────────────────────────────────────── */
/* Used on dashboard "all portals" grid and settings pages */
.module-card   { padding: 16px; border-radius: 10px; border: 1px solid #edf0f4; background: #fff; box-shadow: var(--shadow); }
.module-card .mc-icon { font-size: 28px; margin-bottom: 10px; }
.module-card h3       { margin: 0 0 6px; font-size: 13px; font-weight: 700; }
.module-card p        { margin: 0 0 12px; color: var(--muted); font-size: 11px; line-height: 1.5; }

/* ── DATA TABLES ─────────────────────────────────────────────────────── */
/* Wraps the table in a card with its own shadow */
.table-wrap    { border: 1px solid #edf0f4; border-radius: 10px; background: #fff; box-shadow: var(--shadow); overflow: hidden; margin-bottom: 14px; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 13px 15px; border-bottom: 1px solid #f0f2f5; flex-wrap: wrap; }
.table-toolbar h2 { margin: 0; font-size: 12px; font-weight: 700; }
.filters       { display: flex; gap: 7px; flex-wrap: wrap; }
/* Search input used in the toolbar */
.search        { min-height: 32px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 7px; font-size: 10px; }
.table-scroll  { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
th {
  padding: 9px 13px; border-block: 1px solid #f0f2f5;
  color: #8591a1; background: #fafbfd;
  text-transform: uppercase; letter-spacing: .4px; font-size: 9px; font-weight: 700;
}
td  { padding: 10px 13px; border-bottom: 1px solid #f0f2f5; color: #536177; font-size: 10px; }
tbody tr:hover td { background: #fafbff; }
tbody tr:last-child td { border: 0; }
/* Person cell: avatar + name + sub-line */
.person         { display: flex; align-items: center; gap: 8px; }
.person strong  { display: block; color: #26344a; font-size: 10px; line-height: 1.3; }
.person small   { display: block; margin-top: 2px; color: #96a0ae; font-size: 9px; }
/* Empty state shown when a table has no rows */
.empty          { padding: 40px 20px; text-align: center; color: var(--muted); font-size: 11px; }
.empty strong   { display: block; margin-bottom: 5px; color: #36445a; font-size: 13px; }
/* Action buttons cell */
.td-actions     { display: flex; gap: 5px; }

/* ── STATUS BADGES ───────────────────────────────────────────────────── */
/* Small pill labels for statuses, roles, and categories */
.badge { display: inline-flex; padding: 3px 8px; border-radius: 99px; font-size: 9px; font-weight: 700; }
.badge.green  { color: var(--green);  background: var(--green-soft);  }
.badge.amber  { color: var(--amber);  background: var(--amber-soft);  }
.badge.red    { color: var(--red);    background: var(--red-soft);    }
.badge.blue   { color: var(--blue);   background: var(--blue-soft);   }
.badge.purple { color: var(--purple); background: var(--purple-soft); }
.badge.navy   { color: #fff;          background: var(--navy);        }
.badge.gray   { color: #555;          background: #f0f2f5;            }

/* ── MODAL ───────────────────────────────────────────────────────────── */
/* Full-screen backdrop with centred dialog */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  display: grid; place-items: center; padding: 18px;
  background: #14213780; backdrop-filter: blur(2px);
}
.modal {
  width: min(100%, 640px); max-height: 90vh; overflow-y: auto;
  border-radius: 13px; background: #fff; box-shadow: 0 20px 60px #101d3340;
}
.modal.wide   { width: min(100%, 860px); }
.modal.narrow { width: min(100%, 440px); }
/* Sticky modal header (stays visible while scrolling the form) */
.modal-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 18px; border-bottom: 1px solid var(--line);
  position: sticky; top: 0; background: #fff; z-index: 2;
}
.modal-head h2 { margin: 0; font-size: 15px; font-weight: 700; }
.modal-body    { padding: 8px 18px 16px; }
.modal-foot    { padding: 12px 18px 16px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 8px; }
/* Two-column form inside modal body */
.form-grid     { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
.form-grid .full { grid-column: 1 / -1; } /* Spans both columns */
/* Section divider line inside a form */
.section-title {
  font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase;
  letter-spacing: .5px; margin: 16px 0 4px; grid-column: 1 / -1;
  padding-top: 10px; border-top: 1px solid var(--line);
}

/* ── PHOTO UPLOAD ─────────────────────────────────────────────────────── */
/* Preview + file input side-by-side */
.photo-zone    { display: flex; align-items: flex-start; gap: 14px; }
.photo-preview {
  width: 72px; height: 88px; border-radius: 6px; object-fit: cover;
  border: 2px solid var(--line); background: #f4f6fa;
  display: grid; place-items: center; color: var(--muted);
  font-size: 9px; text-align: center; flex-shrink: 0; overflow: hidden;
}
.photo-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }

/* ── REPORT CARD ─────────────────────────────────────────────────────── */
.report-card {
  background: #fff; padding: 22px; font-family: serif;
  border: 2px solid #233957; position: relative; overflow: hidden;
}
/* SVG watermark behind the report card content */
.report-watermark {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
  opacity: .06; pointer-events: none; z-index: 0;
  width: 200px; height: 230px;
}
.report-content { position: relative; z-index: 1; }
/* School header inside the report card */
.report-header  { text-align: center; padding-bottom: 12px; border-bottom: 2px solid #233957; margin-bottom: 14px; }
.report-header h2 { margin: 6px 0; font-size: 17px; font-weight: 900; color: #17263d; }
.report-header p  { margin: 2px 0; font-size: 11px; color: #555; }
/* Pupil photo + bio next to each other */
.report-meta    { display: grid; grid-template-columns: 80px 1fr; gap: 14px; margin-bottom: 14px; }
.report-photo   {
  width: 80px; height: 100px; border: 1px solid #ccc; border-radius: 4px;
  object-fit: cover; display: grid; place-items: center;
  color: #aaa; font-size: 9px; text-align: center; background: #f5f5f5; overflow: hidden;
}
.report-photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }
.report-info      { font-size: 11px; line-height: 2; }
/* Marks table inside the report card */
.report-table     { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px; }
.report-table th,
.report-table td  { border: 1px solid #ccc; padding: 6px 9px; }
.report-table th  { background: #f0f4f9; font-weight: 700; font-size: 10px; }
.grade-cell       { font-weight: 700; text-align: center; }
/* Summary row below the marks table */
.report-summary   { display: flex; gap: 20px; font-size: 11px; margin-bottom: 10px; }
/* Comments box */
.report-comments  {
  font-size: 11px; line-height: 1.7; border: 1px solid #ccc;
  padding: 8px; border-radius: 4px; margin-bottom: 10px; min-height: 50px;
}
/* Three signature lines at the bottom */
.report-sigs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; font-size: 10px; margin-top: 16px; }
.sig-line    { border-top: 1px solid #333; padding-top: 4px; text-align: center; color: #555; }

/* ── TIMETABLE GRID ──────────────────────────────────────────────────── */
.timetable-grid    { width: 100%; border-collapse: collapse; font-size: 10px; }
.timetable-grid th { background: #1a3d6b; color: #fff; padding: 8px; text-align: center; font-size: 9px; font-weight: 700; }
.timetable-grid td { border: 1px solid #dde3ec; padding: 6px 8px; min-width: 100px; vertical-align: top; }
.timetable-grid td.time-col { background: #f4f6fa; font-weight: 700; color: #445; font-size: 9px; white-space: nowrap; min-width: 80px; }
/* Individual lesson cell inside the timetable */
.tt-cell           { background: var(--blue-soft); border-radius: 4px; padding: 4px 6px; }
.tt-cell .subject  { font-weight: 700; color: #1a3d6b; font-size: 10px; }
.tt-cell .teacher  { color: var(--muted); font-size: 9px; }
.tt-empty          { color: #ccc; font-size: 9px; text-align: center; display: block; padding: 10px 0; }

/* ── PAYMENT RECEIPT ─────────────────────────────────────────────────── */
.receipt        { background: #fff; padding: 24px; border: 1px solid #ccc; font-size: 11px; max-width: 440px; }
.receipt-header { text-align: center; border-bottom: 2px solid #17263d; padding-bottom: 12px; margin-bottom: 14px; }
.receipt-row    { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dotted #eee; }
.receipt-total  { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; font-weight: 700; border-top: 2px solid #17263d; margin-top: 8px; }

/* ── TOAST NOTIFICATION ──────────────────────────────────────────────── */
.toast {
  position: fixed; z-index: 99; bottom: 22px; left: 50%; transform: translateX(-50%);
  padding: 11px 18px; border-radius: 9px; font-size: 11px; font-weight: 600;
  box-shadow: 0 8px 30px #0004; animation: slideUp .2s ease; white-space: nowrap;
}
.toast.default { color: #fff; background: #24354e; }
.toast.success { color: #fff; background: var(--green); }
.toast.error   { color: #fff; background: var(--red);   }
@keyframes slideUp {
  from { transform: translateX(-50%) translateY(10px); opacity: 0; }
  to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
}

/* ── MISCELLANEOUS HELPERS ───────────────────────────────────────────── */
.divider  { height: 1px; background: var(--line); margin: 18px 0; }
.tag      { display: inline-block; padding: 2px 7px; border-radius: 5px; font-size: 9px; font-weight: 700; background: #f0f2f5; color: #445; }
.chip-row { display: flex; gap: 5px; flex-wrap: wrap; }
.mt8  { margin-top: 8px;  }
.mt16 { margin-top: 16px; }
.mb14 { margin-bottom: 14px; }

/* ── RESPONSIVE BREAKPOINTS ──────────────────────────────────────────── */
@media (max-width: 1100px) {
  .sidebar        { width: 220px; }
  .main           { margin-left: 220px; }
  .content        { padding: 20px 18px; }
  .grid2          { grid-template-columns: 1fr; }     /* Stack panels vertically */
  .barline        { grid-template-columns: 110px 1fr 50px; }
}
@media (max-width: 720px) {
  /* On small screens the login page becomes single-column */
  .login-wrap     { grid-template-columns: 1fr; }
  .login-left     { min-height: 180px; padding: 22px; }
  .login-hero     { margin: 20px 0 14px; }
  .login-hero h1  { font-size: 26px; margin: 10px 0; }
  .login-hero p, .login-footer { display: none; } /* Hide decorative copy on mobile */
  /* Sidebar hides off-screen; toggled by the ☰ menu button */
  .sidebar        { width: 260px; transform: translateX(-100%); }
  .sidebar.open   { transform: translateX(0); box-shadow: 10px 0 40px #101d3355; }
  .main           { margin-left: 0; }
  .topbar         { padding: 0 14px; height: 56px; }
  .today-date     { display: none; }
  .content        { padding: 18px 13px 36px; }
  .page-head      { flex-direction: column; align-items: flex-start; }
  .stats          { grid-template-columns: 1fr 1fr; }
  .cards          { grid-template-columns: 1fr; }
  .form-grid      { grid-template-columns: 1fr; }
  .form-grid .full { grid-column: auto; }
  .field-row      { grid-template-columns: 1fr; }
  .table-toolbar  { flex-direction: column; align-items: flex-start; }
}
/* ── PRINT STYLES ─────────────────────────────────────────────────────── */
@media print {
  body { background: #fff; }
  body::before {
    content: url("star%20logo.png");
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    width: auto;
    height: 72vh;
    max-width: 80vw;
    object-fit: contain;
    transform: translate(-50%, -50%);
    opacity: .07;
    pointer-events: none;
  }
  #root, .main { position: relative; z-index: 1; }
  .print-only { display: block !important; }
  /* Hide navigation and non-essential UI when printing */
  .sidebar, .topbar, .page-head, .no-print, .toast, .modal-backdrop { display: none !important; }
  .main            { margin: 0 !important; }
  .content         { max-width: none; padding: 0; }
  .table-wrap, .panel { box-shadow: none; border: 0; }
  .table-scroll    { overflow: visible; }
  .pupil-register-table .table-scroll th:last-child,
  .pupil-register-table .table-scroll td:last-child { display: none; }
  table            { white-space: normal; }
  th, td           { font-size: 9px; }
}
    `;
    document.head.appendChild(style);
  }

  /* ===========================================================================
     TOAST NOTIFICATION
     Shows a small banner at the bottom of the screen for 3.5 seconds.
     type: "default" | "success" | "error"
  =========================================================================== */

  /**
   * Display a brief notification message.
   * @param {string} msg      - The message text
   * @param {string} type     - "default" | "success" | "error"
   * @param {number} duration - Milliseconds before auto-dismiss (default 3500)
   */
  function toast(msg, type = "default", duration = 3500) {
    // Remove any existing toast before showing a new one
    document.querySelectorAll(".toast").forEach(e => e.remove());
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  /* ===========================================================================
     AUTHENTICATION
     Each portal has its own isolated account list filtered by role key.
     All passwords are hashed with PBKDF2-SHA256 before storage.
     Flow:
       Sign up  → hash password + generate recovery code → store account
       Sign in  → find account → verify hash
       Forgot   → verify recovery code → allow password reset → new recovery code
  =========================================================================== */

  /**
   * Render the complete authentication UI (sign-in / sign-up / forgot)
   * for the given portal role inside #root.
   * Called by KHA.init() when no valid session exists.
   *
   * @param {string} roleKey - One of the keys in ROLES
   */
  function renderLogin(roleKey) {
    const roleInfo = ROLES[roleKey];
    if (!roleInfo) {
      document.getElementById("root").innerHTML = "<p>Unknown portal: " + roleKey + "</p>";
      return;
    }

    let mode   = "signin"; // "signin" | "signup" | "forgot"
    let errMsg = "";

    /** Redraw the auth form when the mode or error changes */
    function draw() {
      const isSU = mode === "signup";
      const isFG = mode === "forgot";

      document.getElementById("root").innerHTML =
        /* ── Left hero panel ── */
        '<div class="login-wrap">'
        + '<section class="login-left">'
        +   '<div class="login-brand">'
        +     '<div class="login-badge">' + BADGE_SVG + '</div>'
        +     '<div class="login-brand-text">' + esc(SCHOOL_NAME)
        +       '<small>' + esc(SCHOOL_SUB) + '</small></div>'
        +   '</div>'
        +   '<div class="login-hero">'
        +     '<small>' + esc(roleInfo.label) + ' Portal</small>'
        +     '<h1>Welcome to<br>' + esc(SCHOOL_NAME) + '</h1>'
        +     '<p>' + esc(SCHOOL_MOTTO) + ' · ' + esc(CURRENT_YEAR) + '</p>'
        +   '</div>'
        +   '<div class="login-footer">Kasese · Western Uganda · Est. School Management v2</div>'
        + '</section>'

        /* ── Right auth form ── */
        + '<section class="login-right">'
        +   '<div class="auth-card">'
        +     '<div style="width:48px;height:55px;margin-bottom:14px">' + BADGE_SVG + '</div>'
        +     '<h2>' + (isSU ? "Create account" : isFG ? "Reset password" : "Sign in") + '</h2>'
        +     '<p class="auth-sub">' + esc(roleInfo.title) + ' · ' + esc(SCHOOL_NAME) + '</p>'

        /* Tab switcher (hidden on the forgot-password screen) */
        +     (isFG ? '' :
               '<div class="auth-tabs">'
        +         '<button type="button" data-mode="signin" class="' + (!isSU ? "active" : "") + '">Sign in</button>'
        +         '<button type="button" data-mode="signup" class="' + (isSU ? "active" : "") + '">Create account</button>'
        +       '</div>')

        /* Auth form */
        +     '<form id="authForm" novalidate>'
        +       (isSU ? '<div class="field"><label>Full name</label>'
        +         '<input name="fullName" maxlength="80" autocomplete="name" required></div>' : '')
        +       '<div class="field"><label>Email address</label>'
        +         '<input name="email" type="email" autocomplete="email" required></div>'
        /* Recovery code input — only on forgot-password mode */
        +       (isFG ? '<div class="field"><label>Recovery code</label>'
        +         '<input name="code" autocomplete="off" required>'
        +         '<span class="hint">The one-time code shown when you created your account.</span></div>' : '')
        +       '<div class="field"><label>' + (isFG ? "New password" : "Password") + '</label>'
        +         '<input name="password" type="password" minlength="8" '
        +         'autocomplete="' + (isSU || isFG ? "new-password" : "current-password") + '" '
        +         'placeholder="At least 8 characters" required></div>'
        /* Confirm password — on sign-up and password reset */
        +       (isSU || isFG ? '<div class="field"><label>Confirm password</label>'
        +         '<input name="confirm" type="password" minlength="8" autocomplete="new-password" required></div>' : '')
        /* Inline error message */
        +       (errMsg ? '<p class="auth-err" role="alert">' + esc(errMsg) + '</p>' : '')
        +       '<button class="btn full" type="submit">'
        +         (isSU ? "Create account" : isFG ? "Reset password" : "Sign in →")
        +       '</button>'
        +     '</form>'

        /* Forgot / back links */
        +     (!isFG
               ? '<button class="auth-link" data-mode="forgot">Forgot password?</button>'
               : '<button class="auth-link" data-mode="signin">← Back to sign in</button>')

        /* Prototype warning */
        +     '<div class="auth-note"><strong>Security note:</strong> '
        +     'Passwords are hashed with PBKDF2-SHA256 (150,000 iterations). '
        +     'School records are stored in this browser only. '
        +     'Production deployment requires a server-side database, HTTPS, and regular backups.</div>'
        +   '</div>'
        + '</section>'
        + '</div>';

      /* Attach mode-switching listeners to tab / link buttons */
      document.querySelectorAll("[data-mode]").forEach(btn =>
        btn.addEventListener("click", () => { mode = btn.dataset.mode; errMsg = ""; draw(); })
      );
      document.getElementById("authForm").addEventListener("submit", handleSubmit);
    }

    /** Handle sign-up, sign-in, and password reset form submissions */
    async function handleSubmit(e) {
      e.preventDefault();
      const fd    = new FormData(e.currentTarget);
      const email = String(fd.get("email") || "").trim().toLowerCase();
      const pwd   = String(fd.get("password") || "");
      errMsg = "";

      /* Basic front-end validation */
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errMsg = "Enter a valid email address."; draw(); return;
      }
      if (pwd.length < 8) {
        errMsg = "Password must be at least 8 characters."; draw(); return;
      }

      /* Disable the submit button while the async hash runs */
      const submitBtn = e.currentTarget.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Please wait…";

      try {
        const accounts = load(STORE.accounts, []);

        /* ── CREATE ACCOUNT ── */
        if (mode === "signup") {
          const name = String(fd.get("fullName") || "").trim();
          if (!name) throw new Error("Enter your full name.");
          if (pwd !== fd.get("confirm")) throw new Error("Passwords do not match.");
          if (accounts.some(a => a.role === roleKey && a.email === email))
            throw new Error("An account already exists for this email in the " + roleInfo.label + " portal.");

          /* Generate cryptographic salt (16 bytes) for the password hash */
          const salt  = randHex(16);
          /* Generate a separate salt for the recovery code */
          const rSalt = randHex(16);
          /* One-time recovery code shown to the user exactly once */
          const code  = randHex(16);

          const acc = {
            id:        uid(),
            role:      roleKey,
            email,
            name,
            salt,
            hash:      await hashPwd(pwd, salt),   // Hashed password
            rSalt,
            rHash:     await hashPwd(code, rSalt),  // Hashed recovery code
            createdAt: nowISO()
          };
          accounts.push(acc);
          save(STORE.accounts, accounts);
          showRecovery(code, acc); // Show the recovery code to the user
          return;
        }

        /* Find existing account for this email + portal */
        const acc = accounts.find(a => a.role === roleKey && a.email === email);
        if (!acc)
          throw new Error("No account found for this email in the " + roleInfo.label + " portal.");

        /* ── FORGOT PASSWORD / RESET ── */
        if (mode === "forgot") {
          const inputCode = String(fd.get("code") || "").replace(/\s/g, "").toUpperCase();
          if (!acc.rSalt || !acc.rHash)
            throw new Error("No recovery code exists for this account. Contact the school administrator.");
          if (await hashPwd(inputCode, acc.rSalt) !== acc.rHash)
            throw new Error("Recovery code is incorrect.");
          if (pwd !== fd.get("confirm")) throw new Error("Passwords do not match.");

          /* Issue a new salt + recovery code so the old one is invalidated */
          const salt    = randHex(16);
          const rSalt   = randHex(16);
          const newCode = randHex(16);
          acc.salt  = salt;  acc.hash  = await hashPwd(pwd, salt);
          acc.rSalt = rSalt; acc.rHash = await hashPwd(newCode, rSalt);
          save(STORE.accounts, accounts);
          showRecovery(newCode, acc);
          return;
        }

        /* ── SIGN IN ── */
        if (await hashPwd(pwd, acc.salt) !== acc.hash)
          throw new Error("Incorrect password.");

        /* Store a session token (role + user info) in sessionStorage.
           sessionStorage is cleared when the browser tab/window is closed,
           which serves as automatic session expiry. */
        sessionStorage.setItem("kha_session", JSON.stringify({
          role: roleKey, id: acc.id, name: acc.name, email: acc.email
        }));
        window.location.reload(); // Reload so KHA.init picks up the session

      } catch (err) {
        console.error("Auth error:", err);
        errMsg = err.message || "Authentication failed.";
        draw();
        /* Re-populate the email field so the user doesn't have to retype it */
        const emailInput = document.getElementById("authForm")?.querySelector('[name="email"]');
        if (emailInput) emailInput.value = email;
      }
    }

    /**
     * Show the one-time recovery code screen.
     * The raw code is displayed once; only its hash is persisted.
     */
    function showRecovery(code, acc) {
      document.getElementById("root").innerHTML =
        '<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--canvas)">'
        + '<div class="recovery-card">'
        +   '<div style="width:44px;height:51px;margin-bottom:14px">' + BADGE_SVG + '</div>'
        +   '<h2 style="margin:0 0 6px">Save your recovery code</h2>'
        +   '<p class="auth-sub">This code is shown <strong>once only</strong>. '
        +   'Store it in a safe place — you will need it to reset your password.</p>'
        +   '<div class="notice warn" style="margin-bottom:0">'
        +   '⚠️ Never share this code. Anyone with it can reset your portal password.</div>'
        +   '<div class="codebox" id="rcCode">' + esc(code) + '</div>'
        +   '<div style="display:flex;gap:8px;margin-top:14px">'
        +     '<button class="btn secondary" id="rcCopy">Copy code</button>'
        +     '<button class="btn" id="rcDone">I\'ve saved it — continue →</button>'
        +   '</div>'
        + '</div>'
        + '</div>';

      document.getElementById("rcCopy").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code);
          toast("Recovery code copied to clipboard.", "success");
        } catch (_) {
          toast("Select and copy the code manually.");
        }
      });

      document.getElementById("rcDone").addEventListener("click", () => {
        /* Start the session now that the account is set up */
        sessionStorage.setItem("kha_session", JSON.stringify({
          role: acc.role, id: acc.id, name: acc.name, email: acc.email
        }));
        window.location.reload();
      });
    }

    draw(); // Initial render
  }

  /* ===========================================================================
     SESSION MANAGEMENT
  =========================================================================== */

  /**
   * Read the current session from sessionStorage.
   * Returns null if there is no valid session.
   */
  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem("kha_session") || "null");
    } catch (_) { return null; }
  }

  /**
   * Clear the session and reload the page to show the login screen.
   * Called by the "Sign out" button in every portal.
   */
  function signOut() {
    sessionStorage.removeItem("kha_session");
    window.location.reload();
  }

  /**
   * Entry point called by every portal HTML file on DOMContentLoaded.
   * 1. Injects shared CSS
   * 2. Checks sessionStorage for a valid session matching roleKey
   * 3. If no session → shows the login screen
   * 4. If session found → calls bootFn(session) so the portal can render
   *
   * @param {string}   roleKey - Portal role key (e.g. "admin", "dos")
   * @param {Function} bootFn  - Called with the session object when authenticated
   */
  function init(roleKey, bootFn) {
    injectCSS();
    const session = getSession();
    if (!session || session.role !== roleKey) {
      renderLogin(roleKey); // Show login if not authenticated for this portal
      return;
    }
    bootFn(session); // Portal boot callback
  }

  /* ===========================================================================
     APP SHELL BUILDER
     Renders the fixed sidebar and sticky topbar.
     Each portal calls this once, then calls KHA.setContent() to swap pages.
  =========================================================================== */

  /**
   * Build and inject the full app shell (sidebar + topbar + empty content area).
   *
   * @param {object} opts
   * @param {string}   opts.roleKey    - Role key for ROLES lookup
   * @param {object}   opts.navGroups  - { "Group": ["Page1", "Page2"] }
   * @param {string}   opts.activePage - Currently active page name
   * @param {Function} opts.onNav      - Callback when a nav item is clicked
   * @param {object}   opts.session    - { name, email }
   * @param {string}   [opts.extraRight] - Extra HTML in the topbar right side
   */
  function buildShell(opts) {
    const { roleKey, navGroups, activePage, onNav, session, extraRight = "" } = opts;
    const roleInfo = ROLES[roleKey];
    const rootEl   = document.getElementById("root");

    /* Build sidebar navigation HTML from the groups definition */
    const navHTML = Object.entries(navGroups).map(([group, pages]) =>
      '<div class="nav-group">' + esc(group) + '</div>'
      + pages.map(p =>
          '<button class="nav-item' + (activePage === p ? " active" : "") + '" data-nav="' + esc(p) + '">'
          + '<span class="nav-ico">' + (ICONS[p] || "•") + '</span>'
          + esc(p)
          + '</button>'
        ).join("")
    ).join("");

    rootEl.innerHTML =
      '<div class="app">'

      /* ── Sidebar ── */
      + '<aside class="sidebar" id="kha-sidebar">'
      +   '<div class="sidebar-brand">'
      +     '<div class="sidebar-badge">' + BADGE_SVG + '</div>'
      +     '<div class="sidebar-name">' + esc(SCHOOL_NAME)
      +       '<small>' + esc(SCHOOL_SUB) + '</small>'
      +     '</div>'
      +   '</div>'
      +   '<div class="portal-tag">' + esc(roleInfo.label) + ' Portal</div>'
      +   '<nav class="nav-list" aria-label="Main navigation">' + navHTML + '</nav>'
      +   '<div class="side-foot">'
      +     '<div class="user-chip">'
      +       '<span class="avatar" aria-hidden="true">' + esc(initials(session.name)) + '</span>'
      +       '<span>'
      +         '<strong>' + esc(session.name) + '</strong>'
      +         '<small>' + esc(session.email) + '</small>'
      +       '</span>'
      +     '</div>'
      +     '<button class="nav-item" id="kha-signout">'
      +       '<span class="nav-ico">↪</span>Sign out'
      +     '</button>'
      +   '</div>'
      + '</aside>'

      /* ── Main content area ── */
      + '<div class="main">'
      +   '<header class="topbar" role="banner">'
      +     '<div class="top-left">'
      /* ☰ Hamburger — only visible on small screens (CSS handles it) */
      +       '<button class="btn icon" id="kha-menu" aria-label="Toggle navigation menu" title="Menu">☰</button>'
      /* Back button — enabled/disabled by portal JS */
      +       '<button class="btn icon" id="kha-back" aria-label="Go back" title="Go back" disabled>←</button>'
      +       '<div class="crumb" aria-label="Breadcrumb">'
      +         esc(SCHOOL_NAME) + ' / <strong id="kha-crumb">' + esc(activePage) + '</strong>'
      +       '</div>'
      +     '</div>'
      +     '<div class="top-right">'
      +       extraRight
      +       '<span class="today-date">'
      +         new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"short", year:"numeric" })
      +       '</span>'
      +       '<span class="avatar sm" aria-hidden="true">' + esc(initials(session.name)) + '</span>'
      +     '</div>'
      +   '</header>'
      /* Content is replaced by setContent() on each navigation */
      +   '<section id="kha-content" class="content" role="main"></section>'
      + '</div>'
      + '</div>';

    /* ── Wire up shell buttons ── */

    /* Sign out */
    document.getElementById("kha-signout").addEventListener("click", signOut);

    /* Mobile hamburger toggles the .open class on the sidebar */
    document.getElementById("kha-menu").addEventListener("click", () =>
      document.getElementById("kha-sidebar").classList.toggle("open")
    );

    /* Close sidebar when clicking a nav item on mobile */
    document.querySelectorAll("[data-nav]").forEach(btn =>
      btn.addEventListener("click", () => {
        onNav(btn.dataset.nav);
        document.getElementById("kha-sidebar").classList.remove("open");
      })
    );

  }

  /**
   * Replace the #kha-content area with new HTML.
   * Called every time the user navigates to a new page.
   */
  function setContent(html) {
    const el = document.getElementById("kha-content");
    if (el) el.innerHTML = html;
  }

  /**
   * Update the breadcrumb text and mark the correct nav item as active.
   * @param {string} page - Page name matching a key in the nav group
   */
  function setCrumb(page) {
    const el = document.getElementById("kha-crumb");
    if (el) el.textContent = page;
    document.querySelectorAll("[data-nav]").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.nav === page)
    );
  }

  /* ===========================================================================
     MODAL HELPERS
     Portals open forms and detail views in overlay modals.
  =========================================================================== */

  /**
   * Render HTML inside a centred modal dialog and append it to <body>.
   * Clicking the backdrop closes the modal.
   * @param {string}  html - Inner HTML for the .modal element
   * @param {boolean} wide - If true, uses the wider modal variant
   */
  function openModal(html, wide = false) {
    closeModal(); // Only one modal at a time
    const bd  = document.createElement("div");
    bd.className = "modal-backdrop";
    bd.id        = "kha-modal-bd";
    bd.innerHTML = '<div class="modal' + (wide ? " wide" : "") + '" id="kha-modal" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(bd);
    /* Close when clicking outside the modal dialog */
    bd.addEventListener("click", e => { if (e.target === bd) closeModal(); });
    /* Trap focus within the modal for accessibility */
    const firstInput = bd.querySelector("input, select, textarea, button:not([disabled])");
    if (firstInput) firstInput.focus();
  }

  /** Remove the modal backdrop and dialog from the DOM. */
  function closeModal() {
    document.getElementById("kha-modal-bd")?.remove();
  }

  /* ===========================================================================
     PHOTO / FILE UPLOAD HELPERS
     Photos are stored as base64 data-URLs in localStorage alongside their records.
     This avoids the need for a file server.  Large images should be resized
     before upload to avoid hitting the localStorage quota.
  =========================================================================== */

  /**
   * Generate the HTML for a photo upload field with a live preview.
   * @param {string} fieldName  - The <input name> attribute value
   * @param {string} currentSrc - Existing photo data-URL (for edit forms)
   * @param {string} label      - Field label text
   * @returns {string} HTML string
   */
  function photoField(fieldName, currentSrc, label) {
    return '<div class="field full">'
      + '<label>' + esc(label || "Photo") + '</label>'
      + '<div class="photo-zone">'
      /* Live preview box; updated by wirePhotoInputs() */
      +   '<div class="photo-preview" id="pp-' + esc(fieldName) + '">'
      +     (currentSrc
            ? '<img src="' + esc(currentSrc) + '" alt="Current photo">'
            : '<span style="padding:8px">No<br>photo</span>')
      +   '</div>'
      +   '<div>'
      +     '<input type="file" name="' + esc(fieldName) + '" accept="image/*" '
      +     'style="font-size:11px" data-photo-for="' + esc(fieldName) + '">'
      +     '<p class="hint">JPG or PNG recommended. Photo appears on records and report cards.</p>'
      +   '</div>'
      + '</div>'
      + '</div>';
  }

  /**
   * Attach live-preview handlers to all [data-photo-for] inputs inside a container.
   * When the user selects a file, the preview image updates immediately.
   * @param {HTMLElement} container - The form or modal element
   */
  function wirePhotoInputs(container) {
    container.querySelectorAll("input[data-photo-for]").forEach(input => {
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          const preview = document.getElementById("pp-" + input.dataset.photoFor);
          if (preview) preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
        };
        reader.readAsDataURL(file);
      });
    });
  }

  /**
   * Read the first file from a file input as a base64 data-URL.
   * Returns a Promise that resolves to the data-URL string, or null if
   * no file was selected.
   * @param {HTMLInputElement} input
   * @returns {Promise<string|null>}
   */
  function readPhoto(input) {
    return new Promise(resolve => {
      const file = input?.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  /* ===========================================================================
     TABLE BUILDER
     Generates a responsive HTML table from column definitions and row data.
  =========================================================================== */

  /**
   * Build an HTML table.
   * @param {Array<{key:string, label:string, render?:Function}>} cols
   *   Column definitions.  render(row) is optional — defaults to esc(row[key]).
   * @param {Array<object>} rows    - Data rows
   * @param {Function|null} actFn  - actFn(row) returns HTML for the Actions cell
   * @returns {string} HTML string
   */
  function buildTable(cols, rows, actFn) {
    if (!rows.length) {
      return '<div class="empty"><strong>No records found</strong>'
        + 'Records will appear here once they have been added.</div>';
    }
    return '<div class="table-scroll"><table>'
      + '<thead><tr>'
      + cols.map(c => '<th>' + esc(c.label) + '</th>').join("")
      + (actFn ? '<th>Actions</th>' : '')
      + '</tr></thead>'
      + '<tbody>'
      + rows.map(row =>
          '<tr data-id="' + esc(row.id) + '">'
          + cols.map(c =>
              '<td>' + (c.render ? c.render(row) : esc(row[c.key] ?? "—")) + '</td>'
            ).join("")
          + (actFn ? '<td><div class="td-actions">' + actFn(row) + '</div></td>' : '')
          + '</tr>'
        ).join("")
      + '</tbody></table></div>';
  }

  /* ===========================================================================
     REUSABLE PAGE BUILDING BLOCKS
  =========================================================================== */

  /**
   * Render a standard page header (h1 + description + action buttons).
   * @param {string} title       - Page title (h1)
   * @param {string} desc        - Sub-description paragraph
   * @param {string} actionsHTML - HTML for action buttons (right side)
   */
  function pageHead(title, desc, actionsHTML = "") {
    return '<div class="page-head no-print">'
      + '<div><h1>' + esc(title) + '</h1><p>' + esc(desc) + '</p></div>'
      + '<div class="actions">' + actionsHTML + '</div>'
      + '</div>';
  }

  /**
   * Render a stat/KPI card.
   * @param {string}  icon   - Emoji icon
   * @param {string}  label  - Small label above the value
   * @param {string}  value  - Main large value
   * @param {string}  detail - Small detail below the value
   * @param {boolean} accent - If true, uses the dark accent card style
   */
  function statCard(icon, label, value, detail, accent = false) {
    return '<article class="stat' + (accent ? " accent" : "") + '">'
      + (icon ? '<div class="stat-ico" aria-hidden="true">' + icon + '</div>' : '')
      + '<span class="stat-label">' + esc(label) + '</span>'
      + '<strong>' + esc(value) + '</strong>'
      + '<small>' + esc(detail) + '</small>'
      + '</article>';
  }

  const parentUpdateRoles = ["admin", "registrar", "dos", "accountant", "property", "boarding"];
  const parentUpdateCategories = ["General", "Academic", "Attendance", "Fees", "Transport", "Boarding", "Reminder", "Emergency"];
  const parentUpdateBindings = new WeakSet();

  function renderParentUpdates(roleKey, session) {
    const isAdmin = roleKey === "admin";
    const role = ROLES[roleKey];
    if (!role || !parentUpdateRoles.includes(roleKey)) return "";
    const updates = load(STORE.parentUpdates, [])
      .filter(update => isAdmin || update.department === roleKey)
      .slice()
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    const students = load(STORE.students, []);
    const form = '<section class="panel" style="margin-bottom:14px"><div class="panel-head"><h2>Publish an update</h2><small>Visible in the Parent Portal</small></div><div class="panel-body">'
      + '<form data-parent-update-form class="form-grid">'
      + '<input type="hidden" name="updateId" value="">'
      + '<div class="field"><label>Category</label><select name="category" required>' + parentUpdateCategories.map(category => '<option value="' + esc(category) + '">' + esc(category) + '</option>').join("") + '</select></div>'
      + '<div class="field"><label>Share with</label><select name="studentId"><option value="">All parents</option>' + students.filter(student => student.status !== "Transferred" && student.status !== "Graduated").map(student => '<option value="' + esc(student.id) + '">' + esc(student.name) + ' · ' + esc(student.admission || "No admission number") + '</option>').join("") + '</select></div>'
      + '<div class="field"><label>Title</label><input name="title" maxlength="120" required></div>'
      + '<div class="field"><label>Date</label><input name="date" type="date" value="' + esc(today()) + '" required></div>'
      + '<div class="field full"><label>Message</label><textarea name="message" maxlength="2000" required></textarea></div>'
      + '<div class="field full" style="display:flex;gap:8px"><button class="btn" type="submit" data-parent-update-submit>Publish to parents</button><button class="btn secondary" type="button" data-parent-update-cancel hidden>Cancel edit</button></div>'
      + '</form></div></section>';
    const list = updates.length ? '<div class="table-wrap">' + buildTable([
      {key:"date",label:"Date",render:update => fmtDate(update.date)},
      {key:"departmentName",label:"Department"},
      {key:"category",label:"Category"},
      {key:"title",label:"Title"},
      {key:"message",label:"Message"},
      {key:"studentName",label:"Shared with",render:update => esc(update.studentName || "All parents")}
    ], updates, update => '<button class="btn secondary small" data-parent-update-edit="' + esc(update.id) + '">Edit</button><button class="btn danger small" data-parent-update-delete="' + esc(update.id) + '">Delete</button>') + '</div>'
      : '<div class="empty"><strong>No parent updates yet</strong>Updates published by departments will appear here.</div>';
    return pageHead("Parent updates", "Publish notices, reminders, and information for parents.", "")
      + (isAdmin ? '<div class="notice info">As administrator, you can review updates from all departments.</div>' : "")
      + form + list;
  }

  function wireParentUpdates(content, roleKey, session, refresh) {
    if (!content || parentUpdateBindings.has(content)) return;
    parentUpdateBindings.add(content);
    const role = ROLES[roleKey];
    content.addEventListener("submit", function(event) {
      const form = event.target.closest("[data-parent-update-form]");
      if (!form) return;
      event.preventDefault();
      const data = new FormData(form);
      const title = String(data.get("title") || "").trim();
      const message = String(data.get("message") || "").trim();
      const date = String(data.get("date") || "");
      if (!title || !message || !date) {
        toast("Enter a title, message, and date before publishing.", "error");
        return;
      }
      const isAdmin = roleKey === "admin";
      const records = load(STORE.parentUpdates, []);
      const updateId = String(data.get("updateId") || "");
      const targetId = String(data.get("studentId") || "");
      const target = targetId ? load(STORE.students, []).find(student => student.id === targetId) : null;
      if (targetId && !target) {
        toast("The selected student could not be found. Refresh and try again.", "error");
        return;
      }
      const existingIndex = updateId ? records.findIndex(record => record.id === updateId) : -1;
      if (updateId && (existingIndex < 0 || (roleKey !== "admin" && records[existingIndex].department !== roleKey))) {
        toast("You do not have permission to edit this update.", "error");
        return;
      }
      const update = {
        id: updateId || uid(),
        department: roleKey,
        departmentName: role.title,
        by: session.name,
        category: String(data.get("category") || "General"),
        studentId: target ? target.id : "",
        studentName: target ? target.name : "",
        studentAdmission: target ? target.admission || "" : "",
        title: title,
        message: message,
        date: date,
        createdAt: existingIndex >= 0 ? records[existingIndex].createdAt || nowISO() : nowISO(),
        updatedAt: nowISO()
      };
      if (existingIndex >= 0) records[existingIndex] = update;
      else records.push(update);
      save(STORE.parentUpdates, records);
      toast(existingIndex >= 0 ? "Parent update saved." : "Update published to parents.", "success");
      form.reset();
      refresh();
    });
    content.addEventListener("click", function(event) {
      const editButton = event.target.closest("[data-parent-update-edit]");
      if (editButton) {
        const update = load(STORE.parentUpdates, []).find(record => record.id === editButton.dataset.parentUpdateEdit);
        if (!update || (roleKey !== "admin" && update.department !== roleKey)) {
          toast("You do not have permission to edit this update.", "error");
          return;
        }
        const form = content.querySelector("[data-parent-update-form]");
        if (!form) return;
        form.elements.updateId.value = update.id;
        form.elements.category.value = update.category || "General";
        form.elements.studentId.value = update.studentId || "";
        form.elements.title.value = update.title || "";
        form.elements.date.value = update.date || today();
        form.elements.message.value = update.message || "";
        form.querySelector("[data-parent-update-submit]").textContent = "Save changes";
        form.querySelector("[data-parent-update-cancel]").hidden = false;
        form.scrollIntoView({behavior:"smooth", block:"start"});
        return;
      }
      const cancelButton = event.target.closest("[data-parent-update-cancel]");
      if (cancelButton) {
        const form = content.querySelector("[data-parent-update-form]");
        if (form) form.reset();
        if (form) {
          form.querySelector("[data-parent-update-submit]").textContent = "Publish to parents";
          form.querySelector("[data-parent-update-cancel]").hidden = true;
        }
        return;
      }
      const button = event.target.closest("[data-parent-update-delete]");
      if (!button) return;
      const records = load(STORE.parentUpdates, []);
      const update = records.find(record => record.id === button.dataset.parentUpdateDelete);
      if (!update || (roleKey !== "admin" && update.department !== roleKey)) {
        toast("You do not have permission to remove this update.", "error");
        return;
      }
      if (!window.confirm("Delete this parent update?")) return;
      save(STORE.parentUpdates, records.filter(record => record.id !== update.id));
      toast("Parent update deleted.", "success");
      refresh();
    });
  }

  const messageRoles = ["admin", "registrar", "dos", "accountant", "property", "boarding", "parent"];
  const messageBindings = new WeakSet();

  function renderMessages(roleKey, session) {
    if (!messageRoles.includes(roleKey)) return "";
    const isAdmin = roleKey === "admin";
    const isParent = roleKey === "parent";
    const role = ROLES[roleKey];
    const students = load(STORE.students, []);
    const links = load(STORE.parentLinks, []);
    const parentAccounts = load(STORE.accounts, []).filter(account => account.role === "parent");
    const linkedStudents = isParent ? links.filter(link => link.accountId === session.id)
      .map(link => students.find(student => student.id === link.studentId)).filter(Boolean) : [];
    const records = load(STORE.messages, []).filter(message => {
      if (isAdmin) return true;
      if (isParent) {
        const visibleBroadcast = message.toRole === "parent" && !message.toAccountId
          && (!message.studentId || linkedStudents.some(student => student.id === message.studentId));
        return visibleBroadcast || message.fromAccountId === session.id || message.toAccountId === session.id;
      }
      return (message.toRole === roleKey && (!message.toAccountId || message.toAccountId === session.id))
        || (message.fromRole === roleKey && message.toRole === "admin");
    }).sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
    const threadMap = new Map();
    records.forEach(message => {
      const threadId = message.threadId || message.id;
      if (!threadMap.has(threadId)) threadMap.set(threadId, []);
      threadMap.get(threadId).push(message);
    });
    const threads = Array.from(threadMap.entries()).sort((a, b) => {
      const lastA = a[1][a[1].length - 1], lastB = b[1][b[1].length - 1];
      return String(lastB.createdAt || "").localeCompare(String(lastA.createdAt || ""));
    });
    let targetOptions = "";
    if (isAdmin) {
      targetOptions = '<option value="parent">All parents</option>'
        + messageRoles.filter(key => key !== "admin" && key !== "parent")
          .map(key => '<option value="' + esc(key) + '">' + esc(ROLES[key].title) + '</option>').join("")
        + '<option value="parent-account">Specific parent account</option>';
    } else if (isParent) {
      targetOptions = linkedStudents.map(student => '<option value="' + esc(student.id) + '">' + esc(student.name) + ' · ' + esc(student.admission || "") + '</option>').join("");
    }
    const recipientOptions = isAdmin ? '<div class="field"><label>Send to</label><select name="recipient" required>' + targetOptions + '</select></div>'
      : isParent ? '<div class="field"><label>About child</label><select name="studentId" required>' + (targetOptions || '<option value="">Link a child first</option>') + '</select></div>'
      : '<div class="field"><label>To</label><input value="School Administrator" readonly></div>';
    const specificParentOptions = isAdmin ? '<div class="field" data-specific-parent-field hidden><label>Parent account</label><select name="parentAccount"><option value="">Choose parent</option>'
      + parentAccounts.map(account => {
        const childNames = links.filter(link => link.accountId === account.id)
          .map(link => students.find(student => student.id === link.studentId)).filter(Boolean)
          .map(student => student.name).join(", ");
        return '<option value="' + esc(account.id) + '">' + esc(account.name) + ' · ' + esc(account.email) + (childNames ? ' · ' + esc(childNames) : "") + '</option>';
      }).join("") + '</select></div>' : "";
    const form = '<section class="panel" style="margin-bottom:14px"><div class="panel-head"><h2>New message</h2><small>Messages are delivered in the recipient’s portal</small></div><div class="panel-body">'
      + '<form data-message-form class="form-grid"><input type="hidden" name="threadId" value="">'
      + (isAdmin ? '<div class="field"><label>Audience</label><select name="audience"><option value="parent">Parents</option><option value="department">Department</option></select></div><div class="field" hidden><label>Department</label><select name="department">' + messageRoles.filter(key => !["admin","parent"].includes(key)).map(key => '<option value="' + esc(key) + '">' + esc(ROLES[key].title) + '</option>').join("") + '</select></div>' : "")
      + recipientOptions + specificParentOptions
      + '<div class="field"><label>Subject</label><input name="subject" maxlength="120" required></div>'
      + '<div class="field full"><label>Message</label><textarea name="body" maxlength="3000" required></textarea></div>'
      + '<div class="field full" style="display:flex;gap:8px"><button class="btn" type="submit" data-message-submit>Send message</button><button class="btn secondary" type="button" data-message-cancel hidden>Cancel reply</button></div>'
      + '</form></div></section>';
    let messagesHTML = threads.length ? threads.map(entry => {
      const threadId = entry[0], thread = entry[1];
      const first = thread[0];
      const title = first.subject || "Message";
      return '<section class="panel" style="margin-bottom:12px"><div class="panel-head"><div><h2>' + esc(title) + '</h2><small style="color:var(--muted)">' + esc(first.fromName || ROLES[first.fromRole]?.title || "Message") + " · " + esc(ROLES[first.fromRole]?.title || first.fromRole || "") + (first.studentName ? " · " + esc(first.studentName) : "") + '</small></div><button class="btn secondary small" data-message-reply="' + esc(threadId) + '">Reply</button></div><div class="panel-body">'
        + thread.map(message => '<div style="padding:9px 0;border-bottom:1px solid var(--line)"><strong>' + esc(message.fromName || "User") + '</strong> <small style="color:var(--muted)">' + esc(ROLES[message.fromRole]?.title || message.fromRole || "") + ' · ' + esc(new Date(message.createdAt).toLocaleString()) + '</small><p style="margin:5px 0;white-space:pre-wrap">' + esc(message.body || "") + '</p></div>').join("")
        + '</div></section>';
    }).join("") : '<div class="empty"><strong>No messages yet</strong>Messages sent to this portal will appear here.</div>';
    const desc = isParent ? "Message the school and view replies in this portal."
      : isAdmin ? "Send messages to parents or departments and review their replies."
      : "Communicate with the administrator from your department portal.";
    return pageHead("Messages", desc)
      + '<div class="notice info">Portal messages appear here. SMS delivery to phone numbers is not connected yet; it needs a secure backend and an SMS provider. Never enter a mobile-money PIN or school account secret in this portal.</div>'
      + form + messagesHTML;
  }

  function wireMessages(content, roleKey, session, refresh) {
    if (!content || messageBindings.has(content)) return;
    messageBindings.add(content);
    content.addEventListener("change", function(event) {
      if (event.target.name === "audience") {
        const departmentField = content.querySelector('[name="department"]');
        const recipientField = content.querySelector('[name="recipient"]');
        const specificParent = content.querySelector("[data-specific-parent-field]");
        if (departmentField) departmentField.closest(".field").hidden = event.target.value !== "department";
        if (recipientField) recipientField.closest(".field").hidden = event.target.value !== "parent";
        if (specificParent) specificParent.hidden = event.target.value !== "parent" || !recipientField || recipientField.value !== "parent-account";
      } else if (event.target.name === "recipient") {
        const field = content.querySelector("[data-specific-parent-field]");
        if (field) field.hidden = event.target.value !== "parent-account";
      }
    });
    content.addEventListener("submit", function(event) {
      const form = event.target.closest("[data-message-form]");
      if (!form) return;
      event.preventDefault();
      const data = new FormData(form);
      const subject = String(data.get("subject") || "").trim();
      const body = String(data.get("body") || "").trim();
      if (!subject || !body) {
        toast("Enter both a subject and message.", "error");
        return;
      }
      const records = load(STORE.messages, []);
      const threadId = String(data.get("threadId") || "") || uid();
      let toRole = "admin", toAccountId = "", studentId = "";
      if (roleKey === "admin") {
        const recipient = String(data.get("recipient") || "");
        if (data.get("audience") === "department") {
          toRole = String(data.get("department") || "");
          if (!ROLES[toRole] || ["admin","parent"].includes(toRole)) {
            toast("Select a valid department.", "error");
            return;
          }
        } else {
          toRole = "parent";
          toAccountId = recipient === "parent-account" ? String(data.get("parentAccount") || "") : "";
          if (recipient === "parent-account" && !toAccountId) {
            toast("Choose the parent account to message.", "error");
            return;
          }
        }
      } else if (roleKey === "parent") {
        studentId = String(data.get("studentId") || "");
        const linked = load(STORE.parentLinks, []).some(link => link.accountId === session.id && link.studentId === studentId);
        if (!linked) {
          toast("Choose a child linked to your parent account.", "error");
          return;
        }
      }
      const student = studentId ? load(STORE.students, []).find(item => item.id === studentId) : null;
      records.push({
        id:uid(), threadId:threadId,
        fromRole:roleKey, fromAccountId:session.id, fromName:session.name,
        toRole:toRole, toAccountId:toAccountId,
        studentId:student ? student.id : "", studentName:student ? student.name : "",
        subject:subject, body:body, createdAt:nowISO()
      });
      if (!save(STORE.messages, records)) return;
      toast("Message sent to the portal inbox.", "success");
      refresh();
    });
    content.addEventListener("click", function(event) {
      const reply = event.target.closest("[data-message-reply]");
      if (!reply) return;
      const form = content.querySelector("[data-message-form]");
      if (!form) return;
      form.elements.threadId.value = reply.dataset.messageReply;
      form.elements.subject.value = "Re: " + (reply.closest(".panel").querySelector("h2")?.textContent || "Message").replace(/^Re:\s*/i, "");
      if (roleKey === "admin") {
        const thread = load(STORE.messages, []).filter(message => message.threadId === reply.dataset.messageReply);
        const first = thread[0];
        const incoming = thread.find(message => message.fromRole !== "admin");
        if (incoming) {
          const audience = form.elements.audience;
          if (audience) {
            audience.value = incoming.fromRole === "parent" ? "parent" : "department";
            audience.dispatchEvent(new Event("change", {bubbles:true}));
          }
          if (incoming.fromRole === "parent") {
            form.elements.recipient.value = incoming.fromAccountId ? "parent-account" : "parent";
            form.elements.recipient.dispatchEvent(new Event("change", {bubbles:true}));
            if (incoming.fromAccountId && form.elements.parentAccount) form.elements.parentAccount.value = incoming.fromAccountId;
          } else if (form.elements.department) form.elements.department.value = incoming.fromRole;
        } else if (first && first.fromRole === "admin") {
          const audience = form.elements.audience;
          if (first.toRole === "parent") {
            if (audience) audience.value = "parent";
            form.elements.recipient.value = first.toAccountId ? "parent-account" : "parent";
            form.elements.recipient.dispatchEvent(new Event("change", {bubbles:true}));
            if (first.toAccountId && form.elements.parentAccount) form.elements.parentAccount.value = first.toAccountId;
          } else {
            if (audience) {
              audience.value = "department";
              audience.dispatchEvent(new Event("change", {bubbles:true}));
            }
            if (form.elements.department) form.elements.department.value = first.toRole;
          }
        }
      }
      form.querySelector("[data-message-submit]").textContent = "Send reply";
      form.querySelector("[data-message-cancel]").hidden = false;
      form.scrollIntoView({behavior:"smooth",block:"start"});
    });
    content.addEventListener("click", function(event) {
      const cancel = event.target.closest("[data-message-cancel]");
      if (!cancel) return;
      const form = content.querySelector("[data-message-form]");
      if (!form) return;
      form.reset();
      form.elements.threadId.value = "";
      form.querySelector("[data-message-submit]").textContent = "Send message";
      form.querySelector("[data-message-cancel]").hidden = true;
    });
  }

  /* ===========================================================================
     PUBLIC API
     Only these symbols are accessible as KHA.* from the portal files.
  =========================================================================== */
  return {
    /* Identity */
    SCHOOL_NAME, SCHOOL_SUB, SCHOOL_MOTTO, CURRENT_YEAR, CLASS_LIST,
    BADGE_SVG, ROLES, ICONS,

    /* Data storage */
    STORE, load, save,

    /* Utilities */
    esc, today, nowISO, uid, initials, fmtMoney, fmtDate,
    gradeFromScore, gradeRemark,

    /* UI helpers */
    toast, injectCSS,

    /* Auth + session */
    init, getSession, signOut,

    /* Shell */
    buildShell, setContent, setCrumb,

    /* Modals */
    openModal, closeModal,

    /* Photos */
    photoField, wirePhotoInputs, readPhoto,

    /* Tables + page blocks */
    buildTable, pageHead, statCard, renderParentUpdates, wireParentUpdates,
    renderMessages, wireMessages
  };
})();
