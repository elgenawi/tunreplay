"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Clock } from "lucide-react";

interface ScheduleRow {
  id: number;
  day: string;
  time: string;
  series_id: number;
  series_title: string;
  series_slug: string;
}

const DAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminSchedulePage() {
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [series, setSeries] = useState<{ id: number; title: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ days: ["Monday"], time: "20:00", series_id: "" });
  const [seriesSearch, setSeriesSearch] = useState("");

  const load = async () => {
    const [schedRes, seriesRes] = await Promise.all([
      fetch("/api/admin/schedule").then((r) => r.json()),
      fetch("/api/admin/series").then((r) => r.json()),
    ]);
    setRows(schedRes.data || []);
    setSeries(
      (seriesRes.data || []).map((s: { id: number; title: string; slug: string }) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
      }))
    );
  };

  useEffect(() => {
    load();
  }, []);

  const filteredSeries = seriesSearch
    ? series.filter((s) =>
        s.title.toLowerCase().includes(seriesSearch.toLowerCase())
      )
    : series;

  const formatTime = (t: string) => {
    if (!t) return "";
    const parts = String(t).split(":");
    const h = parts[0]?.padStart(2, "0") ?? "00";
    const m = parts[1]?.padStart(2, "0") ?? "00";
    return `${h}:${m}`;
  };

  const toggleDay = (day: string) => {
    setForm((f) => {
      const exists = f.days.includes(day);
      const days = exists ? f.days.filter((d) => d !== day) : [...f.days, day];
      return { ...f, days };
    });
  };

  const selectAllDays = () => {
    setForm((f) => ({ ...f, days: [...DAYS_EN] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.series_id || form.days.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        form.days.map((day) =>
          fetch("/api/admin/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              day,
              time: form.time,
              series_id: Number(form.series_id),
            }),
          })
        )
      );
      setForm((f) => ({ ...f, series_id: "" }));
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this schedule entry?")) return;
    await fetch(`/api/admin/schedule?id=${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Release schedule (مواعيد الحلقات)</h1>
        <p className="text-muted-foreground">
          Set which series air at which day and time. Shown on the episode schedules page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_EN.map((d) => {
                  const active = form.days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-transparent text-muted-foreground border-border hover:bg-white/10"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={selectAllDays}
                  className="px-3 py-1 rounded-full text-xs border border-dashed border-input text-muted-foreground hover:bg-white/10"
                >
                  All days
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="flex h-9 w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <div className="space-y-1 min-w-[240px]">
              <label className="text-sm font-medium">Series</label>
              <input
                type="text"
                placeholder="Search series..."
                value={seriesSearch}
                onChange={(e) => setSeriesSearch(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm mb-1"
              />
              <select
                value={form.series_id}
                onChange={(e) => setForm((f) => ({ ...f, series_id: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">Select series</option>
                {filteredSeries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={loading || !form.series_id}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            All entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No schedule entries yet. Add one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Day</th>
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Series</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/50">
                      <td className="py-2">{r.day}</td>
                      <td className="py-2">{formatTime(r.time)}</td>
                      <td className="py-2">{r.series_title}</td>
                      <td className="py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
