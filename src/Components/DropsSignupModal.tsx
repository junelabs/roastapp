"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";


type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  initialEmail?: string;
  source?: string; // "hero" | "header_button"
};

export default function DropsSignupModal({ open, setOpen, initialEmail = "", source = "hero" }: Props) {
  const [email, setEmail] = React.useState(initialEmail);
  const [fullName, setFullName] = React.useState("");
  const [birthday, setBirthday] = React.useState(""); // yyyy-mm-dd
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const utm = typeof window !== "undefined" ? window.location.search : "";

  React.useEffect(() => setEmail(initialEmail), [initialEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/drop-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          birthday: birthday || null,
          source,
          utm
        })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setDone(true);
    } catch (err) {
      alert("Something went wrong saving your info. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Get notified for each Coffee Drop</DialogTitle>
          <DialogDescription>
            We’ll email you when a new Coffee Drop releases. Add your name & birthday for perks later.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-4">
            <p className="text-base">You’re in! We’ll ping you for the next Drop. 🎉</p>
            <p className="text-sm text-muted-foreground mt-2">You can close this window.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">Full name (optional)</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm mb-1">Birthday (optional)</label>
              <Input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save & Join"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
