import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Chatbot from "../components/Chatbot";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Chatbot />

      <Footer />
    </>
  );
}
