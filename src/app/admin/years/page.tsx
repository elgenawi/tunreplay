import LookupManager from "../LookupManager";

export default function AdminYearsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Years</h1>
      <LookupManager table="years" title="Manage Years" hasSlug={false} />
    </div>
  );
}
