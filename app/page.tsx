import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/sections/Hero';
import { Authority } from '@/sections/Authority';
import { Procedures } from '@/sections/Procedures';
import { Experience } from '@/sections/Experience';
import { Testimonials } from '@/sections/Testimonials';
import { LeadForm } from '@/sections/LeadForm';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Authority />
        <Procedures />
        <Experience />
        <Testimonials />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
