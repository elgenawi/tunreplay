import LookupManager from "../LookupManager";

export default function AdminNationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Nations</h1>
      <LookupManager table="nations" title="Manage Nations" />
    </div>
  );
}
