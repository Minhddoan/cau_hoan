import { Hero } from "../components/Hero.tsx";
import { About } from "../components/About.tsx";
import { Services } from "../components/Services.tsx";
import { Products } from "../components/Products.tsx";
import { Gallery } from "../components/Gallery.tsx";
import { AIAssistant } from "../components/AIAssistant.tsx";
import { Knowledge } from "../components/Knowledge.tsx";
import { QandA } from "../components/QandA.tsx";
import { Careers } from "../components/Careers.tsx";
import { Contact } from "../components/Contact.tsx";
import { Footer } from "../components/Footer.tsx";

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Products />
      <Gallery />
      <AIAssistant />
      <Knowledge />
      <QandA />
      <Careers />
      <Contact />
      <Footer />
    </>
  );
}
