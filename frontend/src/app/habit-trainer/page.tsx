"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Dumbbell, Info, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function HabitTrainerPage() {
  const [habitGoal, setHabitGoal] = useState("");
  const [context, setContext] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/habit-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit_goal: habitGoal, context }),
      });
      if (!res.ok) throw new Error("Failed to get plan");
      const data = await res.json();
      setPlan(data.plan || "No plan generated.");
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 sm:px-12 sm:py-8 shadow-md bg-white/80 z-10 w-full justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Dumbbell className="text-blue-600" size={32} />
          </span>
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">AI Habit Trainer</h2>
        </div>
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm transition">
          &larr; Back to Home
        </Link>
      </div>
      {/* Main Content: Two-column layout */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center px-4 py-8 gap-8 max-w-6xl mx-auto w-full">
        {/* Left: Form */}
        <div className="md:w-1/2 w-full flex flex-col md:justify-start md:pt-2">
          <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-lg p-8 w-full space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">What habit do you want to build?</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
                placeholder="e.g. Exercise every morning"
                value={habitGoal}
                onChange={e => setHabitGoal(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Additional context (optional)</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
                placeholder="e.g. I have a busy schedule, low motivation, etc."
                value={context}
                onChange={e => setContext(e.target.value)}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow text-base transition disabled:opacity-50"
              disabled={loading || !habitGoal.trim()}
            >
              {loading ? "Generating..." : "Get My Habit Plan"}
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
        </div>
        {/* Divider for desktop */}
        <div className="hidden md:flex w-px bg-blue-100 mx-2" />
        {/* Right: AI Advice */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          {plan && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-6 w-full">
              <h3 className="text-2xl font-extrabold text-blue-800 mb-5 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={28} />
                Your Personalized Habit Plan
              </h3>
              <div className="prose prose-blue max-w-none text-gray-900 text-base">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-700 mt-6 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-blue-600 mt-5 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-blue-500 mt-4 mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                    li: ({node, children, ...props}) => (
                      <li className="mb-2 flex items-start gap-2">
                        <span className="mt-1 text-blue-400">•</span>
                        <span className="block">{children}</span>
                      </li>
                    ),
                    strong: ({node, ...props}) => <strong className="font-bold text-blue-700" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-blue-500" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-blue-400 bg-blue-100/60 p-4 my-4 rounded-xl text-blue-800 flex items-start gap-2">
                        <Info className="text-blue-400 mt-1" size={20} />
                        <span>{props.children}</span>
                      </blockquote>
                    ),
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    code: ({node, ...props}) => <code className="bg-blue-100 px-1 rounded text-blue-700" {...props} />,
                  }}
                >
                  {plan}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="w-full flex justify-center items-center py-3 bg-white/70 text-gray-400 text-xs gap-2 z-10 border-t">
        Powered by Groq AI
      </div>
    </div>
  );
} 