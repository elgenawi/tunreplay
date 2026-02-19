import LookupManager from "../LookupManager";

export default function AdminGenresPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Genres</h1>
      <LookupManager table="genres" title="Manage Genres" />
    </div>
  );
}
