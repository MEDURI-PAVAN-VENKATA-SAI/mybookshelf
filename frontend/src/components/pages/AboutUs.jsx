import { BookOpen, ShieldCheck, Bookmark, Users, Lock, Sparkles, Mail } from "lucide-react";
import Footer from "../utils/Footer";

export default function AboutUs() {
  return (
    <section className={`w-full h-full bg-[url('/wood-bg.jpg')] bg-repeat-round text-[var(--text)] pt-12 transition`}>
      <div className="w-full h-full bg-[var(--background)] mx-auto space-y-16 px-6 py-8 overflow-x-hidden overflow-y-auto scrollbar-auto">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-[var(--accent)]">
            <Sparkles size={28} />
            <h1 className="text-3xl md:text-4xl font-bold">About MyBookShelf</h1>
          </div>
          <p className="text-[var(--muted-text)] max-w-2xl mx-auto text-base md:text-lg">
            MYBookShelf is a modern, secure, and distraction-free digital bookshelf designed to help you manage, track, and enjoy your reading journey.
          </p>
        </header>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<BookOpen />}
            title="Your Personal Library"
            description="Organize books, track reading progress, and revisit favorites anytime."
          />
          <Feature
            icon={<Bookmark />}
            title="Smart Reading Progress"
            description="Automatically track reading status and resume right where you left off."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Secure Authentication"
            description="Google and Email login powered by Firebase with backend-verified sessions."
          />
          <Feature
            icon={<Lock />}
            title="Privacy First"
            description="Your data stays yours — no unnecessary tracking or exposure."
          />
          <Feature
            icon={<Users />}
            title="Built for Growth"
            description="Designed to scale smoothly while keeping performance fast and stable."
          />
          <Feature
            icon={<Sparkles />}
            title="Clean Experience"
            description="Minimal UI, smooth interactions, and responsive design across devices."
          />
        </div>

        {/* Footer Note */}
        <footer className="text-center text-sm text-[var(--muted-text)] space-y-12">
          <p className="text-center text-sm text-[var(--muted-text)]">Built with ❤️ to make reading simpler, smarter, and more enjoyable.</p>
          <p>For any queries mail us&nbsp;:&nbsp;
            <a target="_blank" className="text-[var(--accent)] underline" rel="noopener noreferrer" href="https://mail.google.com/mail/u/0/#inbox?compose=new">
                official.mybookshelf@gmail.com
            </a>
          </p>
        </footer>
        <Footer/>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3 text-[var(--accent)]">
        {icon}
        <h3 className="font-semibold text-lg text-[var(--card-text)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--muted-text)]">{description}</p>
    </div>
  );
}