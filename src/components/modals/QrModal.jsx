import { Copy, Download, QrCode, X } from "lucide-react";
import SecondaryButton from "../common/SecondaryButton";

export default function QrModal({ survey, onClose }) {
  if (!survey) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 sp-rise" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="sp-display font-semibold text-slate-900">Scan to respond</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <QrCode size={88} className="text-slate-700" strokeWidth={1.2} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="sp-mono truncate text-sm text-slate-700">{survey.endpoint}</span>
          <button className="text-slate-400 hover:text-indigo-600"><Copy size={15} /></button>
        </div>
        <SecondaryButton icon={Download} className="mt-4 w-full">Download QR Code</SecondaryButton>
      </div>
    </div>
  );
}