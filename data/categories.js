import {
  Building2,
  Smartphone,
  Leaf,
  Cog,
  ShoppingBag,
  Rocket,
} from "lucide-react";

export const categories = [
  {
    id: "real-estate",
    icon: Building2,
    bg: "bg-blue-500",
    title: "Real Estate",
    desc: "Commercial and residential property investments",
    projects: "127 Projects",
    roi: "12-25%",
  },
  {
    id: "technology",
    icon: Smartphone,
    bg: "bg-purple-500",
    title: "Technology",
    desc: "SaaS, apps, and digital product ventures",
    projects: "234 Projects",
    roi: "12-25%",
  },
  {
    id: "green-energy",
    icon: Leaf,
    bg: "bg-green-500",
    title: "Green Energy",
    desc: "Sustainable and renewable energy projects",
    projects: "89 Projects",
    roi: "12-25%",
  },
  {
    id: "ai-automation",
    icon: Cog,
    bg: "bg-orange-500",
    title: "AI & Automation",
    desc: "Machine learning and automation solutions",
    projects: "156 Projects",
    roi: "12-25%",
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    bg: "bg-indigo-500",
    title: "E-commerce",
    desc: "Online retail and marketplace platforms",
    projects: "198 Projects",
    roi: "12-25%",
  },
  {
    id: "startups",
    icon: Rocket,
    bg: "bg-yellow-500",
    title: "Startups",
    desc: "Early-stage ventures and MVPs",
    projects: "312 Projects",
    roi: "12-25%",
  },
];

export const getCategoryById = (id) => {
  return categories.find((cat) => cat.id === id);
};

