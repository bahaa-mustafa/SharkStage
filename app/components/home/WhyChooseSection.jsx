"use client";
import { FaShieldHalved } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";
import { FaEarthEurope } from "react-icons/fa6";
import { decrement, increment } from "@/lib/features/counter/counterSlice";
import { useDispatch, useSelector } from "react-redux";

const WhyChooseSection = () => {
  const features = [
    {
      icon: (
        <FaShieldHalved className="text-white text-2xl group-hover:scale-115 transition-all duration-300" />
      ),
      title: "Secure Transactions",
      desc: "Bank-level security with encrypted payments and verified escrow services for complete peace of mind.",
    },
    {
      icon: (
        <FaChartLine className="text-white text-2xl group-hover:scale-115 transition-all duration-300" />
      ),
      title: "Growth Analytics",
      desc: "Real-time data insights and performance metrics to track your investment portfolio growth.",
    },
    {
      icon: (
        <FaUsers className="text-white text-2xl group-hover:scale-115 transition-all duration-300" />
      ),
      title: "Expert Community",
      desc: "Connect with seasoned investors and entrepreneurs in our exclusive networking platform.",
    },
    {
      icon: (
        <FaBolt className="text-white text-2xl group-hover:scale-115 transition-all duration-300" />
      ),
      title: "Fast Processing",
      desc: "Lightning-fast deal execution with automated workflows and instant notifications.",
    },
    {
      icon: (
        <FaEarthEurope className="text-white text-2xl group-hover:scale-115 transition-all duration-300" />
      ),
      title: "Global Marketplace",
      desc: "Access investment opportunities from around the world with multi-currency support.",
    },
  ];
  return (
    <section className="bg-background dark:bg-background-dark pb-20 pt-28 -mt-28">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl dark:text-background sm:text-5xl font-bold mb-3  ">
          Why Choose <span className="text-primary">SharkStage</span>
        </h2>
        <p className="text-paragraph  mb-12">
          The most trusted platform for buying and selling investment projects
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full sm:w-[45%] lg:w-[30%] group relative overflow-hidden rounded-2xl    p-6  
                         transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-gradient-to-b hover:from-white/10 hover:to-white/5"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative flex flex-col items-center text-center">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-primary to-secondary mb-4 w-fit transform transition-transform duration-300 ">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-sm text-paragraph leading-relaxed mt-2">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
