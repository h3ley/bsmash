"use client";
import { useEffect, useState } from "react";

const ROLES = ["PLAYER", "ORGANIZER", "OWNER", "ADMIN"] as const;

type Profile = {
  user_id: string;
  display_name: string | null;
  role: (typeof ROLES)[number];
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const r = await fetch("/api/admin/roles");
    const j = await r.json();
    if (j.ok) setRows(j.profiles);
  };
  useEffect(() => {
    load();
  }, []);

  const updateRole = async (user_id: string, role: string) => {
    setLoading(true);
    const r = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id, role }),
    });
    const j = await r.json();
    setLoading(false);
    if (!j.ok) alert(j.error || "error");
    else load();
  };

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">จัดการบทบาทผู้ใช้</h1>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">ผู้ใช้</th>
            <th>บทบาท</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.user_id} className="border-b">
              <td>{p.display_name ?? p.user_id}</td>
              <td>
                <select
                  defaultValue={p.role}
                  onChange={(e) => updateRole(p.user_id, e.target.value)}
                  disabled={loading}
                  className="border rounded px-2 py-1"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
