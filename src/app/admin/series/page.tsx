"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, PlayCircle, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import ImageUploader from "../ImageUploader";

interface LookupItem { id: number; name: string }
interface SeriesItem {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  duration: string | null;
  source: string | null;
  episodes_number: number | null;
  season: number | null;
  trailer_embed_vid: string | null;
  type_id: number | null;
  nation_id: number | null;
  year_id: number | null;
  status_id: number | null;
  release_date: string | null;
  description: string | null;
  type_name: string | null;
  nation_name: string | null;
  year_name: string | null;
  status_name: string | null;
  pinned: number;
}

const emptyForm = {
  title: "", slug: "", image: "", duration: "", source: "",
  episodes_number: "", season: "", trailer_embed_vid: "",
  type_id: "", nation_id: "", year_id: "", status_id: "",
  release_date: "", description: "", genre_ids: [] as number[],
};

export default function AdminSeriesPage() {
  const [items, setItems] = useState<SeriesItem[]>([]);
  const [types, setTypes] = useState<LookupItem[]>([]);
  const [nations, setNations] = useState<LookupItem[]>([]);
  const [genres, setGenres] = useState<LookupItem[]>([]);
  const [years, setYears] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);
  const [form, setForm] = useState(emptyForm);
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
        const res = await fetch(`/api/admin/series/check-slug?${params}`);
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
    const [s, t, n, g, y, st] = await Promise.all([
      fetch("/api/admin/series").then(r => r.json()),
      fetch("/api/admin/lookup/types").then(r => r.json()),
      fetch("/api/admin/lookup/nations").then(r => r.json()),
      fetch("/api/admin/lookup/genres").then(r => r.json()),
      fetch("/api/admin/lookup/years").then(r => r.json()),
      fetch("/api/admin/lookup/statuses").then(r => r.json()),
    ]);
    setItems(s.data || []);
    setTypes(t.data || []);
    setNations(n.data || []);
    setGenres(g.data || []);
    setYears(y.data || []);
    setStatuses(st.data || []);
  };

  useEffect(() => { load(); }, []);

  const set = (key: string, val: string | number[]) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setLoading(true);

    const payload: Record<string, unknown> = {
      ...form,
      episodes_number: form.episodes_number ? Number(form.episodes_number) : null,
      season: form.season ? Number(form.season) : null,
      type_id: form.type_id ? Number(form.type_id) : null,
      nation_id: form.nation_id ? Number(form.nation_id) : null,
      year_id: form.year_id ? Number(form.year_id) : null,
      status_id: form.status_id ? Number(form.status_id) : null,
    };
    if (editId) payload.id = editId;

    await fetch("/api/admin/series", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setLoading(false);
    load();
  };

  const handleEdit = (item: SeriesItem) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      image: item.image || "",
      duration: item.duration || "",
      source: item.source || "",
      episodes_number: item.episodes_number?.toString() || "",
      season: item.season?.toString() || "",
      trailer_embed_vid: item.trailer_embed_vid || "",
      type_id: item.type_id?.toString() || "",
      nation_id: item.nation_id?.toString() || "",
      year_id: item.year_id?.toString() || "",
      status_id: item.status_id?.toString() || "",
      release_date: item.release_date || "",
      description: item.description || "",
      genre_ids: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this series?")) return;
    await fetch(`/api/admin/series?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const togglePin = async (item: SeriesItem) => {
    await fetch("/api/admin/series", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, pinned: item.pinned ? 0 : 1 }),
    });
    load();
  };

  const toggleGenre = (gid: number) => {
    setForm(f => ({
      ...f,
      genre_ids: f.genre_ids.includes(gid)
        ? f.genre_ids.filter(id => id !== gid)
        : [...f.genre_ids, gid],
    }));
  };

  const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Series</h1>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Series
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Series" : "Add Series"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Title *</label>
                  <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Title" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Slug * {slugLoading && <span className="text-primary">(checking...)</span>}
                  </label>
                  <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="auto-generated" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Image</label>
                  <ImageUploader value={form.image} onChange={(url) => set("image", url)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <Input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="45 min" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Source</label>
                  <Input value={form.source} onChange={e => set("source", e.target.value)} placeholder="Netflix, etc." />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Episodes Number</label>
                  <Input type="number" value={form.episodes_number} onChange={e => set("episodes_number", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Season</label>
                  <Input type="number" value={form.season} onChange={e => set("season", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Release Date</label>
                  <Input value={form.release_date} onChange={e => set("release_date", e.target.value)} placeholder="2025-01-01" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground">Trailer Embed</label>
                  <Input value={form.trailer_embed_vid} onChange={e => set("trailer_embed_vid", e.target.value)} placeholder="<iframe ...>" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    value={form.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="Series description or synopsis..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-xs text-muted-foreground">Type</label>
                  <select className={selectClass + " w-full"} value={form.type_id} onChange={e => set("type_id", e.target.value)}>
                    <option value="">-- Select --</option>
                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Nation</label>
                  <select className={selectClass + " w-full"} value={form.nation_id} onChange={e => set("nation_id", e.target.value)}>
                    <option value="">-- Select --</option>
                    {nations.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Year</label>
                  <select className={selectClass + " w-full"} value={form.year_id} onChange={e => set("year_id", e.target.value)}>
                    <option value="">-- Select --</option>
                    {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select className={selectClass + " w-full"} value={form.status_id} onChange={e => set("status_id", e.target.value)}>
                    <option value="">-- Select --</option>
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        form.genre_ids.includes(g.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border hover:bg-accent"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                  {genres.length === 0 && <span className="text-xs text-muted-foreground">No genres yet. Add some in Genres page first.</span>}
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
                  <th className="px-3 py-2 text-center w-10">Pin</th>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Nation</th>
                  <th className="px-3 py-2 text-left">Year</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Eps</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-14 object-cover rounded border border-border bg-muted"
                        />
                      ) : (
                        <div className="w-10 h-14 rounded border border-dashed border-muted-foreground/30 bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${item.pinned ? "text-primary" : "text-muted-foreground/40"}`}
                        onClick={() => togglePin(item)}
                        title={item.pinned ? "Unpin" : "Pin"}
                      >
                        {item.pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
                      </Button>
                    </td>
                    <td className="px-3 py-2">{item.id}</td>
                    <td className="px-3 py-2 font-medium max-w-[200px] truncate">{item.title}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.type_name || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.nation_name || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.year_name || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.status_name || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{item.episodes_number ?? "—"}</td>
                    <td className="px-3 py-2 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Manage Episodes">
                        <Link href={`/admin/episodes?series_id=${item.id}`}>
                          <PlayCircle className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
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
                    <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                      No series yet. Click &quot;Add Series&quot; to create one.
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
