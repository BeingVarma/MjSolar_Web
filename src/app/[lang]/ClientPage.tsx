"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

const ValueProps = dynamic(() => import("@/components/ValueProps"));
const RoiCalculator = dynamic(() => import("@/components/RoiCalculator"));
const DashboardDemo = dynamic(() => import("@/components/DashboardDemo"));
const Footer = dynamic(() => import("@/components/Footer"));
const ChatbotOverlay = dynamic(() => import("@/components/ChatbotOverlay"));

export type IntroState = "pending" | "playing" | "finished";

export default function Home() {
  const [introState, setIntroState] = useState<IntroState>("pending");

  useEffect(() => {
    try {
      const hasSeenIntro = localStorage.getItem("mjsolar_intro_seen");
      if (hasSeenIntro) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIntroState("finished");
      } else {
         
        setIntroState("playing");
      }
    } catch {
      // Fallback if localStorage is unavailable
       
      setIntroState("playing");
    }
  }, []);

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
      <HeroSection 
        introState={introState} 
        onIntroEnd={() => {
          try {
            localStorage.setItem("mjsolar_intro_seen", "true");
          } catch {
            // Ignore if localStorage is unavailable
          }
          setIntroState("finished");
        }} 
      />
      
      <ValueProps />
      <RoiCalculator />
      <DashboardDemo />
      <Footer />
      <ChatbotOverlay introState={introState} />
    </main>
  );
}
