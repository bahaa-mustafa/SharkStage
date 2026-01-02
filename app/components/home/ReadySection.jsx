import Link from "next/link";
import React from "react";

function ReadySection() {
  return (
    <section className="relative aspect-[16/14] sm:aspect-[16/9] md:aspect-[16/6] flex flex-col items-center justify-center text-center px-6">
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover "
      >
        <source src="/cta.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 w-full h-full bg-background/5 dark:bg-background-dark/20 backdrop-blur-xs"></div>
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
      <h2 className="relative text-3xl md:text-5xl font-bold text-white dark:text-background mb-4">
        Empower Your Investments. <br /> Shape Tomorrow's Opportunities.
      </h2>
      <p className="relative text-white/80 dark:text-paragraph max-w-2xl mb-6">
        Discover vetted projects, track performance in real-time, and grow with
        a community of smart investors.
      </p>
      <Link
        href={"/sign/in"}
        className="relative bg-primary dark:bg-primary-dark hover:shadow-lg dark:hover:shadow-white/10 text-white font-semibold px-6 py-3 cursor-pointer rounded-2xl transition"
      >
        Get Started
      </Link>
    </section>
  );
}

export default ReadySection;
