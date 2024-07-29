import AboutSection from "@/components/AboutSection";
import HomeScreen from "@/components/HomeScreen";
import { Separator } from "@/components/ui/separator";
import UserBenefits from "@/components/UserBenefits";
import React from "react";

export default function Home() {
  return (
    <main className="">
      <HomeScreen />
      <AboutSection />
      <UserBenefits />
    </main>
  );
}
