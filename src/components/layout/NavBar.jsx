import Logo from "../common/Logo";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";
import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

export default function NavBar({ go, transparent }) {
  const [open, setOpen] = useState(false);
  return (
    <nav
      className={`sticky top-0 z-30 border-b ${transparent ? "border-slate-100 bg-white/80 backdrop-blur" : "border-slate-100 bg-white"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => go("landing")}>
          <Logo />
        </button>
        <div className="hidden items-center gap-3 sm:flex">
          <SecondaryButton onClick={() => go("login")}>Sign in</SecondaryButton>
          <PrimaryButton onClick={() => go("register")} icon={ArrowRight}>
            Start Free Trial
          </PrimaryButton>
        </div>
        <button className="sm:hidden" onClick={() => setOpen((o) => !o)}>
          <Menu size={22} className="text-slate-700" />
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-3 sm:hidden">
          <SecondaryButton onClick={() => go("login")}>Sign in</SecondaryButton>
          <PrimaryButton onClick={() => go("register")} icon={ArrowRight}>
            Start Free Trial
          </PrimaryButton>
        </div>
      ) : null}
    </nav>
  );
}
