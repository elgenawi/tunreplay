import LookupManager from "../LookupManager";

export default function AdminTypesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Types</h1>
      <LookupManager table="types" title="Manage Types" />
    </div>
  );
}
