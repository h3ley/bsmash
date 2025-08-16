// ตัวอย่าง server component layout (ถ้าคุณอยากใส่): apps/web/app/owner/layout.tsx
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <main className="p-4">ต้องเข้าสู่ระบบก่อน</main>;
  // TODO: โหลด profiles แล้วเช็ก role === 'OWNER'
  return <>{children}</>;
}
