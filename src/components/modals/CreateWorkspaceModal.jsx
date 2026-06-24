import { useState } from "react";
import { Building2, X } from "lucide-react";
import TextField from "../common/TextField";
import PrimaryButton from "../common/PrimaryButton";

export default function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }
    onCreate({ name: name.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sp-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="sp-display font-semibold text-slate-900">Create workspace</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          Each workspace has its own surveys, team roles, and isolated response
          data.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <TextField
            label="Workspace name"
            icon={Building2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Corp — APAC"
            error={error}
          />
          <PrimaryButton type="submit" className="w-full justify-center">
            Create workspace
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
