import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin - TUNREPLAY",
  description: "Admin panel",
};

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div dir="ltr" className="min-h-screen bg-background text-foreground dark">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
