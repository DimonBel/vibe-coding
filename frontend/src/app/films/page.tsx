"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

function StarRating({ value }: { value: number }) {
  const fullStars = Math.round(value);
  return (
    <span className="text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) =>
        i < fullStars ? "★" : "☆"
      )}
    </span>
  );
}

export default function FilmsPage() {
  const [films, setFilms] = useState<any[]>([]);
  const [filmSearch, setFilmSearch] = useState("");
  const [filmLoading, setFilmLoading] = useState(false);
  const [filmError, setFilmError] = useState<string | null>(null);

  // Fetch films (popular or by query)
  const fetchFilms = useCallback(async (query = "") => {
    setFilmLoading(true);
    setFilmError(null);
    try {
      const res = await fetch("/api/films-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Failed to fetch films");
      const data = await res.json();
      setFilms(data.films || []);
    } catch (e: any) {
      setFilmError(e.message || "Unknown error");
      setFilms([]);
    } finally {
      setFilmLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Film search handler
  const handleFilmSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilms(filmSearch);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Image src="/globe.svg" alt="Film" width={48} height={48} />
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Film Recommendations</h1>
          </div>
          <form onSubmit={handleFilmSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm bg-white"
              placeholder="Search for films by title, genre, or year..."
              value={filmSearch}
              onChange={e => setFilmSearch(e.target.value)}
              disabled={filmLoading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow text-base transition disabled:opacity-50"
              disabled={filmLoading}
            >
              {filmLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
        {filmError && <div className="text-red-500 text-sm mb-4">{filmError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {filmLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl shadow-lg p-5 h-64 flex flex-col items-center justify-center">
              <div className="w-28 h-40 bg-blue-100 rounded-xl mb-4" />
              <div className="h-4 bg-blue-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-blue-100 rounded w-1/2" />
            </div>
          ))}
          {!filmLoading && films.length === 0 && <div className="col-span-full text-gray-400 text-center text-lg">No films found.</div>}
          {films.map((film, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transition-transform h-64">
              <div className="w-28 h-40 mb-4 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center">
                <Image src="/globe.svg" alt="Film Poster" width={60} height={60} className="object-contain" />
              </div>
              <div className="font-bold text-blue-900 text-lg text-center line-clamp-2 mb-1">{film.title}</div>
              <div className="text-gray-500 text-sm mb-1">{film.year} &middot; {film.genre}</div>
              <div className="flex items-center gap-2 mt-auto">
                <StarRating value={(film.popularity ?? 0) / 2} />
                <span className="text-xs text-gray-400">{(film.popularity ?? 0).toFixed(1)}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 