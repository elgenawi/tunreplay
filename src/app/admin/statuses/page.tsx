import LookupManager from "../LookupManager";

export default function AdminStatusesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Statuses</h1>
      <LookupManager table="statuses" title="Manage Statuses" />
    </div>
  );
}
