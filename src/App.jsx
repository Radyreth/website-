import React, { useState, useCallback, lazy, Suspense } from "react";
import "./styles/global.css";
import { CursorProvider } from "./context/CursorContext";
import CustomCursor from "./components/effects/CustomCursor";
import IntroSequence from "./components/effects/IntroSequence";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";
import FAQ from "./components/sections/FAQ";

// Lazy loaded heavy components
const ParticleField = lazy(() => import("./components/effects/ParticleField"));
const Proof = lazy(() => import("./components/sections/Proof"));
const Stats = lazy(() => import("./components/sections/Stats"));
const Stack = lazy(() => import("./components/sections/Stack"));

function LoadingFallback() {
  return null;
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(
    () => !!sessionStorage.getItem("reazy-intro-seen") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <CursorProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <CustomCursor />

      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {!introComplete && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      <Header />

      <main id="main-content">
        <Hero />
        <Services />

        <Suspense fallback={<LoadingFallback />}>
          <Proof />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Stats />
        </Suspense>

        <Suspense fallback={<LoadingFallback />}>
          <Stack />
        </Suspense>

        <FAQ />
        <Contact />
      </main>

      <Footer />

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </CursorProvider>
  );
}
