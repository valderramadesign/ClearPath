"use client";

import { useEffect } from "react";

import { PAYPAL_PAY_IN_4_TPV_INCREASE, SITE } from "@/lib/content";

const jb = "var(--font-jetbrains-mono)";

const rule = {
  borderTop: "1px solid #000",
  marginBottom: 10,
  marginTop: 2,
};

function Section({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 4 }}>
        {label}
      </div>
      <div style={rule} />
    </div>
  );
}

function Job({
  company,
  title,
  type,
  dates,
  bullets,
}: {
  company: string;
  title: string;
  type?: string;
  dates: string;
  bullets: string[];
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: "bold" }}>{company}</span>
        <span style={{ fontSize: 10, color: "#555" }}>{dates}</span>
      </div>
      <div style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>
        {title}{type ? ` · ${type}` : ""}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ fontSize: 10, lineHeight: "15px", marginBottom: 4, paddingLeft: 10, position: "relative" }}>
            <span style={{ position: "absolute", left: 0 }}>–</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResumePrintPage() {
  // The typeset PDF is the résumé that leaves the site, so ?print=1 — the old
  // "PRINT" target, still live in bookmarks and shared links — hands the visitor
  // that file instead of printing this page. Without the flag this stays the
  // readable web version the mobile footer links to.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") === "1") {
      window.location.replace(SITE.resumeFile);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#000", fontFamily: jb }}>
      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          /* The page margin supplies the frame in print; the on-screen padding
             would otherwise push Education onto a second sheet. */
          .sheet { padding-top: 0 !important; padding-bottom: 0 !important; }
          .avoid-break { break-inside: avoid; }
        }
      `}</style>

      <div className="sheet" style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>{SITE.name}</div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>{SITE.resumeTitle}</div>
          <div style={{ fontSize: 10, color: "#444" }}>
            {SITE.email} &nbsp;·&nbsp; {SITE.phone} &nbsp;·&nbsp; {SITE.url.replace(/^https?:\/\//, "")} &nbsp;·&nbsp; {SITE.location} &nbsp;·&nbsp; {SITE.citizenship}
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, lineHeight: "15px", margin: 0 }}>
            {SITE.resumeSummaryLead} {SITE.resumeSummaryDetail}
          </p>
        </div>

        <div className="no-print" style={{ marginBottom: 20 }}>
          <a
            href={SITE.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontFamily: jb,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid #000",
              background: "transparent",
              color: "#000",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Print / Save as PDF
          </a>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: 20 }}>
          <Section label="Experience" />

          <Job
            company="Valderrama Design"
            title="Independent Product Designer"
            dates="Feb 2026 – Present"
            bullets={[
              "Designed, built, and shipped an AI-powered activity reporting app for Sunshine Little House of Learning, a preschool, from research through working code. It automates real-time parent updates and end-of-day summaries and returns about 500 staff hours a year.",
              "Independent practice focused on AI-assisted product design: strategy, interface design, prototyping, and design-to-code with Claude, ChatGPT, Figma AI, and Google Stitch.",
            ]}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <span style={{ fontSize: 10, color: "#444" }}>Medical leave — fully recovered</span>
            <span style={{ fontSize: 10, color: "#555" }}>Sep 2025 – Feb 2026</span>
          </div>

          <Job
            company="Meta FinTech"
            title="Staff Product Designer"
            type="Consultant"
            dates="Dec 2024 – Aug 2025"
            bullets={[
              "Led design strategy to cut checkout payment friction with credential sharing and autopay, using AI for research synthesis, product framing, and opportunity analysis. Grew incremental revenue 6.3% and stored-payment coverage 36%.",
              "Redesigned the Monthly Invoicing application for ad billing with AI- and automation-driven steps to move advertisers off credit cards. Lifted conversion from 39% to 97% and cut card fees about 7.5% a year.",
            ]}
          />

          <Job
            company="PayPal"
            title="Lead Product Designer"
            type="FTE"
            dates="Oct 2016 – Apr 2024"
            bullets={[
              "Most senior designer on the credit team. Owned end-to-end design for merchant and consumer credit products in the US, UK, and Germany, from application to checkout, funding, and loan servicing.",
              `Partnered with Checkout product, design, and engineering leads to place credit offers inside purchase flows. Simplified applications across six US and UK products, raising conversion from 51% to 79% and Pay in 4 monthly payment volume ${PAYPAL_PAY_IN_4_TPV_INCREASE}.`,
              "Led all installment products in credit-averse Germany and monetized offerings that had earned no revenue. Grew Pay in 30 Days monthly payment volume 49% and PayPal Ratenzahlung annual incremental revenue 25%.",
              "Mentored senior designers, unblocked stalled projects, and raised design quality through critique, shared patterns, and tighter product and engineering alignment.",
            ]}
          />

          <Job
            company="Cisco Systems"
            title="Senior UX Designer"
            type="Design Consultant"
            dates="Feb 2015 – Sep 2016"
            bullets={[
              "Led end-to-end design for Cisco's flagship mobile app. Modernized it to current accessibility and UI standards, raising user comprehension 43%.",
              "Co-built a scalable UI component library and UX standards for Cisco's intranet, and advised departments twice weekly in the Cisco UE Clinic.",
            ]}
          />
        </div>

        {/* Education */}
        <div className="avoid-break">
          <Section label="Education" />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              [
                "Nielsen Norman Group",
                "Master Certificate, Human Computer Interaction. Focus on AI-assisted design and product strategy for AI experiences",
              ],
              ["Academy of Art University", "Bachelor of Fine Arts, Graphic Design"],
              ["De La Salle University", "Bachelor of Arts and Science, Business Marketing"],
            ].map(([school, degree]) => (
              <div
                key={school}
                style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 10, lineHeight: "15px" }}
              >
                <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>{school}</span>
                <span style={{ color: "#555", textAlign: "right" }}>{degree}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
