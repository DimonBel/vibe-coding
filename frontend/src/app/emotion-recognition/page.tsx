"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EmotionRecognitionPage() {
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmotions(null);
    try {
      const res = await fetch("/api/emotion-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not recognize emotion. Please try again.");
        return;
      }
      setEmotions(data.emotions);
    } catch (err) {
      setError("Could not recognize emotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-100 py-10">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Emotion Recognition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="font-semibold">Enter text to analyze:</label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Type or paste your text here..."
              required
            />
            <Button type="submit" disabled={loading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {loading ? "Analyzing..." : "Recognize Emotion"}
            </Button>
          </form>
          {emotions && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <span className="font-semibold text-blue-700">Detected Emotion(s): </span>
              <span className="text-lg">{emotions}</span>
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600 text-center">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 