import Logo from "../common/Logo";

const FOOTER_LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal:   ["Privacy", "Terms", "Security", "Cookies"],
};

export default function FooterBar() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              AI-powered sentiment intelligence for teams who move fast and
              listen closely.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-slate-200 px-2.5 py-1">
                SOC 2 in progress
              </span>
              <span className="rounded-full border border-slate-200 px-2.5 py-1">
                GDPR-ready
              </span>
              <span className="rounded-full border border-slate-200 px-2.5 py-1">
                99.9% uptime SLA
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {category}
              </p>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-slate-500 transition-colors hover:text-slate-900">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © 2026 SentimentPulse, Inc. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">Built for teams who listen.</p>
        </div>
      </div>
    </footer>
  );
}
