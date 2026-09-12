const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the project directory
app.use(express.static(path.join(__dirname)));

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
  
  words.forEach(w => {
    if ((current + " " + w).trim().length > 20) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  });
  if (current) lines.push(current.trim());

  return lines.slice(0, 3).map((line, idx) => `
    <text x="${x}" y="${y + idx * 30}" fill="#ffffff" font-size="24" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" letter-spacing="-0.5">${escapeXml(line)}</text>
  `).join("");
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

// Hydrate all books with realistic SVGs
const books = rawBooks.map(b => hydrateBook(b));

// In-memory Users store
const users = [
  { username: "student", password: "password123", name: "Student User", role: "student" },
  { username: "daneshwar", password: "123", name: "Daneshwar Munde", role: "admin" }
];

// --- HTML Pages Routes ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// --- API Routes ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), message: "Server is running smoothly 🚀" });
});

// 2. Get All Books with optional search & filter
app.get("/api/books", (req, res) => {
  const { category, search } = req.query;
  let results = [...books];

  if (category && category !== "all") {
    results = results.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.author && b.author.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 3. Get Single Book by ID
app.get("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  res.json({ success: true, data: book });
});

// 4. User Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Please provide username and password" });
  }

  const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  }

  res.json({
    success: true,
    message: "Login successful!",
    user: {
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// 5. User Registration
app.post("/api/register", (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  const existing = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: "Username already exists" });
  }

  const newUser = {
    username: username.trim(),
    password: password,
    name: name || username.trim(),
    role: "student"
  };
  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "Account created successfully!",
    user: {
      username: newUser.username,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// 6. Place Order
app.post("/api/orders", (req, res) => {
  const { items, totalAmount, user } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const order = {
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    items,
    totalAmount,
    user: user || "Guest",
    orderDate: new Date().toISOString(),
    status: "Confirmed"
  };

  res.status(201).json({
    success: true,
    message: "Order placed successfully! 🎉",
    order
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("==========================================");
  console.log(`🚀 Student Book Store Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔑 Login Page: http://localhost:${PORT}/login`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log("==========================================");
});