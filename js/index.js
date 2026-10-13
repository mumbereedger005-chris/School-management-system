  /*
   * Hub page script
   * ---------------
   * Inserts the school badge SVG and dynamically builds the portal
   * cards.  Using JavaScript keeps the HTML clean and makes it easy to
   * add or rename portals in one place.
   */
  (function () {

    // Inject the school badge into the hub header
    document.getElementById("hubBadge").innerHTML = KHA.BADGE_SVG;

    /*
     * Portal definitions
     * ------------------
     * Each entry describes one department portal.
     * key   – must match a key in KHA.ROLES and the portal HTML filename
     * icon  – emoji shown on the card
     * color – portal brand colour (stripe + button)
     * file  – path to the portal HTML file
     * desc  – one-line description of the portal's responsibilities
     */
    const portals = [
      {
        key:   "admin",
        icon:  "🏫",
        label: "Administration",
        title: "Admin Portal",
        desc:  "Complete school overview: pupils, teachers, finance, timetables, attendance, transport, boarding, and system management.",
        color: "#4863de",
        file:  "portal-admin.html"
      },
      {
        key:   "registrar",
        icon:  "📋",
        label: "Admissions",
        title: "Registrar Portal",
        desc:  "Pupil registration with passport photos, parent / guardian contacts, class assignments, medical info, and transfers.",
        color: "#168560",
        file:  "portal-registrar.html"
      },
      {
        key:   "dos",
        icon:  "📚",
        label: "Academic Affairs",
        title: "Director of Studies",
        desc:  "Teacher management, class timetables, subject assignments, marks entry, report cards, and attendance.",
        color: "#7c3aed",
        file:  "portal-dos.html"
      },
      {
        key:   "accountant",
        icon:  "💰",
        label: "Finance",
        title: "Accountant Portal",
        desc:  "Fees structures, payment recording, printable receipts, scholarships, and financial reports.",
        color: "#b45309",
        file:  "portal-accountant.html"
      },
      {
        key:   "property",
        icon:  "🚌",
        label: "Property & Transport",
        title: "Property Portal",
        desc:  "School assets, library books, school buses, transport routes, pupil assignments, and printable manifests.",
        color: "#0369a1",
        file:  "portal-property.html"
      },
      {
        key:   "boarding",
        icon:  "🛏️",
        label: "Boarding & Hostel",
        title: "Boarding Portal",
        desc:  "Dormitory management, bed assignments, boarding fees, house masters and matrons with profile photos.",
        color: "#be185d",
        file:  "portal-boarding.html"
      },
      {
        key:   "parent",
        icon:  "👪",
        label: "Parents",
        title: "Parent Portal",
        desc:  "View your child's profile, school fees and receipts, calendar, and announcements.",
        color: "#0f766e",
        file:  "portal-parent.html"
      }
    ];

    const grid = document.getElementById("portalsGrid");

    portals.forEach(function (p) {
      // Count existing accounts for this portal (read from localStorage)
      const accountCount = KHA.load(KHA.STORE.accounts, [])
        .filter(function (a) { return a.role === p.key; }).length;

      const accountLabel = accountCount === 0
        ? "No accounts yet — click to create one"
        : accountCount + " account" + (accountCount > 1 ? "s" : "") + " registered";

      // Build the card as an <a> tag so it is keyboard-navigable
      const card = document.createElement("a");
      card.className = "portal-card";
      card.href      = p.file;

      card.innerHTML =
        /* Coloured top stripe */
        '<div class="pc-stripe" style="background:' + p.color + '"></div>'
        /* Role label (small, coloured) */
        + '<div class="pc-label" style="color:' + p.color + '">' + p.label + '</div>'
        /* Portal title */
        + '<h2 class="pc-title">' + p.title + '</h2>'
        /* Description */
        + '<p class="pc-desc">' + p.desc + '</p>'
        /* Account count meta */
        + '<div class="pc-meta">' + accountLabel + '</div>'
        /* Open button */
        + '<div class="pc-btn" style="background:' + p.color + '">Open portal →</div>';

      grid.appendChild(card);
    });

  })();
