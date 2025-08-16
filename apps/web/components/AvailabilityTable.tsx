"use client";
import { useState } from "react";
export function AvailabilityTable({
  slots,
}: {
  slots: { id: number; start_at: string; end_at: string; status: string }[];
}) {
  const [loading, setLoading] = useState<number | null>(null);
  const book = async (slotId: number) => {
    setLoading(slotId);
    const r = await fetch("/api/bookings/hold", {
      method: "POST",
      body: JSON.stringify({ slot_id: slotId }),
    });
    const j = await r.json();
    alert(j.ok ? "Hold สลอตแล้ว ไปยืนยันใน My bookings" : j.error);
    setLoading(null);
  };
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left">เวลา</th>
          <th>สถานะ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {slots.map((s) => (
          <tr key={s.id} className="border-b">
            <td>{new Date(s.start_at).toLocaleString("th-TH")}</td>
            <td>{s.status}</td>
            <td className="text-right">
              {s.status === "OPEN" && (
                <button
                  onClick={() => book(s.id)}
                  className="px-3 py-1.5 rounded-lg bg-black text-white"
                  disabled={loading === s.id}
                >
                  {loading === s.id ? "กำลังจอง..." : "จอง"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
