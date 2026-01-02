import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import InvestmentCategories from "../components/home/InvestmentCategories";
import Numbers from "../components/home/Numbers";
import ReadySection from "../components/home/ReadySection";
import SuccessStories from "../components/home/SuccessStories";
import WhyChooseSection from "../components/home/WhyChooseSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseSection />
      <Numbers />
      <InvestmentCategories />
      <SuccessStories />
      <Banner />
      <ReadySection />
    </>
  );
}
