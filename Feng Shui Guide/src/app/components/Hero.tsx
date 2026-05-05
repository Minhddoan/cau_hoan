import { motion, AnimatePresence, Variants } from "motion/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "../context/SettingsContext.tsx";
import { DynamicSlider } from "./DynamicSlider.tsx";

export function Hero() {
  const { settings } = useSettings();



  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Slides with Dynamic Content */}
      <div className="absolute inset-0 z-0">
        <DynamicSlider 
          category="home_main_slider" 
          renderContent={true}
          overlayClassName="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      </div>



      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 rotate-90 origin-center">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-gold/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
