"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      const res = await fetch("/api/video");
      const data = await res.json();
      setVideos(data);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <section className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Video with AI</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Upload, share, and explore AI-powered videos. Sign up to get started or browse the latest uploads!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          {status === "loading" ? null : session ? (
            <>
              <button
                onClick={() => router.push("/upload")}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload Video
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-2 rounded-lg bg-white border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 dark:bg-gray-900 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </>
          )}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Latest Videos</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading videos...</div>
        ) : (
          <VideoFeed videos={videos} />
        )}
      </section>
    </div>
  );
}