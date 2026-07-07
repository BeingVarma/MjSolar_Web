"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ValueProps from "@/components/ValueProps";
import RoiCalculator from "@/components/RoiCalculator";
import DashboardDemo from "@/components/DashboardDemo";
import Footer from "@/components/Footer";
import ChatbotOverlay from "@/components/ChatbotOverlay";

export type IntroState = "pending" | "playing" | "finished";

export default function Home() {
  const [introState, setIntroState] = useState<IntroState>("playing");

  useEffect(() => {
    if (introState === "playing") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [introState]);

  return (
    <main className="relative flex flex-col min-h-screen">
      <Header introState={introState} />
      <HeroSection introState={introState} onIntroEnd={() => setIntroState("finished")} />
      
      <ValueProps />
      <RoiCalculator />
      <DashboardDemo />
      <Footer />
      <ChatbotOverlay introState={introState} />
    </main>
  );
}
