"use client";
import { useEffect, useRef, useState } from "react";
import { FaProjectDiagram, FaUsers, FaDollarSign } from "react-icons/fa";
import { useCountUp } from "../../hooks/useCountUp";
import { useInView } from "framer-motion";
function Numbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.5 });
  const projects = useCountUp(500, 2000, inView);
  const investors = useCountUp(1200, 2000, inView);
  const investments = useCountUp(10, 2000, inView);
  return (
    <section ref={ref} className="bg-background dark:bg-background-dark">
      <div className="bg-gradient-to-br from-primary to-secondary dark:to-heading text-background rounded-2xl w-8/10 mx-auto text-center px-4 grid sm:grid-cols-3 gap-8">
        <div className="py-8 md:py-16 flex flex-col items-center">
          <div className="p-4 bg-background/20 rounded-full mb-4">
            <FaProjectDiagram className="text-3xl text-background" />
          </div>
          <h3 className="text-5xl font-bold mb-2">{projects}+</h3>
          <p className="text-sm font-semibold mb-2">Projects Funded</p>
          <p className="text-xs text-background/80 max-w-xs">
            From startups to growing ventures, we’ve successfully funded
            hundreds of investment opportunities.
          </p>
        </div>

        <div className="py-8 md:py-16 flex flex-col items-center">
          <div className="p-4 bg-background/20 rounded-full mb-4">
            <FaUsers className="text-3xl text-background" />
          </div>
          <h3 className="text-5xl font-bold mb-2">{investors}+</h3>
          <p className="text-sm font-semibold mb-2">Active Investors</p>
          <p className="text-xs text-background/80 max-w-xs">
            A growing community of investors connecting with entrepreneurs and
            fueling new opportunities.
          </p>
        </div>

        <div className="py-8 md:py-16 flex flex-col items-center">
          <div className="p-4 bg-white/20 rounded-full mb-4">
            <FaDollarSign className="text-3xl text-white" />
          </div>
          <h3 className="text-5xl font-bold mb-2">${investments}M+</h3>
          <p className="text-sm font-semibold mb-2">Total Investments</p>
          <p className="text-xs text-white/80 max-w-xs">
            Over ten million dollars invested through our platform, helping
            projects and investors grow together.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Numbers;
