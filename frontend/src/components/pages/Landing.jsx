import React from "react";
import { useUser } from '../contexts/UserContext';
import Header from "../utils/Header";
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Heart, Sparkles, Users, Globe } from 'lucide-react';
import Button from '../utils/Button';
import Footer from "../utils/Footer";
import CardCarousel from "../utils/CardCarousel";

function Landing() {
  const navigate = useNavigate();
  const { user } = useUser();

  const goToLogin = () => {
    navigate("/login");
  };

  const trendingBooks = [
    {
      id: '1',
      title: 'The Midnight Library',
      authors: ['Matt Haig'],
      coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
      ratingAvg: 4.5,
      categories:['Fiction']
    },
    {
      id: '2',
      title: 'Atomic Habits',
      authors: ['James Clear'],
      coverUrl: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400',
      ratingAvg: 4.8,
      categories:['Non-Fiction']
    },
    {
      id: '3',
      title: 'Project Hail Mary',
      authors: ['Andy Weir'],
      coverUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=400',
      ratingAvg: 4.7,
      categories:['Fantacy']
    },
    {
      id: '4',
      title: 'The Silent Patient',
      authors: ['Alex Michaelides'],
      coverUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
      ratingAvg: 4.3,
      categories:['Fiction']
    },
    {
      id: '5',
      title: 'The Midnight Library',
      authors: ['Matt Haig'],
      coverUrl: '',
      ratingAvg: 4.5,
      categories:['Romance']
    }
  ];

  
  return (
    <div className="bg-[var(--background)] text-[var(--text)] transition-colors duration-300 overflow-hidden">
      {/* HERO SECTION */}
      <div className="overflow-hidden"><Header searchBarVisibility={false} /></div>
      <div className="absolute w-[100dvw] h-[calc(100dvh-61px)] top-[61px] overflow-x-hidden overflow-y-auto scrollbar-auto">
        <section className="relative h-full pb-5 items-center justify-center content-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)] via-[var(--background)] to-[var(--secondary)]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--ring)] rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--muted)] dark:bg-[var(--muted)] rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--primary)]">
                  Your Digital Library Awaits
                </span>
              </div>

              <h1 className="text-4xl min-[430px]:text-5xl md:text-7xl font-bold text-[var(--text)] mb-6">
                Read, Manage,
                <span className="text-[var(--accent)] text-4xl min-[430px]:text-5xl md:text-7xl font-bold">
                  &nbsp;Discover
                </span>
              </h1>

              <p className="text-lg text-[var(--muted-text)] mb-8 max-w-2xl mx-auto">
                Your personal cloud-based library. Browse thousands of books, track your reading progress, and discover your next favorite read.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div>
                  <Button size="lg" onClick={goToLogin} className="w-full sm:w-auto bg-[var(--primary)] text-[var(--primary-text)] hover:bg-[var(--hover)] cursor-pointer">
                    Get Started Free
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="lg" onClick={goToLogin} className="w-full sm:w-auto border border-[var(--border)] text-[var(--text)] hover:bg-[var(--hover)] cursor-pointer">
                    Browse Library
                  </Button>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[var(--muted-text)]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--ring)]" />
                  <span>Ever-Growing Library</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--ring)]" />
                  <span>Endless Readers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 bg-[var(--card)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--muted)] dark:from-[var(--card)] dark:to-[var(--muted)]">
                <div className="inline-flex p-4 bg-[var(--primary)] rounded-2xl mb-4">
                  <Search className="w-8 h-8 text-[var(--primary-text)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                  Discover Books
                </h3>
                <p className="text-[var(--muted-text)]">
                  Browse our extensive library with powerful search and filtering options
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--muted)] dark:from-[var(--card)] dark:to-[var(--muted)]">
                <div className="inline-flex p-4 bg-[var(--primary)] rounded-2xl mb-4">
                  <Heart className="w-8 h-8 text-[var(--primary-text)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                  Track Progress
                </h3>
                <p className="text-[var(--muted-text)]">
                  Keep track of your reading journey with detailed progress tracking
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--secondary)] to-[var(--muted)] dark:from-[var(--card)] dark:to-[var(--muted)]">
                <div className="inline-flex p-4 bg-[var(--primary)] rounded-2xl mb-4">
                  <Globe className="w-8 h-8 text-[var(--primary-text)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                  Accessibility
                </h3>
                <p className="text-[var(--muted-text)]">
                  Read your favourite books any where and any time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRENDING SECTION */}
        <section className="py-8 bg-[var(--muted)]">
          <CardCarousel title="Trending This Week" books={trendingBooks} onClick={goToLogin} showActions={false} />
        </section>
        
        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--ring)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-[var(--primary-text)] mb-6">
              Start Your Reading Journey Today
            </h2>
            <p className="text-xl opacity-70 text-[var(--primary-text)] mb-8 max-w-2xl mx-auto">
              Join thousands of readers who are discovering, tracking, and enjoying their favorite books on MyBookShelf.
            </p>
            <Button size="lg" onClick={goToLogin} className="bg-[var(--card)] text-[var(--text)] hover:bg-[var(--border)] cursor-pointer">
              Create Free Account
            </Button>
          </div>
        </section>
        <Footer/>
      </div>
    </div>
  );
}

export default Landing;
