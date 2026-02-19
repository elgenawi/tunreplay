"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import ImageUploader from "../ImageUploader";

interface SeriesItem { id: number; title: string }
interface EpisodeItem {
  id: number;
  series_id: number;
  episode_number: number;
  title: string;
  slug: string;
  image: string | null;
  embed_url: string | null;
  description: string | null;
  season: number;
  series_title: string | null;
}

const emptyForm = {
  series_id: "",
  episode_number: "1",
  title: "",
  slug: "",
  image: "",
  embed_url: "",
  description: "",
  season: "1",
};

export default function AdminEpisodesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const presetSeriesId = searchParams.get("series_id") || "";

  const [items, setItems] = useState<EpisodeItem[]>([]);
  const [allSeries, setAllSeries] = useState<SeriesItem[]>([]);
  const [filterSeriesId, setFilterSeriesId] = useState(presetSeriesId);
  const [form, setForm] = useState({ ...emptyForm, series_id: presetSeriesId });
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slugLoading, setSlugLoading] = useState(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSlug = (title: string) => {
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(async () => {
      if (!title.trim()) {
        setForm(f => ({ ...f, slug: "" }));
        return;
      }
      setSlugLoading(true);
      try {
        const params = new URLSearchParams({ title });
        if (editId) params.set("excludeId", String(editId));
        const res = await fetch(`/api/admin/episodes/check-slug?${params}`);
        const data = await res.json();
        setForm(f => ({ ...f, slug: data.slug }));
      } finally {
        setSlugLoading(false);
      }
    }, 400);
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({ ...f, title: val }));
    generateSlug(val);
  };

  const load = async () => {
    const seriesRes = fetch("/api/admin/series").then(r => r.json());
    const epsUrl = filterSeriesId
      ? `/api/admin/episodes?series_id=${filterSeriesId}`
      : "/api/admin/episodes";
    const epsRes = fetch(epsUrl).then(r => r.json());

    const [s, e] = await Promise.all([seriesRes, epsRes]);
    setAllSeries(s.data || []);
    setItems(e.data || []);
  };

  useEffect(() => { load(); }, [filterSeriesId]);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.series_id) return;
    setLoading(true);

    const payload: Record<string, unknown> = {
      ...form,
      series_id: Number(form.series_id),
      episode_number: Number(form.episode_number) || 1,
      season: Number(form.season) || 1,
    };
    if (editId) payload.id = editId;

    await fetch("/api/admin/episodes", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ ...emptyForm, series_id: filterSeriesId || presetSeriesId });
    setEditId(null);
    setShowForm(false);
    setLoading(false);
    load();
  };

  const handleEdit = (item: EpisodeItem) => {
    setEditId(item.id);
    setForm({
      series_id: item.series_id.toString(),
      episode_number: item.episode_number.toString(),
      title: item.title,
      slug: item.slug,
      image: item.image || "",
      embed_url: item.embed_url || "",
      description: item.description || "",
      season: item.season.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this episode?")) return;
    await fetch(`/api/admin/episodes?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleCancel = () => {
    setForm({ ...emptyForm, series_id: filterSeriesId || presetSeriesId });
    setEditId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setForm({ ...emptyForm, series_id: filterSeriesId || presetSeriesId });
    setShowForm(true);
  };

  const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {presetSeriesId && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/admin/series")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">Episodes</h1>
        </div>
        {!showForm && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Episode
          </Button>
        )}
      </div>

      {!presetSeriesId && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Filter by series:</label>
          <select
            className={selectClass + " w-64"}
            value={filterSeriesId}
            onChange={e => setFilterSeriesId(e.target.value)}
          >
            <option value="">All series</option>
            {allSeries.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      )}

      {presetSeriesId && allSeries.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Managing episodes for: <span className="font-medium text-foreground">{allSeries.find(s => s.id === Number(presetSeriesId))?.title}</span>
        </p>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Episode" : "Add Episode"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Series *</label>
                  <select
                    className={selectClass + " w-full"}
                    value={form.series_id}
                    onChange={e => set("series_id", e.target.value)}
                    disabled={!!presetSeriesId}
                  >
                    <option value="">-- Select Series --</option>
                    {allSeries.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Season</label>
                    <Input type="number" value={form.season} onChange={e => set("season", e.target.value)} min={1} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Episode #</label>
                    <Input type="number" value={form.episode_number} onChange={e => set("episode_number", e.target.value)} min={1} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Title *</label>
                  <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Episode title" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Slug * {slugLoading && <span className="text-primary">(checking...)</span>}
                  </label>
                  <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-generated" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Image</label>
                  <ImageUploader value={form.image} onChange={(url) => set("image", url)} folder="episodes" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground">Video Embed URL</label>
                  <Input value={form.embed_url} onChange={e => set("embed_url", e.target.value)} placeholder="https://... or <iframe ...>" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    value={form.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="Optional episode description..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {editId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left w-14">Preview</th>
                  <th className="px-3 py-2 text-left">ID</th>
                  {!presetSeriesId && <th className="px-3 py-2 text-left">Series</th>}
                  <th className="px-3 py-2 text-left">S</th>
                  <th className="px-3 py-2 text-left">Ep</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Embed</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-10 h-14 object-cover rounded border border-border bg-muted" />
                      ) : (
                        <div className="w-10 h-14 rounded border border-dashed border-muted-foreground/30 bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">{item.id}</td>
                    {!presetSeriesId && (
                      <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">{item.series_title || "—"}</td>
                    )}
                    <td className="px-3 py-2 text-muted-foreground">{item.season}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.episode_number}</td>
                    <td className="px-3 py-2 font-medium max-w-[200px] truncate">{item.title}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {item.embed_url ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400">Yes</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={presetSeriesId ? 7 : 8} className="px-3 py-8 text-center text-muted-foreground">
                      No episodes yet. Click &quot;Add Episode&quot; to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
