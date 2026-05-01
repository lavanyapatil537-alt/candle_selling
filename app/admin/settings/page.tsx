"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const BRAND_KEYS = ["store_name", "brand_tagline", "primary_color"];
const SOCIAL_KEYS = ["whatsapp_number", "instagram_url", "facebook_url", "support_email"];

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ text: "Passwords do not match.", ok: false }); return; }
    if (pwForm.next.length < 6) { setPwMsg({ text: "Password must be at least 6 characters.", ok: false }); return; }
    setPwSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: pwForm.current, next: pwForm.next }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (res.ok) { setPwMsg({ text: "Password updated successfully.", ok: true }); setPwForm({ current: "", next: "", confirm: "" }); }
    else setPwMsg({ text: data.error ?? "Failed to update password.", ok: false });
  };

  const inputClass = "w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white";
  const labelClass = "block text-[10px] tracking-widest text-lexi-muted mb-2";

  const Field = ({ k, label, placeholder }: { k: string; label: string; placeholder?: string }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input className={inputClass} value={settings[k] ?? ""} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} placeholder={placeholder} />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-medium text-lexi-dark mb-1">General Settings</h1>
      <p className="text-xs text-lexi-muted mb-8">Manage your brand presence and administrative credentials.</p>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Brand Identity */}
          <div className="bg-white border border-lexi-border p-6 space-y-5">
            <h2 className="text-sm font-medium text-lexi-dark">Brand Identity</h2>
            <Field k="store_name" label="STORE NAME" placeholder="LEXI CANDLES" />
            <Field k="brand_tagline" label="TAGLINE" placeholder="Artisanal Fragrance Handcrafted for Serenity" />
            <div>
              <label className={labelClass}>PRIMARY THEME COLOR</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings["primary_color"] ?? "#B8860B"} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-10 h-10 border border-lexi-border cursor-pointer rounded" />
                <input className="flex-1 border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white" value={settings["primary_color"] ?? "#B8860B"} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} placeholder="#B8860B" />
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="bg-white border border-lexi-border p-6 space-y-5">
            <h2 className="text-sm font-medium text-lexi-dark">Contact & Social</h2>
            <Field k="whatsapp_number" label="WHATSAPP BUSINESS" placeholder="+44 20 7946 0123" />
            <Field k="instagram_url" label="INSTAGRAM HANDLE" placeholder="@lexicandles" />
            <Field k="facebook_url" label="FACEBOOK PAGE" placeholder="facebook.com/lexicandles" />
            <Field k="support_email" label="SUPPORT EMAIL" placeholder="hello@lexicandles.com" />
          </div>
        </div>

        {/* Admin Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-lexi-border p-6 space-y-5">
            <h2 className="text-sm font-medium text-lexi-dark">Admin Account</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ACCOUNT EMAIL</label>
                <p className="text-sm text-lexi-dark py-3 px-4 border border-lexi-border bg-lexi-cream">{session?.user?.email ?? "—"}</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-[10px] tracking-widest text-lexi-muted">CHANGE PASSWORD</h3>
              <div>
                <label className={labelClass}>CURRENT PASSWORD</label>
                <input type="password" className={inputClass} value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} required />
              </div>
              <div>
                <label className={labelClass}>NEW PASSWORD</label>
                <input type="password" className={inputClass} value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} required />
              </div>
              <div>
                <label className={labelClass}>CONFIRM NEW PASSWORD</label>
                <input type="password" className={inputClass} value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} required />
              </div>
              {pwMsg.text && <p className={`text-xs ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>{pwMsg.text}</p>}
              <button type="submit" disabled={pwSaving} className="btn-gold px-6 py-2.5 text-xs disabled:opacity-50">
                {pwSaving ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 p-6">
            <h2 className="text-sm font-medium text-red-600 mb-1">Danger Zone</h2>
            <p className="text-xs text-lexi-muted mb-6">Actions in this section are permanent and cannot be undone. Please proceed with caution.</p>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-lexi-border">
                <div>
                  <p className="text-xs font-medium text-lexi-dark">CLEAR CACHE</p>
                  <p className="text-xs text-lexi-muted mt-1">Purge all local images and data stores.</p>
                </div>
                <button type="button" onClick={() => alert("Cache cleared.")} className="flex-shrink-0 px-4 py-2 text-xs border border-lexi-border text-lexi-muted hover:border-red-300 hover:text-red-500 transition-colors">
                  CLEAR DATA
                </button>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-lexi-dark">RESET ACCOUNT</p>
                  <p className="text-xs text-lexi-muted mt-1">Reset all brand settings to factory defaults.</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Reset all settings? This cannot be undone.")) return;
                    await fetch("/api/settings", { method: "DELETE" });
                    const fresh = await fetch("/api/settings").then((r) => r.json());
                    setSettings(fresh);
                  }}
                  className="flex-shrink-0 px-4 py-2 text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  RESET NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-gold px-8 py-3 disabled:opacity-50">
            {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE SETTINGS"}
          </button>
          <button type="button" onClick={() => fetch("/api/settings").then((r) => r.json()).then(setSettings)} className="btn-outline px-8 py-3">
            DISCARD CHANGES
          </button>
        </div>
      </form>
    </div>
  );
}
