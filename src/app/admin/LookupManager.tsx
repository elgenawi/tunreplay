"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";

interface LookupItem {
  id: number;
  name: string;
  slug?: string;
}

interface LookupManagerProps {
  table: string;
  title: string;
  hasSlug?: boolean;
}

export default function LookupManager({ table, title, hasSlug = true }: LookupManagerProps) {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [slugLoading, setSlugLoading] = useState(false);
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSlug = (value: string) => {
    if (!hasSlug) return;
    if (slugTimer.current) clearTimeout(slugTimer.current);
    slugTimer.current = setTimeout(async () => {
      if (!value.trim()) {
        setSlug("");
        return;
      }
      setSlugLoading(true);
      try {
        const params = new URLSearchParams({ name: value });
        if (editId) params.set("excludeId", String(editId));
        const res = await fetch(`/api/admin/lookup/${table}/check-slug?${params}`);
        const data = await res.json();
        setSlug(data.slug ?? "");
      } finally {
        setSlugLoading(false);
      }
    }, 400);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    generateSlug(value);
  };

  const load = async () => {
    const res = await fetch(`/api/admin/lookup/${table}`);
    const data = await res.json();
    setItems(data.data || []);
  };

  useEffect(() => { load(); }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const payload: Record<string, unknown> = { name: name.trim() };
    if (hasSlug) payload.slug = slug.trim();
    if (editId) payload.id = editId;

    await fetch(`/api/admin/lookup/${table}`, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setName("");
    setSlug("");
    setEditId(null);
    setLoading(false);
    load();
  };

  const handleEdit = (item: LookupItem) => {
    setEditId(item.id);
    setName(item.name);
    setSlug(item.slug || "");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/lookup/${table}?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setSlug("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end flex-wrap">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-48"
          />
          {hasSlug && (
            <Input
              placeholder={slugLoading ? "..." : "Slug (auto)"}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-48"
            />
          )}
          <Button type="submit" size="sm" disabled={loading}>
            <Plus className="h-4 w-4 mr-1" />
            {editId ? "Update" : "Add"}
          </Button>
          {editId && (
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </form>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                {hasSlug && <th className="px-3 py-2 text-left">Slug</th>}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-3 py-2">{item.id}</td>
                  <td className="px-3 py-2">{item.name}</td>
                  {hasSlug && <td className="px-3 py-2 text-muted-foreground">{item.slug}</td>}
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
                  <td colSpan={hasSlug ? 4 : 3} className="px-3 py-6 text-center text-muted-foreground">
                    No items yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
