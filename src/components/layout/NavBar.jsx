import Logo from "../common/Logo";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
];

export default function NavBar({ go, transparent }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`sticky top-0 z-30 border-b ${
        transparent
          ? "border-slate-100 bg-white/80 backdrop-blur"
          : "border-slate-100 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button onClick={() => go("landing")}>
          <Logo />
        </button>

        {/* Center nav links — landing page only */}
        {transparent && (
          <div className="hidden items-center gap-7 sm:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {/* Right CTAs */}
        <div className="hidden items-center gap-3 sm:flex">
          <SecondaryButton onClick={() => go("login")}>Sign in</SecondaryButton>
          <PrimaryButton onClick={() => go("register")} icon={ArrowRight}>
            Start Free Trial
          </PrimaryButton>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? (
            <X size={22} className="text-slate-700" />
          ) : (
            <Menu size={22} className="text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-4 sm:hidden">
          {transparent &&
            NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {label}
              </a>
            ))}
          <div className={`${transparent ? "mt-2" : ""} flex flex-col gap-2`}>
            <SecondaryButton
              onClick={() => {
                go("login");
                setOpen(false);
              }}
              className="w-full justify-center"
            >
              Sign in
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                go("register");
                setOpen(false);
              }}
              icon={ArrowRight}
              className="w-full justify-center"
            >
              Start Free Trial
            </PrimaryButton>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
