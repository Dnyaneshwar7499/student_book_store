/**
 * Student Book Store - Main Client Logic, Realistic Book Asset Engine & Flipkart-Style Multi-Image Gallery
 */

// ==========================================================
// Realistic SVG Book Cover & Multi-Image Asset Generator
// ==========================================================

function encodeSvg(svg) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim().replace(/\n\s*/g, " "));
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderSvgTitle(title, x, y) {
  const words = String(title).split(" ");
  const lines = [];
  let current = "";
  
  words.forEach((w) => {
    if ((current + " " + w).trim().length > 20) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  });
  if (current) lines.push(current.trim());

  return lines
    .slice(0, 3)
    .map(
      (line, idx) => `
    <text x="${x}" y="${y + idx * 30}" fill="#ffffff" font-size="24" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" letter-spacing="-0.5">${escapeXml(line)}</text>
  `
    )
    .join("");
}

// 1. Realistic Front Cover
function generateFrontCover(b) {
  const c1 = b.themeColor || "#1e1b4b";
  const c2 = b.themeColorDark || "#0f172a";
  const accent = b.accentColor || "#f59e0b";
  const title = b.name;
  const author = b.author || "Standard Academic Edition";
  const publisher = (b.specs && b.specs.publisher) || "Academic Press";
  const edition = (b.specs && b.specs.edition) || "2026 Student Edition";
  const category = b.category || "Computer Science";
  const emblem = b.icon || "📘";

  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <defs>
    <linearGradient id="bgGrad_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="spineShade_${b.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.65)"/>
      <stop offset="25%" stop-color="rgba(0,0,0,0.2)"/>
      <stop offset="70%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="90%" stop-color="rgba(0,0,0,0.3)"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="glossGrad_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="35%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="70%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="goldHolo_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="30%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
  </defs>

  <rect width="450" height="620" rx="10" fill="url(#bgGrad_${b.id})"/>
  
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    <line x1="40" y1="0" x2="40" y2="620"/>
    <line x1="410" y1="0" x2="410" y2="620"/>
    <line x1="0" y1="120" x2="450" y2="120"/>
    <line x1="0" y1="480" x2="450" y2="480"/>
    <circle cx="225" cy="310" r="130" fill="none" stroke-dasharray="6,6"/>
  </g>

  <polygon points="0,0 450,0 450,220 0,380" fill="url(#glossGrad_${b.id})" opacity="0.6"/>

  <rect x="0" y="0" width="30" height="620" fill="url(#spineShade_${b.id})"/>
  <line x1="30" y1="0" x2="30" y2="620" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

  <rect x="42" y="24" width="372" height="34" rx="4" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.15)"/>
  <text x="56" y="46" fill="${accent}" font-size="12" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" letter-spacing="1.5">${escapeXml(publisher.toUpperCase())}</text>
  <text x="398" y="46" fill="#ffffff" font-size="11" font-family="'Outfit', 'Inter', sans-serif" font-weight="600" text-anchor="end">${escapeXml(edition.toUpperCase())}</text>

  <rect x="50" y="80" width="130" height="24" rx="12" fill="${accent}" opacity="0.95"/>
  <text x="115" y="96" fill="#000000" font-size="11" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">${escapeXml(category.toUpperCase())}</text>

  <g transform="translate(0,0)">
    ${renderSvgTitle(title, 50, 142)}
  </g>

  <text x="50" y="235" fill="#f8fafc" font-size="17" font-family="'Outfit', 'Inter', sans-serif" font-weight="600" letter-spacing="0.5">By ${escapeXml(author)}</text>
  <line x1="50" y1="248" x2="160" y2="248" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>

  <g transform="translate(225, 345)">
    <circle r="65" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <circle r="52" fill="rgba(0,0,0,0.3)" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="0" y="16" font-size="44" text-anchor="middle">${emblem}</text>
    <text x="0" y="38" fill="#e2e8f0" font-size="9" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" text-anchor="middle" letter-spacing="1">ACADEMIC EDITION</text>
  </g>

  <rect x="48" y="445" width="354" height="64" rx="8" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)"/>
  <text x="64" y="468" fill="#38bdf8" font-size="11" font-family="'Outfit', 'Inter', sans-serif" font-weight="700">✓ Complete University Syllabus &amp; Solved Exam Papers</text>
  <text x="64" y="492" fill="#a7f3d0" font-size="11" font-family="'Outfit', 'Inter', sans-serif" font-weight="700">✓ Real-World Code Labs, Projects &amp; Digital Resources</text>

  <g transform="translate(75, 555)">
    <circle r="20" fill="url(#goldHolo_${b.id})"/>
    <circle r="16" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="2,2"/>
    <text x="0" y="-3" fill="#78350f" font-size="5.5" font-family="sans-serif" font-weight="900" text-anchor="middle">GENUINE</text>
    <text x="0" y="5" fill="#78350f" font-size="6.5" font-family="sans-serif" font-weight="900" text-anchor="middle">100%</text>
    <text x="0" y="12" fill="#78350f" font-size="5" font-family="sans-serif" font-weight="800" text-anchor="middle">ORIGINAL</text>
  </g>

  <rect x="115" y="538" width="285" height="36" rx="6" fill="${accent}" opacity="0.95"/>
  <text x="257" y="553" fill="#000000" font-size="11.5" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" text-anchor="middle" letter-spacing="1">SPECIAL STUDENT EDITION</text>
  <text x="257" y="566" fill="#1e293b" font-size="8.5" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" text-anchor="middle">FOR SALE IN INDIAN SUBCONTINENT ONLY</text>

  <rect x="1" y="1" width="448" height="618" rx="9" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
</svg>`);
}

// 2. Realistic Back Cover
function generateBackCover(b) {
  const c2 = b.themeColorDark || "#0f172a";
  const accent = b.accentColor || "#f59e0b";
  const title = b.name;
  const author = b.author || "Standard Edition";
  const publisher = (b.specs && b.specs.publisher) || "Academic Press";
  const isbn = (b.specs && b.specs.isbn) || "978-0134610993";
  const price = b.price || 299;
  const origPrice = b.originalPrice || 599;

  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <defs>
    <linearGradient id="backBg_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c2}"/>
      <stop offset="60%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="backSpine_${b.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="80%" stop-color="rgba(0,0,0,0.3)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.65)"/>
    </linearGradient>
  </defs>

  <rect width="450" height="620" rx="10" fill="url(#backBg_${b.id})"/>
  <rect x="420" y="0" width="30" height="620" fill="url(#backSpine_${b.id})"/>
  <line x1="420" y1="0" x2="420" y2="620" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <rect x="30" y="24" width="380" height="32" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
  <text x="44" y="45" fill="${accent}" font-size="12" font-family="'Outfit', sans-serif" font-weight="800" letter-spacing="1">ABOUT THIS ACADEMIC TEXTBOOK</text>

  <g transform="translate(30, 75)">
    <text x="0" y="0" fill="#f8fafc" font-size="15" font-family="'Outfit', sans-serif" font-weight="700">${escapeXml(title)}</text>
    <text x="0" y="22" fill="#94a3b8" font-size="11.5" font-family="'Inter', sans-serif">Authored by ${escapeXml(author)}. This authoritative edition</text>
    <text x="0" y="38" fill="#94a3b8" font-size="11.5" font-family="'Inter', sans-serif">is engineered specifically for college students &amp; university</text>
    <text x="0" y="54" fill="#94a3b8" font-size="11.5" font-family="'Inter', sans-serif">curriculum to ensure deep conceptual clarity &amp; exam readiness.</text>
  </g>

  <rect x="30" y="150" width="380" height="150" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
  <text x="46" y="174" fill="${accent}" font-size="12" font-family="'Outfit', sans-serif" font-weight="800">KEY LEARNING ADVANTAGES</text>
  
  <text x="46" y="200" fill="#4ade80" font-size="12" font-weight="800">✓</text>
  <text x="64" y="200" fill="#e2e8f0" font-size="11" font-family="'Inter', sans-serif">Complete Semester Syllabus Alignment with Unit Roadmaps</text>
  
  <text x="46" y="225" fill="#4ade80" font-size="12" font-weight="800">✓</text>
  <text x="64" y="225" fill="#e2e8f0" font-size="11" font-family="'Inter', sans-serif">Step-by-step Algorithms, Code Examples &amp; UML Schematics</text>
  
  <text x="46" y="250" fill="#4ade80" font-size="12" font-weight="800">✓</text>
  <text x="64" y="250" fill="#e2e8f0" font-size="11" font-family="'Inter', sans-serif">250+ Solved University Question Papers &amp; GATE Practice Sets</text>
  
  <text x="46" y="275" fill="#4ade80" font-size="12" font-weight="800">✓</text>
  <text x="64" y="275" fill="#e2e8f0" font-size="11" font-family="'Inter', sans-serif">Digital Companion Repository with Source Code &amp; Lab Solutions</text>

  <rect x="30" y="315" width="380" height="60" rx="6" fill="rgba(79, 70, 229, 0.15)" stroke="rgba(99, 102, 241, 0.3)"/>
  <text x="46" y="338" fill="#818cf8" font-size="11" font-family="'Outfit', sans-serif" font-weight="700">🎓 RECOMMENDED FOR DEGREE COURSES:</text>
  <text x="46" y="358" fill="#cbd5e1" font-size="10.5" font-family="'Inter', sans-serif">B.Tech / BE (CSE, IT, AI-DS), BCA, MCA, B.Sc Computer Science</text>

  <g transform="translate(30, 400)">
    <rect width="210" height="90" rx="6" fill="#ffffff"/>
    <text x="15" y="20" fill="#000000" font-size="9" font-family="monospace" font-weight="bold">ISBN-13: ${isbn}</text>
    <g transform="translate(15, 28)" fill="#000000">
      <rect x="0" y="0" width="3" height="42"/><rect x="5" y="0" width="2" height="42"/><rect x="10" y="0" width="4" height="42"/>
      <rect x="17" y="0" width="2" height="42"/><rect x="22" y="0" width="3" height="42"/><rect x="28" y="0" width="1" height="42"/>
      <rect x="32" y="0" width="4" height="42"/><rect x="39" y="0" width="2" height="42"/><rect x="44" y="0" width="3" height="42"/>
      <rect x="50" y="0" width="2" height="42"/><rect x="55" y="0" width="4" height="42"/><rect x="62" y="0" width="1" height="42"/>
      <rect x="66" y="0" width="3" height="42"/><rect x="72" y="0" width="2" height="42"/><rect x="77" y="0" width="4" height="42"/>
      <rect x="84" y="0" width="2" height="42"/><rect x="89" y="0" width="3" height="42"/><rect x="95" y="0" width="1" height="42"/>
      <rect x="99" y="0" width="4" height="42"/><rect x="106" y="0" width="2" height="42"/><rect x="111" y="0" width="3" height="42"/>
      <rect x="117" y="0" width="2" height="42"/><rect x="122" y="0" width="4" height="42"/><rect x="129" y="0" width="1" height="42"/>
      <rect x="133" y="0" width="3" height="42"/><rect x="139" y="0" width="2" height="42"/><rect x="144" y="0" width="4" height="42"/>
      <rect x="151" y="0" width="2" height="42"/><rect x="156" y="0" width="3" height="42"/><rect x="162" y="0" width="1" height="42"/>
      <rect x="166" y="0" width="4" height="42"/><rect x="173" y="0" width="2" height="42"/>
    </g>
    <text x="15" y="82" fill="#000000" font-size="8" font-family="monospace">9 780134 610993</text>
  </g>

  <g transform="translate(250, 400)">
    <rect width="160" height="90" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
    <text x="14" y="24" fill="#94a3b8" font-size="10" font-family="'Inter', sans-serif">M.R.P. (Incl. Taxes)</text>
    <text x="14" y="44" fill="#ef4444" font-size="14" font-family="'Outfit', sans-serif" font-weight="700" text-decoration="line-through">₹${origPrice}.00</text>
    <text x="14" y="66" fill="#22c55e" font-size="18" font-family="'Outfit', sans-serif" font-weight="800">₹${price}.00</text>
    <text x="14" y="80" fill="${accent}" font-size="8.5" font-family="'Inter', sans-serif" font-weight="700">CAMPUS SPECIAL DISCOUNT</text>
  </g>

  <g transform="translate(30, 520)">
    <line x1="0" y1="0" x2="380" y2="0" stroke="rgba(255,255,255,0.15)"/>
    <text x="0" y="22" fill="#ffffff" font-size="12" font-family="'Outfit', sans-serif" font-weight="800">${escapeXml(publisher.toUpperCase())}</text>
    <text x="0" y="38" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">Higher Education Division • New Delhi • London • New York</text>
    <text x="380" y="28" fill="#10b981" font-size="10" font-family="'Inter', sans-serif" font-weight="700" text-anchor="end">100% Genuine Certified Edition</text>
  </g>

  <rect x="1" y="1" width="448" height="618" rx="9" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
</svg>`);
}

// 3. Table of Contents (Index)
function generateTableOfContents(b) {
  const accent = b.accentColor || "#f59e0b";
  const title = b.name;
  const author = b.author || "Standard Academic Edition";

  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <defs>
    <linearGradient id="paperGrad_${b.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>

  <rect width="450" height="620" fill="url(#paperGrad_${b.id})"/>
  <rect x="0" y="0" width="16" height="620" fill="#e2e8f0"/>
  <line x1="16" y1="0" x2="16" y2="620" stroke="#cbd5e1" stroke-width="1"/>

  <text x="36" y="36" fill="#64748b" font-size="10" font-family="'Outfit', sans-serif" font-weight="700" letter-spacing="1">SYLLABUS ROADMAP &amp; COURSE STRUCTURE</text>
  <text x="414" y="36" fill="#64748b" font-size="10" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">INDEX</text>
  <line x1="36" y1="46" x2="414" y2="46" stroke="#e2e8f0" stroke-width="1.5"/>

  <text x="36" y="80" fill="#0f172a" font-size="20" font-family="'Outfit', sans-serif" font-weight="800">TABLE OF CONTENTS</text>
  <text x="36" y="98" fill="#64748b" font-size="11" font-family="'Inter', sans-serif">Textbook: ${escapeXml(title)} (By ${escapeXml(author)})</text>

  <g transform="translate(36, 120)">
    <rect width="378" height="26" rx="4" fill="#f1f5f9"/>
    <text x="10" y="17" fill="#1e293b" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">UNIT I: FOUNDATIONS &amp; CORE PRINCIPLES</text>
    <text x="368" y="17" fill="#64748b" font-size="10" font-family="monospace" text-anchor="end">Pg 1 - 85</text>
    <text x="14" y="42" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 1: Architecture &amp; Execution Environment Setup ................. 01</text>
    <text x="14" y="60" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 2: Data Representation, Types &amp; Control Logic .................. 28</text>
    <text x="14" y="78" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 3: Object Modeling, Modularity &amp; Memory Layout .............. 56</text>
  </g>

  <g transform="translate(36, 225)">
    <rect width="378" height="26" rx="4" fill="#f1f5f9"/>
    <text x="10" y="17" fill="#1e293b" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">UNIT II: ADVANCED LOGIC, PATTERNS &amp; PERFORMANCE</text>
    <text x="368" y="17" fill="#64748b" font-size="10" font-family="monospace" text-anchor="end">Pg 86 - 240</text>
    <text x="14" y="42" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 4: Algorithmic Complexity, Big-O &amp; Optimization ................ 86</text>
    <text x="14" y="60" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 5: Concurrency, Threading &amp; Async I/O Pipelines ................ 134</text>
    <text x="14" y="78" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 6: Enterprise Design Patterns &amp; System Architecture ........ 190</text>
  </g>

  <g transform="translate(36, 330)">
    <rect width="378" height="26" rx="4" fill="#f1f5f9"/>
    <text x="10" y="17" fill="#1e293b" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">UNIT III: PRODUCTION PROJECTS &amp; LAB BENCHMARKS</text>
    <text x="368" y="17" fill="#64748b" font-size="10" font-family="monospace" text-anchor="end">Pg 241 - 450</text>
    <text x="14" y="42" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 7: Real-World Industry Application Case Study .................. 241</text>
    <text x="14" y="60" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 8: Automated Unit Testing, CI/CD &amp; Deployment ................. 310</text>
    <text x="14" y="78" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">Chapter 9: Laboratory Experiments &amp; Code Lab Solutions ................ 385</text>
  </g>

  <g transform="translate(36, 435)">
    <rect width="378" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
    <text x="10" y="17" fill="#1d4ed8" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">UNIT IV: UNIVERSITY EXAM PREP &amp; GATE QUESTION BANK</text>
    <text x="368" y="17" fill="#1d4ed8" font-size="10" font-family="monospace" text-anchor="end">Pg 451 - 620</text>
    <text x="14" y="42" fill="#1e3a8a" font-size="10.5" font-family="'Inter', sans-serif">Appendix A: 10 Years Solved University Exam Papers ...................... 451</text>
    <text x="14" y="60" fill="#1e3a8a" font-size="10.5" font-family="'Inter', sans-serif">Appendix B: Top 100 Technical Placement Interview Questions ...... 530</text>
    <text x="14" y="78" fill="#1e3a8a" font-size="10.5" font-family="'Inter', sans-serif">Appendix C: Complete Quick Revision Formula Cheat Sheet ............. 590</text>
  </g>

  <line x1="36" y1="560" x2="414" y2="560" stroke="#e2e8f0" stroke-width="1"/>
  <text x="36" y="580" fill="#059669" font-size="10" font-family="'Inter', sans-serif" font-weight="700">✓ Verified Curriculum Mapping: IITs, NITs, VTU, Anna Univ, Mumbai Univ, AKTU</text>
  <text x="414" y="580" fill="#64748b" font-size="10" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">Page v</text>

  <rect x="0" y="0" width="450" height="620" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
</svg>`);
}

// 4. Sample Page 1 (Core Theory & Live Code Example)
function generateSamplePage1(b) {
  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <rect width="450" height="620" fill="#ffffff"/>
  <rect x="0" y="0" width="16" height="620" fill="#f1f5f9"/>
  <line x1="16" y1="0" x2="16" y2="620" stroke="#e2e8f0" stroke-width="1"/>

  <text x="36" y="32" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" letter-spacing="1">CHAPTER 3: CORE IMPLEMENTATION &amp; LOGIC</text>
  <text x="414" y="32" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">42</text>
  <line x1="36" y1="42" x2="414" y2="42" stroke="#e2e8f0" stroke-width="1"/>

  <text x="36" y="70" fill="#0f172a" font-size="16" font-family="'Outfit', sans-serif" font-weight="800">3.2 Practical Execution &amp; Memory Allocation</text>
  
  <g transform="translate(36, 88)">
    <text x="0" y="0" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">In modern computer science systems, optimal algorithm execution</text>
    <text x="0" y="16" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">relies upon strict state management and deterministic resource</text>
    <text x="0" y="32" fill="#334155" font-size="10.5" font-family="'Inter', sans-serif">allocation. Consider the following architectural code implementation:</text>
  </g>

  <g transform="translate(36, 140)">
    <rect width="378" height="180" rx="8" fill="#0f172a"/>
    <circle cx="16" cy="14" r="4" fill="#ef4444"/>
    <circle cx="28" cy="14" r="4" fill="#f59e0b"/>
    <circle cx="40" cy="14" r="4" fill="#10b981"/>
    <text x="362" y="17" fill="#64748b" font-size="8.5" font-family="monospace" text-anchor="end">Solution.source</text>
    <line x1="0" y1="26" x2="378" y2="26" stroke="#1e293b" stroke-width="1"/>

    <text x="14" y="48" fill="#38bdf8" font-size="9.5" font-family="'JetBrains Mono', monospace">// Step 1: Optimized Pipeline Execution</text>
    <text x="14" y="66" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">public class <tspan fill="#fbbf24">EngineService</tspan> {</text>
    <text x="28" y="84" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">  private final <tspan fill="#a7f3d0">DataProcessor</tspan> processor;</text>
    <text x="28" y="106" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">  public <tspan fill="#38bdf8">Result</tspan> processPipeline(<tspan fill="#a7f3d0">Dataset</tspan> data) {</text>
    <text x="42" y="124" fill="#e2e8f0" font-size="9.5" font-family="'JetBrains Mono', monospace">    var result = processor.filter(data);</text>
    <text x="42" y="142" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">    return <tspan fill="#38bdf8">Result.success</tspan>(result);</text>
    <text x="28" y="160" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">  }</text>
    <text x="14" y="174" fill="#f43f5e" font-size="9.5" font-family="'JetBrains Mono', monospace">}</text>
  </g>

  <g transform="translate(36, 335)">
    <rect width="378" height="85" rx="6" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
    <text x="14" y="22" fill="#b45309" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">💡 UNIVERSITY EXAM TIP (10-MARK QUESTION):</text>
    <text x="14" y="42" fill="#78350f" font-size="10" font-family="'Inter', sans-serif">Always specify the Big-O Time and Space Complexity in semester</text>
    <text x="14" y="58" fill="#78350f" font-size="10" font-family="'Inter', sans-serif">theory exams: Time Complexity = O(N log N), Auxiliary Space = O(1).</text>
    <text x="14" y="74" fill="#78350f" font-size="10" font-family="'Inter', sans-serif">Commonly asked in Semester End Examinations (SEE) &amp; GATE CSE.</text>
  </g>

  <g transform="translate(36, 435)">
    <rect width="378" height="110" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="14" y="20" fill="#0f172a" font-size="10.5" font-family="'Outfit', sans-serif" font-weight="700">Figure 3.4: Data Flow &amp; Asynchronous Pipeline Architecture</text>
    
    <g transform="translate(20, 36)">
      <rect x="0" y="0" width="80" height="40" rx="4" fill="#e0e7ff" stroke="#6366f1"/>
      <text x="40" y="24" fill="#312e81" font-size="9" font-weight="700" text-anchor="middle">Input Stream</text>
      
      <line x1="80" y1="20" x2="115" y2="20" stroke="#4f46e5" stroke-width="2"/>
      
      <rect x="115" y="0" width="105" height="40" rx="4" fill="#fef3c7" stroke="#d97706"/>
      <text x="167" y="24" fill="#78350f" font-size="9" font-weight="700" text-anchor="middle">Processing Core</text>
      
      <line x1="220" y1="20" x2="255" y2="20" stroke="#4f46e5" stroke-width="2"/>
      
      <rect x="255" y="0" width="85" height="40" rx="4" fill="#d1fae5" stroke="#059669"/>
      <text x="297" y="24" fill="#064e3b" font-size="9" font-weight="700" text-anchor="middle">Output DB</text>
    </g>
    <text x="14" y="98" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">Low-latency event loop guarantees zero-blocking thread dispatching.</text>
  </g>

  <line x1="36" y1="565" x2="414" y2="565" stroke="#e2e8f0" stroke-width="1"/>
  <text x="36" y="585" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">StudentBook Academic Textbook Edition</text>
  <text x="414" y="585" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">Page 42</text>

  <rect x="0" y="0" width="450" height="620" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
</svg>`);
}

// 5. Sample Page 2 (Solved University Problems & Exercises)
function generateSamplePage2(b) {
  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <rect width="450" height="620" fill="#ffffff"/>
  <rect x="0" y="0" width="16" height="620" fill="#f1f5f9"/>
  <line x1="16" y1="0" x2="16" y2="620" stroke="#e2e8f0" stroke-width="1"/>

  <text x="36" y="32" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" letter-spacing="1">SOLVED UNIVERSITY EXAM PROBLEMS &amp; LABS</text>
  <text x="414" y="32" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">43</text>
  <line x1="36" y1="42" x2="414" y2="42" stroke="#e2e8f0" stroke-width="1"/>

  <text x="36" y="68" fill="#0f172a" font-size="15" font-family="'Outfit', sans-serif" font-weight="800">Solved University Question 3.1 [VTU / Anna Univ / SPPU - 10 Marks]</text>
  
  <g transform="translate(36, 82)">
    <rect width="378" height="50" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="10" y="18" fill="#0f172a" font-size="10" font-family="'Inter', sans-serif" font-weight="700">Problem Statement:</text>
    <text x="10" y="36" fill="#334155" font-size="9.5" font-family="'Inter', sans-serif">Explain the algorithmic workflow with mathematical step validation.</text>
  </g>

  <g transform="translate(36, 142)">
    <text x="0" y="0" fill="#059669" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">Step-by-Step Solution Breakdown:</text>
    <text x="0" y="20" fill="#334155" font-size="10" font-family="'Inter', sans-serif">1. Initialize primary state vector: S = { s₁, s₂, ..., sₙ } where n ∈ N.</text>
    <text x="0" y="38" fill="#334155" font-size="10" font-family="'Inter', sans-serif">2. Compute transition matrix probability: P(s' | s, a) = Σ γᵗ R(s, a).</text>
    <text x="0" y="56" fill="#334155" font-size="10" font-family="'Inter', sans-serif">3. Apply Convergence Criterion: | V_{k+1}(s) - V_k(s) | &lt; ε.</text>
    <text x="0" y="74" fill="#0284c7" font-size="10" font-family="'Inter', sans-serif" font-weight="700">Conclusion: Asymptotic convergence achieved in O(log N) iterations. [Q.E.D.]</text>
  </g>

  <g transform="translate(36, 235)">
    <rect width="378" height="160" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
    <text x="14" y="22" fill="#15803d" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">🧪 HANDS-ON LABORATORY EXERCISES:</text>
    <text x="14" y="46" fill="#166534" font-size="10" font-family="'Inter', sans-serif"><strong>Lab Task 3.1:</strong> Write a benchmark program to test memory consumption</text>
    <text x="14" y="62" fill="#166534" font-size="10" font-family="'Inter', sans-serif">under heavy concurrent load. Plot latency graphs using benchmark suite.</text>
    <text x="14" y="90" fill="#166534" font-size="10" font-family="'Inter', sans-serif"><strong>Lab Task 3.2:</strong> Implement error recovery handler and demonstrate</text>
    <text x="14" y="106" fill="#166534" font-size="10" font-family="'Inter', sans-serif">graceful degradation upon service partition fault.</text>
    <text x="14" y="134" fill="#15803d" font-size="9.5" font-family="'Inter', sans-serif" font-weight="700">📌 Full runnable companion source code available in student portal.</text>
  </g>

  <g transform="translate(36, 410)">
    <rect width="378" height="135" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="14" y="22" fill="#0f172a" font-size="11" font-family="'Outfit', sans-serif" font-weight="800">📝 GATE / PLACEMENT MCQ PRACTICE:</text>
    <text x="14" y="44" fill="#334155" font-size="9.5" font-family="'Inter', sans-serif">Q1. What is the worst-case space complexity of the algorithm?</text>
    <text x="24" y="60" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">(A) O(1)   (B) O(N)   (C) O(N²)   (D) O(log N)  → <tspan fill="#059669" font-weight="bold">Ans: (A)</tspan></text>
    <text x="14" y="84" fill="#334155" font-size="9.5" font-family="'Inter', sans-serif">Q2. Which data structure guarantees O(1) lookup time?</text>
    <text x="24" y="100" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">(A) Binary Tree   (B) HashTable   (C) Linked List  → <tspan fill="#059669" font-weight="bold">Ans: (B)</tspan></text>
    <text x="14" y="122" fill="#4f46e5" font-size="9" font-family="'Inter', sans-serif" font-weight="700">Total 500+ Practice MCQs available in Appendix E.</text>
  </g>

  <line x1="36" y1="565" x2="414" y2="565" stroke="#e2e8f0" stroke-width="1"/>
  <text x="36" y="585" fill="#64748b" font-size="9" font-family="'Inter', sans-serif">StudentBook Academic Textbook Edition</text>
  <text x="414" y="585" fill="#64748b" font-size="9" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="end">Page 43</text>

  <rect x="0" y="0" width="450" height="620" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
</svg>`);
}

// 6. 3D Perspective Desk View
function generate3DAngle(b) {
  const c1 = b.themeColor || "#1e1b4b";
  const c2 = b.themeColorDark || "#0f172a";
  const accent = b.accentColor || "#f59e0b";
  const title = b.name;
  const author = b.author || "Standard Edition";
  const publisher = (b.specs && b.specs.publisher) || "Academic Press";

  return encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 620" width="450" height="620">
  <defs>
    <linearGradient id="deskBg_${b.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="cover3d_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="70%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="pageStack_${b.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#f8fafc"/>
      <stop offset="70%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>

  <rect width="450" height="620" fill="url(#deskBg_${b.id})"/>
  
  <g opacity="0.3" stroke="#94a3b8" stroke-width="2" fill="none">
    <rect x="40" y="60" width="90" height="130" rx="4"/>
    <line x1="50" y1="80" x2="115" y2="80"/>
    <line x1="50" y1="100" x2="115" y2="100"/>
    <line x1="50" y1="120" x2="115" y2="120"/>
  </g>

  <ellipse cx="235" cy="510" rx="160" ry="25" fill="rgba(15, 23, 42, 0.28)"/>

  <g transform="translate(100, 100)">
    <polygon points="230,20 280,60 280,390 230,350" fill="url(#pageStack_${b.id})" stroke="#94a3b8" stroke-width="1"/>
    <line x1="240" y1="28" x2="240" y2="358" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="250" y1="36" x2="250" y2="366" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="260" y1="44" x2="260" y2="374" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="270" y1="52" x2="270" y2="382" stroke="#cbd5e1" stroke-width="1"/>

    <polygon points="0,380 230,350 280,390 50,420" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
    
    <polygon points="0,50 30,20 30,350 0,380" fill="#090d16" stroke="rgba(255,255,255,0.15)"/>
    <line x1="15" y1="35" x2="15" y2="365" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

    <polygon points="30,20 230,20 230,350 30,350" fill="url(#cover3d_${b.id})" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

    <g transform="translate(45, 40)">
      <text x="0" y="14" fill="${accent}" font-size="9" font-family="'Outfit', sans-serif" font-weight="800" letter-spacing="1">${escapeXml(publisher.toUpperCase())}</text>
      <text x="0" y="44" fill="#ffffff" font-size="14" font-family="'Outfit', sans-serif" font-weight="800">${escapeXml(title.substring(0, 18))}...</text>
      <text x="0" y="60" fill="#e2e8f0" font-size="10" font-family="'Outfit', sans-serif" font-weight="600">By ${escapeXml(author)}</text>
      
      <circle cx="70" cy="130" r="34" fill="rgba(255,255,255,0.06)" stroke="${accent}" stroke-width="1.5"/>
      <text x="70" y="138" font-size="24" text-anchor="middle">${b.icon || "📘"}</text>

      <rect x="0" y="210" width="140" height="24" rx="4" fill="${accent}" opacity="0.95"/>
      <text x="70" y="226" fill="#000000" font-size="9" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle">STUDENT EDITION</text>
    </g>

    <polygon points="30,20 180,20 100,350 30,350" fill="rgba(255,255,255,0.12)"/>
  </g>

  <g transform="translate(130, 560)">
    <rect width="190" height="28" rx="14" fill="#0f172a" stroke="rgba(255,255,255,0.2)"/>
    <text x="95" y="18" fill="#38bdf8" font-size="10.5" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">📐 3D Paperback Edition</text>
  </g>

  <rect x="1" y="1" width="448" height="618" rx="9" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/>
</svg>`);
}

// Hydrate book object with all 6 realistic graphics
function hydrateBook(book) {
  const front = generateFrontCover(book);
  const back = generateBackCover(book);
  const toc = generateTableOfContents(book);
  const sample1 = generateSamplePage1(book);
  const sample2 = generateSamplePage2(book);
  const angle = generate3DAngle(book);

  return {
    ...book,
    img: front,
    images: [
      { url: front, label: "📘 Front Cover", type: "front" },
      { url: back, label: "📖 Back Cover", type: "back" },
      { url: toc, label: "📑 Table of Contents", type: "toc" },
      { url: sample1, label: "🔍 Look Inside (Sample Page 1)", type: "sample1" },
      { url: sample2, label: "💡 Lab & Exercises (Sample Page 2)", type: "sample2" },
      { url: angle, label: "📐 3D Angle & Desk View", type: "angle" }
    ]
  };
}

// 10 Core Academic & Engineering Textbooks Database
const rawBooks = [
  {
    id: 1,
    name: "Java: The Complete Reference (12th Edition)",
    author: "Herbert Schildt",
    price: 299,
    originalPrice: 599,
    category: "Programming",
    rating: 4.8,
    reviews: 142,
    badge: "Bestseller",
    themeColor: "#881337",
    themeColorDark: "#4c0519",
    accentColor: "#f59e0b",
    icon: "☕",
    specs: {
      publisher: "McGraw-Hill Education",
      edition: "12th Edition (2026)",
      pages: "1,248 Pages",
      language: "English",
      isbn: "978-1260440232",
      format: "Paperback (Student Edition)"
    },
    highlights: [
      "Includes Java 21 LTS syntax, Concurrency & Stream APIs",
      "Complete OOPs, Design Patterns & Spring Boot Primer",
      "250+ Solved University Exam Questions with Code Snippets",
      "Free Access to Online Practice Repository & Code Labs"
    ],
    reviewsList: [
      { user: "Aarav Sharma (IIT Bombay)", rating: 5, comment: "Essential book for second year engineering. Code examples are crystal clear!" },
      { user: "Sneha Patel (VIT Vellore)", rating: 5, comment: "Best Java reference book with thorough object-oriented programming breakdown." },
      { user: "Rohan Verma (NIT Trichy)", rating: 4.5, comment: "Great physical paper quality and quick delivery to our campus hostel." }
    ],
    description: "Comprehensive guide to Core & Advanced Java, OOP principles, Streams, and Spring Boot basics. Features step-by-step explanations, real-world examples, and campus question sets."
  },
  {
    id: 2,
    name: "Python Crash Course & Data Science",
    author: "Eric Matthes",
    price: 250,
    originalPrice: 499,
    category: "Programming",
    rating: 4.9,
    reviews: 210,
    badge: "Popular",
    themeColor: "#064e3b",
    themeColorDark: "#022c22",
    accentColor: "#38bdf8",
    icon: "🐍",
    specs: {
      publisher: "No Starch Press / O'Reilly",
      edition: "3rd Revised Edition",
      pages: "552 Pages",
      language: "English",
      isbn: "978-1718502703",
      format: "Paperback"
    },
    highlights: [
      "Hands-on projects: Web Apps, Data Visualization & Automation",
      "Covers NumPy, Pandas, Matplotlib & Pygame in depth",
      "Step-by-step problem sets with downloadable source code",
      "Recommended for BCA, B.Tech, MCA & Data Science beginners"
    ],
    reviewsList: [
      { user: "Priya Nair (BITS Pilani)", rating: 5, comment: "Helped me crack my Python coding round! The project section is gold." },
      { user: "Aditya Roy (Delhi University)", rating: 5, comment: "Super fast delivery and print quality is top notch." }
    ],
    description: "Hands-on project-based introduction to programming in Python, Pandas, Numpy, data analytics, and browser automation."
  },
  {
    id: 3,
    name: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    price: 500,
    originalPrice: 899,
    category: "AI",
    rating: 4.7,
    reviews: 98,
    badge: "Must Read",
    themeColor: "#1e1b4b",
    themeColorDark: "#0f172a",
    accentColor: "#818cf8",
    icon: "🧠",
    specs: {
      publisher: "Pearson Higher Education",
      edition: "4th Global Edition",
      pages: "1,152 Pages",
      language: "English",
      isbn: "978-0134610993",
      format: "Paperback (Student Edition)"
    },
    highlights: [
      "Standard textbook used across top engineering universities & IITs",
      "Explains Heuristic Search, Knowledge Representation & Game Playing",
      "Covers Probabilistic Reasoning, Deep Learning & Autonomous Agents",
      "Includes pseudo-code algorithms & real-world case studies"
    ],
    reviewsList: [
      { user: "Vikram Sen (IIT Delhi)", rating: 5, comment: "The bible of Artificial Intelligence. Must buy for every CS student." },
      { user: "Ananya Joshi (COEP Pune)", rating: 4.5, comment: "Thorough mathematical rigor and great heuristic algorithms chapter." }
    ],
    description: "The definitive reference text on Artificial Intelligence concepts, heuristic search, logic, machine agents, neural systems, and NLP."
  },
  {
    id: 4,
    name: "Hands-On Machine Learning & Neural Networks",
    author: "Aurélien Géron & Andrew Ng",
    price: 550,
    originalPrice: 950,
    category: "AI",
    rating: 4.9,
    reviews: 185,
    badge: "Top Rated",
    themeColor: "#7c2d12",
    themeColorDark: "#451a03",
    accentColor: "#fbbf24",
    icon: "⚡",
    specs: {
      publisher: "O'Reilly Media",
      edition: "3rd Edition (2025)",
      pages: "850 Pages",
      language: "English",
      isbn: "978-1098125974",
      format: "Paperback"
    },
    highlights: [
      "Practical ML pipelines with Scikit-Learn, Keras, & TensorFlow",
      "Deep Neural Networks, CNNs, RNNs, and Transformers architecture",
      "End-to-end real world classification & regression projects",
      "Full companion Jupyter notebooks and datasets provided"
    ],
    reviewsList: [
      { user: "Devansh Mehta (DTU Delhi)", rating: 5, comment: "Super practical! The Scikit-Learn and Keras code examples are awesome." },
      { user: "Meera Krishnan (Anna University)", rating: 5, comment: "Clear explanation of backpropagation and loss functions." }
    ],
    description: "Practical Machine Learning with Scikit-Learn, Keras, TensorFlow, and Deep Neural Networks with end-to-end industry projects."
  },
  {
    id: 5,
    name: "Computer Networking: A Top-Down Approach",
    author: "James F. Kurose & Keith W. Ross",
    price: 420,
    originalPrice: 750,
    category: "Networking",
    rating: 4.6,
    reviews: 87,
    badge: "College Essential",
    themeColor: "#0c4a6e",
    themeColorDark: "#082f49",
    accentColor: "#06b6d4",
    icon: "🌐",
    specs: {
      publisher: "Pearson Education",
      edition: "8th Edition",
      pages: "864 Pages",
      language: "English",
      isbn: "978-0136681557",
      format: "Paperback"
    },
    highlights: [
      "Application-layer first pedagogy making complex networking intuitive",
      "Covers HTTP/3, QUIC, DNS, BGP routing, TCP congestion control, & 5G",
      "Wireshark lab assignments with step-by-step packet inspection",
      "Must-have textbook for GATE CSE and university networking syllabus"
    ],
    reviewsList: [
      { user: "Karan Singhal (NIT Surathkal)", rating: 5, comment: "Wireshark packet analysis labs are very well designed in this book." },
      { user: "Tanvi Saxena (IIIT Hyderabad)", rating: 4.5, comment: "Top-down approach is 100x easier to learn than traditional bottom-up." }
    ],
    description: "Learn TCP/IP layers, routing protocols, DNS, socket programming, Wireshark packet analysis, and 5G wireless network design."
  },
  {
    id: 6,
    name: "Cyber Security & Ethical Hacking",
    author: "Kevin Mitnick & Jon Erickson",
    price: 450,
    originalPrice: 800,
    category: "Security",
    rating: 4.8,
    reviews: 130,
    badge: "Trending",
    themeColor: "#0f172a",
    themeColorDark: "#020617",
    accentColor: "#ef4444",
    icon: "🛡️",
    specs: {
      publisher: "Wiley / Sybex",
      edition: "2026 Student Edition",
      pages: "672 Pages",
      language: "English",
      isbn: "978-1119802808",
      format: "Paperback"
    },
    highlights: [
      "Fundamentals of Kali Linux, Metasploit, Nmap, Wireshark, & Burp Suite",
      "Web application security, OWASP Top 10 vulnerabilities & mitigations",
      "Cryptography, public key infrastructure, network defense & SIEM",
      "Includes ethical hacking lab simulations and practice exams"
    ],
    reviewsList: [
      { user: "Manish Reddy (Osmania Univ)", rating: 5, comment: "Fascinating read with real world case studies on social engineering." },
      { user: "Siddharth Jain (BITS Goa)", rating: 5, comment: "Kali Linux tools explanation is practical and straightforward." }
    ],
    description: "Fundamental network security, penetration testing, cryptography, defensive cybersecurity, and hands-on Kali Linux labs."
  },
  {
    id: 7,
    name: "Database System Concepts (SQL & NoSQL)",
    author: "Abraham Silberschatz & Henry Korth",
    price: 380,
    originalPrice: 650,
    category: "Database",
    rating: 4.7,
    reviews: 92,
    badge: "Core Subject",
    themeColor: "#1e3a8a",
    themeColorDark: "#172554",
    accentColor: "#f59e0b",
    icon: "💾",
    specs: {
      publisher: "McGraw-Hill Education",
      edition: "7th Edition",
      pages: "1,376 Pages",
      language: "English",
      isbn: "978-0078022159",
      format: "Paperback"
    },
    highlights: [
      "Comprehensive coverage of Relational Algebra, SQL queries, & Triggers",
      "Indexing (B+ trees, Hashing), Query Optimization & Transaction ACID",
      "Includes modern NoSQL databases (MongoDB, Redis, Neo4j) & Big Data",
      "Hundreds of practice problems and university exam question banks"
    ],
    reviewsList: [
      { user: "Harsh Vardhan (JNTU Hyderabad)", rating: 5, comment: "All normalization concepts from 1NF to BCNF explained with easy tables." },
      { user: "Pooja Gupta (Mumbai University)", rating: 4.5, comment: "Very comprehensive book for DBMS semester course." }
    ],
    description: "Relational database design, SQL queries, Normalization, indexing, ACID properties, and MongoDB NoSQL database systems."
  },
  {
    id: 8,
    name: "Full Stack Web Development (MERN & Next.js)",
    author: "Robin Wieruch",
    price: 490,
    originalPrice: 850,
    category: "Programming",
    rating: 4.9,
    reviews: 164,
    badge: "Career Ready",
    themeColor: "#090d16",
    themeColorDark: "#020617",
    accentColor: "#00d8ff",
    icon: "⚛️",
    specs: {
      publisher: "Packt Publishing",
      edition: "2nd Edition (2026)",
      pages: "720 Pages",
      language: "English",
      isbn: "978-1801078412",
      format: "Paperback"
    },
    highlights: [
      "Master React 19, Node.js, Express, MongoDB & RESTful API architecture",
      "Authentication with JWT, state management with Redux Toolkit",
      "Deploy production apps on cloud platforms with Docker & CI/CD",
      "3 complete production-grade portfolio projects included with full source"
    ],
    reviewsList: [
      { user: "Rahul Chawla (Thapar University)", rating: 5, comment: "Built my final year project with the help of this MERN guide!" },
      { user: "Divya Sundaram (PSG Tech)", rating: 5, comment: "Up to date with modern React Hooks and Express async patterns." }
    ],
    description: "Build modern, responsive full stack web applications with React, Node.js, Express, and MongoDB from scratch."
  },
  {
    id: 9,
    name: "Introduction to Algorithms (CLRS 4th Edition)",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    price: 520,
    originalPrice: 999,
    category: "Programming",
    rating: 4.9,
    reviews: 240,
    badge: "Legendary",
    themeColor: "#172554",
    themeColorDark: "#0f172a",
    accentColor: "#38bdf8",
    icon: "🌲",
    specs: {
      publisher: "The MIT Press",
      edition: "4th Edition (2026)",
      pages: "1,312 Pages",
      language: "English",
      isbn: "978-0262046305",
      format: "Hardcover (Student Edition)"
    },
    highlights: [
      "The definitive global textbook on algorithms, data structures & complexity",
      "In-depth analysis of Dynamic Programming, Greedy, Graph Algorithms & Flow",
      "Advanced B-Trees, Fibonacci Heaps, NP-Completeness & Approximation",
      "Essential reference for GATE CSE, Coding Competitions & Top Tech Interviews"
    ],
    reviewsList: [
      { user: "Akash Singhania (IIT Madras)", rating: 5, comment: "The gold standard for algorithms. Clear mathematical proofs." },
      { user: "Sanjana Rao (BITS Pilani)", rating: 5, comment: "Mastering CLRS made my Google coding rounds a breeze." }
    ],
    description: "The authoritative textbook covering algorithmic complexity, sorting, graph traversal, dynamic programming, and data structures."
  },
  {
    id: 10,
    name: "Operating System Concepts (10th Dinosaur Edition)",
    author: "Abraham Silberschatz & Peter Galvin",
    price: 410,
    originalPrice: 720,
    category: "Programming",
    rating: 4.8,
    reviews: 115,
    badge: "Core Subject",
    themeColor: "#115e59",
    themeColorDark: "#042f2e",
    accentColor: "#fbbf24",
    icon: "🦖",
    specs: {
      publisher: "John Wiley & Sons",
      edition: "10th Edition",
      pages: "976 Pages",
      language: "English",
      isbn: "978-1118063330",
      format: "Paperback"
    },
    highlights: [
      "Process Management, CPU Scheduling, Threads, & Deadlock Handling",
      "Virtual Memory, Page Replacement Algorithms, & File System Architecture",
      "Real-world case studies on Linux Kernel, Windows 11 & Android OS",
      "Hundreds of university exam questions with step-by-step solutions"
    ],
    reviewsList: [
      { user: "Nikhil Joshi (Pune University)", rating: 5, comment: "The dinosaur book is unmatched for OS fundamentals!" },
      { user: "Ananya Sen (Jadavpur University)", rating: 4.5, comment: "CPU scheduling & paging algorithms are explained with intuitive diagrams." }
    ],
    description: "Fundamental principles of operating systems, process synchronization, memory paging, file systems, and storage management."
  }
];

// Hydrate fallback catalog
const defaultBooks = rawBooks.map((b) => hydrateBook(b));

// Determine Base API URL
const API_BASE =
  typeof window !== "undefined" &&
  (window.location.protocol === "http:" || window.location.protocol === "https:")
    ? ""
    : "http://localhost:5000";

// Application State
let allBooks = [];
let cart = JSON.parse(localStorage.getItem("student_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("student_wishlist")) || [];
let currentCategory = "all";
let currentSearch = "";
let activeModalBook = null;
let activeModalImageIndex = 0;
let activeReaderBook = null;
let activeReaderPageIndex = 0;
let activeLightboxIndex = 0;
let activeLightboxImages = [];

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initScrollListeners();
  initModalKeyboard();
  updateAuthUI();
  updateCounters();
  fetchBooks();
});

// Scroll Listeners for Sticky Header & Back to Top Button
function initScrollListeners() {
  const header = document.querySelector("header");
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (header) {
      if (scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("student_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    updateThemeIcon(true);
  }
}

function toggleTheme() {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.classList.add("spin");
    setTimeout(() => btn.classList.remove("spin"), 500);
  }

  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("student_theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.innerHTML = isDark ? "☀️" : "🌙";
  }
}

// User Authentication State
function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("student_user"));
  const authContainer = document.getElementById("navAuthContainer");
  if (!authContainer) return;

  if (user && user.username) {
    authContainer.innerHTML = `
      <div class="user-badge">
        <span>👤 ${user.name || user.username}</span>
      </div>
      <button class="nav-btn" onclick="logoutUser()" title="Logout" style="color: var(--danger); background: var(--bg-subtle);">
        🚪 Logout
      </button>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn-login-nav">
        🔑 Student Login
      </a>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem("student_user");
  showToast("Logged out successfully", "info");
  updateAuthUI();
}

// Fetch Books from Backend API with Fallback
async function fetchBooks() {
  const container = document.getElementById("booksGrid");
  if (container && allBooks.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px;">
        <div style="font-size: 2.5rem; margin-bottom: 12px; display: inline-block; animation: floatSlow 2s ease-in-out infinite;">📚</div>
        <h3>Loading textbooks catalog...</h3>
      </div>
    `;
  }

  try {
    const res = await fetch(`${API_BASE}/api/books`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      // Re-hydrate if needed
      allBooks = result.data.map((b) => (b.images && b.images.length >= 5 ? b : hydrateBook(b)));
      renderBooks();
      return;
    }
  } catch (error) {
    console.warn("Could not reach backend API, loading local catalog:", error.message);
  }

  // Fallback to default books list
  allBooks = defaultBooks;
  renderBooks();
}

// Render Books Grid with 3D Book Cover Look
function renderBooks() {
  const container = document.getElementById("booksGrid");
  if (!container) return;

  let filtered = allBooks;

  // Filter by Category
  if (currentCategory !== "all") {
    filtered = filtered.filter(
      (b) => b.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Filter by Search Query
  if (currentSearch.trim() !== "") {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">🔍</div>
        <h3>No textbooks found</h3>
        <p>Try searching for a different subject, author, or keyword.</p>
        <button class="btn-primary" onclick="resetFilters()">Show All Textbooks</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((book, index) => {
      const isWished = wishlist.some((item) => item.id === book.id);
      const discountPct = book.originalPrice
        ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
        : 0;
      const imagesCount = (book.images && book.images.length) || 6;

      return `
      <div class="book-card animate-entrance" style="--anim-order: ${index}" onclick="openBookModal(${book.id})" role="button" tabindex="0" title="Click to view all images & textbook details">
        <div class="card-img-wrapper">
          <img src="${book.img}" alt="${book.name}" loading="lazy">
          ${book.badge ? `<span class="card-badge">${book.badge}</span>` : ""}
          <span class="card-gallery-count">🖼️ ${imagesCount} Photos</span>
          <div class="card-look-inside-overlay">
            <span>👁️ Quick View &amp; Look Inside</span>
          </div>
          <button class="card-wish-btn ${isWished ? "wished" : ""}" 
                  onclick="toggleWishlist(${book.id}, event)" 
                  title="${isWished ? "Remove from wishlist" : "Add to wishlist"}">
            ${isWished ? "❤️" : "🤍"}
          </button>
        </div>
        
        <div class="card-body">
          <span class="card-category">${book.category}</span>
          <h3 class="card-title" title="${book.name}">${book.name}</h3>
          <p class="card-author">By ${book.author || "Standard Edition"}</p>
          
          <div class="card-rating">
            <span class="stars">★ ${book.rating || "4.8"}</span>
            <span class="rating-count">(${book.reviews || 120} reviews)</span>
          </div>

          <div class="card-footer">
            <div class="card-price-group">
              <div style="display: flex; align-items: baseline; gap: 6px;">
                <span class="card-price">₹${book.price}</span>
                ${book.originalPrice ? `<span class="card-original-price">₹${book.originalPrice}</span>` : ""}
              </div>
              ${discountPct > 0 ? `<span class="card-discount-tag">${discountPct}% OFF</span>` : ""}
            </div>
            <button class="btn-add-cart" onclick="addToCart(${book.id}, event)">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Category Filter Handling
function filterCategory(category, btnElement) {
  currentCategory = category;

  document.querySelectorAll(".cat-btn").forEach((btn) => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  }

  renderBooks();
}

// Search Filter Handling
function handleSearch(query) {
  currentSearch = query;
  renderBooks();
}

function resetFilters() {
  currentCategory = "all";
  currentSearch = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll(".cat-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", idx === 0);
  });

  renderBooks();
}

// Micro-Interaction: Fly Item to Cart Icon
function animateFlyToCart(sourceBtn) {
  const cartNavBtn = document.getElementById("navCart");
  if (!sourceBtn || !cartNavBtn) {
    triggerBadgeBump("cartCount");
    return;
  }

  const startRect = sourceBtn.getBoundingClientRect();
  const endRect = cartNavBtn.getBoundingClientRect();

  const flyingOrb = document.createElement("div");
  flyingOrb.className = "flying-cart-orb";
  flyingOrb.innerText = "📖";
  flyingOrb.style.left = `${startRect.left + startRect.width / 2 - 16}px`;
  flyingOrb.style.top = `${startRect.top + startRect.height / 2 - 16}px`;
  flyingOrb.style.opacity = "1";
  flyingOrb.style.transform = "scale(1)";

  document.body.appendChild(flyingOrb);

  requestAnimationFrame(() => {
    flyingOrb.style.left = `${endRect.left + endRect.width / 2 - 16}px`;
    flyingOrb.style.top = `${endRect.top + endRect.height / 2 - 16}px`;
    flyingOrb.style.transform = "scale(0.3) rotate(360deg)";
    flyingOrb.style.opacity = "0.2";
  });

  setTimeout(() => {
    flyingOrb.remove();
    triggerBadgeBump("cartCount");
  }, 700);
}

function triggerBadgeBump(badgeId) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}

// ==========================================================
// Cart Management System
// ==========================================================

function addToCart(bookId, event) {
  if (event) event.stopPropagation();

  const book = allBooks.find((b) => b.id === bookId) || defaultBooks.find((b) => b.id === bookId);
  if (!book) return;

  const existing = cart.find((item) => item.id === bookId);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
    showToast(`Increased "${book.name.substring(0, 18)}..." qty to ${existing.qty}`, "info");
  } else {
    cart.push({
      id: book.id,
      name: book.name,
      author: book.author,
      price: book.price,
      originalPrice: book.originalPrice,
      img: book.img,
      category: book.category,
      qty: 1
    });
    showToast(`Added "${book.name.substring(0, 18)}..." to cart 🛒`, "success");
  }

  saveCart();
  updateCounters();

  if (event && event.target) {
    animateFlyToCart(event.target);
  }
}

function updateCartQty(bookId, delta) {
  const item = cart.find((i) => i.id === bookId);
  if (!item) return;

  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) {
    removeFromCart(bookId);
    return;
  }

  saveCart();
  renderCart();
  updateCounters();
}

function removeFromCart(bookId) {
  const item = cart.find((i) => i.id === bookId);
  cart = cart.filter((i) => i.id !== bookId);
  saveCart();
  renderCart();
  updateCounters();

  if (item) {
    showToast(`Removed "${item.name.substring(0, 18)}..." from cart`, "info");
  }
}

function saveCart() {
  localStorage.setItem("student_cart", JSON.stringify(cart));
}

function renderCart() {
  const container = document.getElementById("cartItemsList");
  const summaryValues = document.getElementById("summaryValues");
  if (!container || !summaryValues) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Explore our textbook catalog and add engineering, coding, or AI books.</p>
        <button class="btn-primary" onclick="showSection('books')">Browse Textbooks 📚</button>
      </div>
    `;
    summaryValues.innerHTML = `
      <div class="summary-row">
        <span>Items Total:</span>
        <span>₹0</span>
      </div>
      <div class="summary-row total-row">
        <span>Total Payable:</span>
        <span>₹0</span>
      </div>
    `;
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item-card" data-cart-id="${item.id}" onclick="openBookModal(${item.id})" style="cursor: pointer;" title="Click to view full details">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-author">By ${item.author || "Standard Edition"}</p>
        <div class="cart-item-price-row">
          <span class="cart-item-price">₹${item.price}</span>
          ${item.originalPrice ? `<span class="cart-item-original">₹${item.originalPrice}</span>` : ""}
        </div>
      </div>
      <div class="cart-item-controls" onclick="event.stopPropagation()">
        <div class="qty-btn-group">
          <button class="btn-qty" onclick="updateCartQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty || 1}</span>
          <button class="btn-qty" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
          🗑️
        </button>
      </div>
    </div>
  `
    )
    .join("");

  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const mrpTotal = cart.reduce(
    (sum, item) => sum + (item.originalPrice || item.price * 1.5) * (item.qty || 1),
    0
  );
  const studentDiscount = Math.round(subtotal * 0.1);
  const totalSavings = Math.round(mrpTotal - subtotal + studentDiscount);
  const finalTotal = subtotal - studentDiscount;

  summaryValues.innerHTML = `
    <div class="summary-row">
      <span>Total MRP (${cart.reduce((c, i) => c + (i.qty || 1), 0)} items):</span>
      <span>₹${Math.round(mrpTotal)}</span>
    </div>
    <div class="summary-row">
      <span>Textbook Discount:</span>
      <span style="color: var(--success); font-weight:700;">− ₹${Math.round(mrpTotal - subtotal)}</span>
    </div>
    <div class="summary-row">
      <span>Student Coupon (10% OFF):</span>
      <span style="color: var(--success); font-weight:700;">− ₹${studentDiscount}</span>
    </div>
    <div class="summary-row">
      <span>Campus Express Delivery:</span>
      <span style="color: var(--success); font-weight: 700;">FREE</span>
    </div>
    <div class="summary-row total-row">
      <span>Total Amount:</span>
      <span class="total-amount-highlight">₹${finalTotal}</span>
    </div>
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: #065f46; padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; margin-top: 12px; text-align: center;">
      🎉 You save ₹${totalSavings} on this order!
    </div>
  `;
}

// Proceed to Checkout
async function proceedCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem("student_user"));
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const studentDiscount = Math.round(subtotal * 0.1);
  const finalTotal = subtotal - studentDiscount;

  const orderPayload = {
    items: cart,
    totalAmount: finalTotal,
    user: user ? user.name || user.username : "Student Guest"
  };

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();

    if (data.success) {
      showOrderSuccessModal(data.order);
      cart = [];
      saveCart();
      updateCounters();
      return;
    }
  } catch (err) {
    console.warn("Backend checkout offline, simulating client order completion:", err);
  }

  // Fallback offline order success
  const simulatedOrder = {
    orderId: "CAMPUS-" + Math.floor(100000 + Math.random() * 900000),
    items: [...cart],
    totalAmount: finalTotal,
    user: user ? user.name || user.username : "Student Guest",
    orderDate: new Date().toISOString()
  };

  showOrderSuccessModal(simulatedOrder);
  cart = [];
  saveCart();
  updateCounters();
}

function showOrderSuccessModal(order) {
  const modal = document.getElementById("orderSuccessModal");
  const details = document.getElementById("modalOrderDetails");
  if (!modal || !details) return;

  details.innerHTML = `
    <div style="margin-bottom: 8px;"><strong>Order ID:</strong> <span style="color: var(--primary); font-family: monospace;">#${order.orderId}</span></div>
    <div style="margin-bottom: 8px;"><strong>Recipient:</strong> ${order.user}</div>
    <div style="margin-bottom: 8px;"><strong>Total Paid:</strong> <span style="font-weight: 800; color: var(--success); font-size: 1.1rem;">₹${order.totalAmount}</span></div>
    <div style="margin-bottom: 8px;"><strong>Delivery To:</strong> Campus Hostel / University Reception</div>
    <div><strong>Estimated Delivery:</strong> Tomorrow by 4:00 PM (Express) ⚡</div>
  `;

  modal.classList.add("active");
  triggerConfetti();
}

function closeModal() {
  const modal = document.getElementById("orderSuccessModal");
  if (modal) modal.classList.remove("active");
  showSection("books");
}

function triggerConfetti() {
  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.8}s`;
    confetti.style.animationDuration = `${1.8 + Math.random() * 1.5}s`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3500);
  }
}

// ==========================================================
// Wishlist Management System
// ==========================================================

function toggleWishlist(bookId, event) {
  if (event) event.stopPropagation();

  const book = allBooks.find((b) => b.id === bookId) || defaultBooks.find((b) => b.id === bookId);
  if (!book) return;

  const idx = wishlist.findIndex((item) => item.id === bookId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed from wishlist`, "info");
  } else {
    wishlist.push({
      id: book.id,
      name: book.name,
      author: book.author,
      price: book.price,
      originalPrice: book.originalPrice,
      img: book.img,
      category: book.category
    });
    showToast(`Saved "${book.name.substring(0, 18)}..." to Wishlist ❤️`, "success");
  }

  saveWishlist();
  updateCounters();
  renderBooks();

  // If in wishlist view, re-render
  const wishlistSec = document.getElementById("wishlistSection");
  if (wishlistSec && wishlistSec.style.display !== "none") {
    renderWishlist();
  }

  // Update modal wishlist icon if active
  if (activeModalBook && activeModalBook.id === bookId) {
    const modalWishBtn = document.querySelector(".modal-wish-btn");
    if (modalWishBtn) {
      const isWished = wishlist.some((i) => i.id === bookId);
      modalWishBtn.classList.toggle("wished", isWished);
      modalWishBtn.innerHTML = isWished ? "❤️" : "🤍";
    }
  }
}

function saveWishlist() {
  localStorage.setItem("student_wishlist", JSON.stringify(wishlist));
}

function renderWishlist() {
  const container = document.getElementById("wishlistGrid");
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">❤️</div>
        <h3>Your Wishlist is Empty</h3>
        <p>Save textbooks you want to purchase later for upcoming semesters.</p>
        <button class="btn-primary" onclick="showSection('books')">Browse Textbooks 📚</button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist
    .map((item, index) => {
      const discountPct = item.originalPrice
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
        : 0;

      return `
    <div class="book-card animate-entrance" style="--anim-order: ${index}" onclick="openBookModal(${item.id})" role="button" tabindex="0" title="Click to view all images & details">
      <div class="card-img-wrapper">
        <img src="${item.img}" alt="${item.name}">
        <span class="card-gallery-count">🖼️ Multi-Photos</span>
        <button class="card-wish-btn wished" onclick="toggleWishlist(${item.id}, event)" title="Remove from wishlist">
          ❤️
        </button>
      </div>
      <div class="card-body">
        <span class="card-category">${item.category}</span>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-author">By ${item.author || "Standard Edition"}</p>
        
        <div class="card-footer">
          <div class="card-price-group">
            <span class="card-price">₹${item.price}</span>
            ${discountPct > 0 ? `<span class="card-discount-tag">${discountPct}% OFF</span>` : ""}
          </div>
          <button class="btn-add-cart" onclick="addToCart(${item.id}, event)">
            🛒 Move to Cart
          </button>
        </div>
      </div>
    </div>
  `;
    })
    .join("");
}

// Navigation & Section Visibility Switcher
function showSection(sectionName) {
  const booksSec = document.getElementById("booksSection");
  const cartSec = document.getElementById("cartSection");
  const wishSec = document.getElementById("wishlistSection");
  const heroSec = document.getElementById("heroSection");
  const controlsSec = document.getElementById("controlsSection");

  const navBooks = document.getElementById("navBooks");
  const navCart = document.getElementById("navCart");
  const navWish = document.getElementById("navWish");

  // Reset nav active classes
  [navBooks, navCart, navWish].forEach((btn) => btn && btn.classList.remove("active"));

  if (sectionName === "books") {
    if (booksSec) booksSec.style.display = "block";
    if (cartSec) cartSec.style.display = "none";
    if (wishSec) wishSec.style.display = "none";
    if (heroSec) heroSec.style.display = "block";
    if (controlsSec) controlsSec.style.display = "flex";
    if (navBooks) navBooks.classList.add("active");
    renderBooks();
  } else if (sectionName === "cart") {
    if (booksSec) booksSec.style.display = "none";
    if (cartSec) cartSec.style.display = "block";
    if (wishSec) wishSec.style.display = "none";
    if (heroSec) heroSec.style.display = "none";
    if (controlsSec) controlsSec.style.display = "none";
    if (navCart) navCart.classList.add("active");
    renderCart();
  } else if (sectionName === "wishlist") {
    if (booksSec) booksSec.style.display = "none";
    if (cartSec) cartSec.style.display = "none";
    if (wishSec) wishSec.style.display = "block";
    if (heroSec) heroSec.style.display = "none";
    if (controlsSec) controlsSec.style.display = "none";
    if (navWish) navWish.classList.add("active");
    renderWishlist();
  }

  scrollToTop();
}

function updateCounters() {
  const cartBadge = document.getElementById("cartCount");
  const wishBadge = document.getElementById("wishCount");

  const totalCartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  if (cartBadge) cartBadge.innerText = totalCartCount;
  if (wishBadge) wishBadge.innerText = wishlist.length;
}

// Toast Notifications
function showToast(message, type = "success") {
  const existing = document.querySelectorAll(".toast");
  existing.forEach((t) => t.remove());

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(60px) scale(0.9)";
    toast.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================================
// Flipkart-Style Book Detail & Multi-Image Gallery System
// ==========================================================

function openBookModal(bookId) {
  const book =
    allBooks.find((b) => b.id === bookId) || defaultBooks.find((b) => b.id === bookId);
  if (!book) return;

  activeModalBook = book;
  activeModalImageIndex = 0;

  const modal = document.getElementById("bookDetailModal");
  if (!modal) return;

  renderBookModalContent(book);

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Initialize Magnifier Zoom Lens
  setTimeout(() => {
    setupImageZoom();
  }, 100);
}

function renderBookModalContent(book) {
  const modalBody = document.getElementById("bookModalBody");
  if (!modalBody) return;

  const images =
    book.images && book.images.length > 0
      ? book.images
      : [
          { url: book.img, label: "Front Cover" },
          { url: book.img, label: "Back Cover" }
        ];

  const currentImg = images[activeModalImageIndex] || images[0];
  const isWished = wishlist.some((item) => item.id === book.id);
  const discountPct = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;
  const savedAmount = book.originalPrice ? book.originalPrice - book.price : 0;

  const specs = book.specs || {
    publisher: "McGraw-Hill Education",
    edition: "2026 Student Edition",
    pages: "650+ Pages",
    language: "English",
    isbn: "978-0123456789",
    format: "Paperback"
  };

  const highlights = book.highlights || [
    "University syllabus aligned with semester exam preparation sets",
    "Complete OOPs, Design Patterns & Coding primer",
    "250+ Solved exam questions with detailed diagrams",
    "Digital formula sheet & companion project files included"
  ];

  const reviewsList = book.reviewsList || [
    {
      user: "Engineering Student",
      rating: 5,
      comment: "High quality print and arrived within 24 hours at our campus hostel!"
    },
    {
      user: "CS Undergraduate",
      rating: 4.8,
      comment: "Essential reference book with clean code snippets."
    }
  ];

  modalBody.innerHTML = `
    <div class="modal-detail-layout">
      
      <!-- LEFT COLUMN: Flipkart-Style Multi-Image Gallery & Actions -->
      <div class="modal-gallery-column">
        
        <div class="modal-gallery-main-row">
          <!-- Vertical Thumbnail Strip -->
          <div class="modal-thumbnails-strip" id="modalThumbnailsStrip">
            ${images
              .map(
                (imgObj, idx) => `
              <div class="modal-thumb-item ${idx === activeModalImageIndex ? "active" : ""}" 
                   onclick="switchModalImage(${idx})"
                   onmouseenter="switchModalImage(${idx})"
                   title="${imgObj.label || `Image ${idx + 1}`}">
                <img src="${imgObj.url}" alt="${imgObj.label || `View ${idx + 1}`}">
                <span class="thumb-label">${imgObj.label || `View ${idx + 1}`}</span>
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Main Image Display Frame with Magnifier Zoom -->
          <div class="modal-main-image-container">
            <div class="modal-main-img-wrap" id="modalMainImgWrap" onclick="openLightboxFromModal()">
              <img id="modalActiveImage" src="${currentImg.url}" alt="${book.name}" class="modal-active-img">
              <div class="modal-zoom-lens" id="modalZoomLens"></div>
              
              <!-- Floating Fullscreen Icon -->
              <button class="modal-fullscreen-btn" onclick="event.stopPropagation(); openLightboxFromModal()" title="Fullscreen Zoom">🔍</button>

              <!-- Floating Badges -->
              ${book.badge ? `<span class="modal-img-badge">${book.badge}</span>` : ""}
              <span class="modal-img-counter" id="modalImgCounter">${activeModalImageIndex + 1} / ${images.length} Photos</span>

              <!-- Floating Wishlist Button -->
              <button class="modal-wish-btn ${isWished ? "wished" : ""}" 
                      onclick="toggleWishlist(${book.id}, event)" 
                      title="${isWished ? "Remove from wishlist" : "Add to wishlist"}">
                ${isWished ? "❤️" : "🤍"}
              </button>

              <!-- Left / Right Navigation Overlay Arrows -->
              ${
                images.length > 1
                  ? `
                <button class="gallery-nav-arrow prev" onclick="prevModalImage(event)" title="Previous photo (←)">‹</button>
                <button class="gallery-nav-arrow next" onclick="nextModalImage(event)" title="Next photo (→)">›</button>
              `
                  : ""
              }
            </div>

            <!-- Zoomed Magnified Flyout (Flipkart Style) -->
            <div class="modal-zoom-result" id="modalZoomResult"></div>
          </div>
        </div>

        <!-- Action Buttons Below Gallery (Flipkart Style) -->
        <div class="modal-action-buttons">
          <button class="btn-flipkart-cart" onclick="modalAddToCart(event)">
            🛒 ADD TO CART
          </button>
          <button class="btn-flipkart-buy" onclick="modalBuyNow()">
            ⚡ BUY NOW
          </button>
        </div>

        <!-- Interactive Look Inside Sample Reader Button -->
        <button class="btn-flipkart-look-inside" onclick="openSampleReader(${book.id})">
          📖 Look Inside &amp; Read Sample Pages (4 Pages)
        </button>

        <div class="modal-guarantee-bar">
          <div class="guarantee-item">🛡️ 100% Genuine Certified Edition</div>
          <div class="guarantee-item">⚡ 24-Hour Campus Express Delivery</div>
          <div class="guarantee-item">🔄 7-Day Easy Return &amp; Exchange</div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Book Details & Academic Information -->
      <div class="modal-info-column">
        
        <!-- Breadcrumbs -->
        <div class="modal-breadcrumbs">
          <span>Home</span> &gt; <span>Textbooks</span> &gt; <span>Engineering</span> &gt; <span class="active-crumb">${book.category}</span>
        </div>

        <h1 class="modal-book-title">${book.name}</h1>
        <p class="modal-book-author">By <span class="author-name">${book.author || "Standard Edition"}</span> | Recommended Academic Edition</p>

        <!-- Rating Pill -->
        <div class="modal-rating-row">
          <span class="modal-rating-badge">★ ${book.rating || "4.8"}</span>
          <span class="modal-review-summary">${book.reviews || 140} Ratings &amp; ${Math.round((book.reviews || 140) * 0.4)} Reviews</span>
          <span class="modal-assured-badge">🎓 Student Verified</span>
        </div>

        <!-- Pricing Section (Flipkart Style) -->
        <div class="modal-price-box">
          <div class="modal-prices">
            <span class="modal-current-price">₹${book.price}</span>
            ${book.originalPrice ? `<span class="modal-orig-price">₹${book.originalPrice}</span>` : ""}
            ${discountPct > 0 ? `<span class="modal-discount-percent">${discountPct}% off</span>` : ""}
          </div>
          ${
            savedAmount > 0
              ? `
            <div class="modal-savings-tag">
              🎉 Student Savings: You save ₹${savedAmount} (${discountPct}% discount on MRP)
            </div>
          `
              : ""
          }
        </div>

        <!-- Available Offers -->
        <div class="modal-offers-section">
          <h4 class="offers-title">🏷️ Available Offers &amp; Student Benefits</h4>
          <div class="offer-row">
            <span class="offer-tag">Special Price</span>
            <span>Get extra 10% student discount automatically calculated at checkout!</span>
          </div>
          <div class="offer-row">
            <span class="offer-tag">Campus Bank Offer</span>
            <span>5% Instant Cashback on UPI payments, Google Pay, PhonePe &amp; Paytm.</span>
          </div>
          <div class="offer-row">
            <span class="offer-tag">Free Shipping</span>
            <span>FREE Express Delivery to all college hostels and campus departments.</span>
          </div>
        </div>

        <!-- Campus Delivery Check Simulator -->
        <div class="modal-delivery-box">
          <div class="delivery-header">
            <span>📍 Check Campus Delivery Date:</span>
          </div>
          <div class="delivery-input-group">
            <input type="text" id="pincodeInput" placeholder="Enter 6-digit Pincode (e.g. 400001)" maxlength="6" onkeypress="if(event.key==='Enter') checkPincodeDelivery()">
            <button class="btn-check-pin" onclick="checkPincodeDelivery()">Check</button>
          </div>
          <div id="pincodeResult" class="pincode-result"></div>
        </div>

        <!-- Key Highlights -->
        <div class="modal-highlights-box">
          <h4 class="section-subtitle">📌 Key Academic Highlights</h4>
          <ul class="highlights-list">
            ${highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>

        <!-- Specifications Table -->
        <div class="modal-specs-box">
          <h4 class="section-subtitle">📋 Book Specifications</h4>
          <table class="specs-table">
            <tbody>
              <tr>
                <td class="spec-label">Title</td>
                <td class="spec-value">${book.name}</td>
              </tr>
              <tr>
                <td class="spec-label">Author / Editor</td>
                <td class="spec-value">${book.author || "Standard Edition"}</td>
              </tr>
              <tr>
                <td class="spec-label">Publisher</td>
                <td class="spec-value">${specs.publisher}</td>
              </tr>
              <tr>
                <td class="spec-label">Edition</td>
                <td class="spec-value">${specs.edition}</td>
              </tr>
              <tr>
                <td class="spec-label">Language</td>
                <td class="spec-value">${specs.language}</td>
              </tr>
              <tr>
                <td class="spec-label">Total Pages</td>
                <td class="spec-value">${specs.pages}</td>
              </tr>
              <tr>
                <td class="spec-label">ISBN-13</td>
                <td class="spec-value">${specs.isbn}</td>
              </tr>
              <tr>
                <td class="spec-label">Binding Format</td>
                <td class="spec-value">${specs.format}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Description -->
        <div class="modal-desc-box">
          <h4 class="section-subtitle">📖 Description &amp; Syllabus Overview</h4>
          <p class="modal-description-text">${book.description}</p>
        </div>

        <!-- Student Reviews -->
        <div class="modal-reviews-box">
          <h4 class="section-subtitle">⭐ Student Ratings &amp; Reviews</h4>
          <div class="reviews-container">
            ${reviewsList
              .map(
                (rev) => `
              <div class="student-review-card">
                <div class="rev-header">
                  <span class="rev-user">👤 ${rev.user}</span>
                  <span class="rev-stars">★ ${rev.rating}</span>
                </div>
                <p class="rev-comment">"${rev.comment}"</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

      </div>

    </div>
  `;
}

function switchModalImage(index) {
  if (!activeModalBook) return;
  const images =
    activeModalBook.images && activeModalBook.images.length > 0
      ? activeModalBook.images
      : [{ url: activeModalBook.img, label: "Cover" }];

  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;

  activeModalImageIndex = index;

  const activeImgEl = document.getElementById("modalActiveImage");
  const counterEl = document.getElementById("modalImgCounter");
  const thumbItems = document.querySelectorAll(".modal-thumb-item");

  if (activeImgEl) {
    activeImgEl.style.opacity = "0.4";
    activeImgEl.src = images[index].url;
    setTimeout(() => {
      activeImgEl.style.opacity = "1";
    }, 120);
  }

  if (counterEl) {
    counterEl.innerText = `${index + 1} / ${images.length} Photos`;
  }

  thumbItems.forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === index);
  });

  setupImageZoom();
}

function prevModalImage(event) {
  if (event) event.stopPropagation();
  switchModalImage(activeModalImageIndex - 1);
}

function nextModalImage(event) {
  if (event) event.stopPropagation();
  switchModalImage(activeModalImageIndex + 1);
}

// Flipkart Magnifier Zoom on Main Image
function setupImageZoom() {
  const container = document.getElementById("modalMainImgWrap");
  const img = document.getElementById("modalActiveImage");
  const lens = document.getElementById("modalZoomLens");
  const result = document.getElementById("modalZoomResult");

  if (!container || !img || !lens || !result) return;

  result.style.backgroundImage = `url('${img.src}')`;

  container.onmouseenter = () => {
    result.style.backgroundImage = `url('${img.src}')`;
    lens.style.display = "block";
    result.style.display = "block";
  };

  container.onmouseleave = () => {
    lens.style.display = "none";
    result.style.display = "none";
  };

  container.onmousemove = (e) => {
    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left - lens.offsetWidth / 2;
    let y = e.clientY - rect.top - lens.offsetHeight / 2;

    const maxX = container.offsetWidth - lens.offsetWidth;
    const maxY = container.offsetHeight - lens.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;

    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    result.style.backgroundSize = `${container.offsetWidth * cx}px ${container.offsetHeight * cy}px`;
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
  };
}

function closeBookModal() {
  const modal = document.getElementById("bookDetailModal");
  if (modal) {
    modal.classList.remove("active");
  }
  document.body.style.overflow = "";
}

function handleBookModalBackdrop(event) {
  if (event.target && event.target.id === "bookDetailModal") {
    closeBookModal();
  }
}

function modalAddToCart(event) {
  if (!activeModalBook) return;
  addToCart(activeModalBook.id, event);
}

function modalBuyNow() {
  if (!activeModalBook) return;

  const existing = cart.find((item) => item.id === activeModalBook.id);
  if (!existing) {
    cart.push({
      id: activeModalBook.id,
      name: activeModalBook.name,
      author: activeModalBook.author,
      price: activeModalBook.price,
      originalPrice: activeModalBook.originalPrice,
      img: activeModalBook.img,
      category: activeModalBook.category,
      qty: 1
    });
    saveCart();
    updateCounters();
  }

  closeBookModal();
  showSection("cart");
  showToast(
    `Proceeding to checkout for "${activeModalBook.name.substring(0, 20)}..." 🚀`,
    "success"
  );
}

function checkPincodeDelivery() {
  const input = document.getElementById("pincodeInput");
  const resultDiv = document.getElementById("pincodeResult");
  if (!input || !resultDiv) return;

  const pin = input.value.trim();
  if (!/^\d{6}$/.test(pin)) {
    resultDiv.innerHTML = `<span style="color: var(--danger); font-size: 0.88rem;">⚠️ Please enter a valid 6-digit postal code.</span>`;
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  resultDiv.innerHTML = `
    <div style="color: var(--success); font-weight: 600; font-size: 0.9rem; margin-top: 6px; animation: fadeIn 0.3s ease;">
      ✅ Express Campus Delivery by <strong>${dateStr}, 4:00 PM</strong> to PIN <strong>${pin}</strong> | <span style="color: var(--primary);">FREE Shipping</span>
    </div>
  `;
}

// ==========================================================
// Interactive "Look Inside" Sample Page Reader Modal
// ==========================================================

function openSampleReader(bookId) {
  const book =
    allBooks.find((b) => b.id === bookId) || defaultBooks.find((b) => b.id === bookId);
  if (!book) return;

  activeReaderBook = book;
  activeReaderPageIndex = 0;

  const modal = document.getElementById("sampleReaderModal");
  const titleEl = document.getElementById("readerBookTitle");
  if (!modal || !titleEl) return;

  titleEl.innerText = book.name;
  renderSampleReaderPage();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSampleReader() {
  const modal = document.getElementById("sampleReaderModal");
  if (modal) modal.classList.remove("active");
  if (!document.getElementById("bookDetailModal").classList.contains("active")) {
    document.body.style.overflow = "";
  }
}

function handleReaderModalBackdrop(event) {
  if (event.target && event.target.id === "sampleReaderModal") {
    closeSampleReader();
  }
}

function renderSampleReaderPage() {
  if (!activeReaderBook) return;

  const readerBody = document.getElementById("readerModalBody");
  const pageIndicator = document.getElementById("readerPageIndicator");
  const prevBtn = document.getElementById("readerPrevBtn");
  const nextBtn = document.getElementById("readerNextBtn");
  const thumbsNav = document.getElementById("readerThumbsNav");

  const images = activeReaderBook.images || [];
  // Sample reader pages: 0: Front Cover, 2: Table of Contents, 3: Sample 1, 4: Sample 2
  const readerPages = [
    { title: "Front Cover", img: images[0]?.url || activeReaderBook.img },
    { title: "Table of Contents", img: images[2]?.url || images[0]?.url },
    { title: "Sample Chapter Excerpt", img: images[3]?.url || images[0]?.url },
    { title: "Solved Practice Problems", img: images[4]?.url || images[0]?.url }
  ];

  const totalPages = readerPages.length;
  if (activeReaderPageIndex < 0) activeReaderPageIndex = 0;
  if (activeReaderPageIndex >= totalPages) activeReaderPageIndex = totalPages - 1;

  const currentPage = readerPages[activeReaderPageIndex];

  if (pageIndicator) {
    pageIndicator.innerText = `Page ${activeReaderPageIndex + 1} of ${totalPages} • ${currentPage.title}`;
  }

  if (prevBtn) prevBtn.disabled = activeReaderPageIndex === 0;
  if (nextBtn) nextBtn.disabled = activeReaderPageIndex === totalPages - 1;

  if (readerBody) {
    readerBody.innerHTML = `
      <div class="reader-page-frame">
        <img class="reader-page-img" src="${currentPage.img}" alt="${currentPage.title}">
      </div>
    `;
  }

  if (thumbsNav) {
    thumbsNav.innerHTML = readerPages
      .map(
        (_, idx) => `
      <div class="reader-nav-dot ${idx === activeReaderPageIndex ? "active" : ""}" 
           onclick="goToSamplePage(${idx})" 
           title="Go to Page ${idx + 1}"></div>
    `
      )
      .join("");
  }
}

function prevSamplePage() {
  if (activeReaderPageIndex > 0) {
    activeReaderPageIndex--;
    renderSampleReaderPage();
  }
}

function nextSamplePage() {
  const images = activeReaderBook?.images || [];
  if (activeReaderPageIndex < 3) {
    activeReaderPageIndex++;
    renderSampleReaderPage();
  }
}

function goToSamplePage(index) {
  activeReaderPageIndex = index;
  renderSampleReaderPage();
}

// ==========================================================
// Fullscreen Image Lightbox Viewer
// ==========================================================

function openLightboxFromModal() {
  if (!activeModalBook) return;
  const images = activeModalBook.images || [{ url: activeModalBook.img, label: "Book Cover" }];
  openLightbox(images, activeModalImageIndex);
}

function openLightbox(imagesList, startIndex = 0) {
  activeLightboxImages = imagesList;
  activeLightboxIndex = startIndex;

  const modal = document.getElementById("imageLightboxModal");
  if (!modal) return;

  renderLightboxContent();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function renderLightboxContent() {
  const imgEl = document.getElementById("lightboxImg");
  const captionEl = document.getElementById("lightboxCaption");
  if (!imgEl || activeLightboxImages.length === 0) return;

  const current = activeLightboxImages[activeLightboxIndex] || activeLightboxImages[0];
  imgEl.src = current.url;

  if (captionEl) {
    captionEl.innerText = `${current.label || `Photo ${activeLightboxIndex + 1}`} (${activeLightboxIndex + 1} / ${activeLightboxImages.length})`;
  }
}

function closeLightbox() {
  const modal = document.getElementById("imageLightboxModal");
  if (modal) modal.classList.remove("active");
  if (
    !document.getElementById("bookDetailModal").classList.contains("active") &&
    !document.getElementById("sampleReaderModal").classList.contains("active")
  ) {
    document.body.style.overflow = "";
  }
}

function handleLightboxBackdrop(event) {
  if (event.target && event.target.id === "imageLightboxModal") {
    closeLightbox();
  }
}

function lightboxPrev(event) {
  if (event) event.stopPropagation();
  if (activeLightboxImages.length === 0) return;
  activeLightboxIndex =
    (activeLightboxIndex - 1 + activeLightboxImages.length) % activeLightboxImages.length;
  renderLightboxContent();
}

function lightboxNext(event) {
  if (event) event.stopPropagation();
  if (activeLightboxImages.length === 0) return;
  activeLightboxIndex = (activeLightboxIndex + 1) % activeLightboxImages.length;
  renderLightboxContent();
}

// Keyboard Navigation for All Modals
function initModalKeyboard() {
  window.addEventListener("keydown", (e) => {
    // 1. Lightbox
    const lightbox = document.getElementById("imageLightboxModal");
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") lightboxPrev();
      else if (e.key === "ArrowRight") lightboxNext();
      return;
    }

    // 2. Sample Reader
    const reader = document.getElementById("sampleReaderModal");
    if (reader && reader.classList.contains("active")) {
      if (e.key === "Escape") closeSampleReader();
      else if (e.key === "ArrowLeft") prevSamplePage();
      else if (e.key === "ArrowRight") nextSamplePage();
      return;
    }

    // 3. Flipkart Detail Modal
    const modal = document.getElementById("bookDetailModal");
    if (modal && modal.classList.contains("active")) {
      if (e.key === "Escape") closeBookModal();
      else if (e.key === "ArrowLeft") prevModalImage();
      else if (e.key === "ArrowRight") nextModalImage();
    }
  });
}