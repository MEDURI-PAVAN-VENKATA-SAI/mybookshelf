import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import SafeImage from './SafeImage';
import { useNavbar } from '../contexts/NavbarContext';

export default function Footer() {

  const { openNav } = useNavbar();
  const { darkMode } = useTheme();

  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className={`grid grid-cols-1 gap-8 lg:grid-cols-2 ${openNav ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
          <div className={`w-full col-span-1`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-transparent rounded-lg">
                <SafeImage src='/logo.png' className="w-6 h-6" alt="" />
              </div>
              <span className='w-fit h-fit'>
                <SafeImage src='/title.svg' alt='MyBookShelf' className={`w-25 h-10 text-[var(--text)] ${darkMode ? 'invert' : ''}`} />
              </span>
            </div>
            <p className="text-[var(--muted-text)] px-4 mb-4">
              Your personal digital library. Browse, read, and manage your book collection in one beautiful place.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--hover)] transition-colors">
                <SafeImage src='/insta_icon.png' className="w-5 h-5 text-[var(--text)]" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--hover)] transition-colors">
                <SafeImage src='/twitter-x.png' alt='' className={`w-4 h-4 text-[var(--text)] ${darkMode ? '' : 'invert'}`} />
              </a>
              <a href="https://mail.google.com/mail/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--hover)] transition-colors">
                <Mail className="w-5 h-5 text-[var(--text)]" />
              </a>
            </div>
          </div>
          <div className={`w-full col-span-1 gap-4 flex flex-row px-4 justify-around`}>
            <div>
              <h3 className="font-bold text-[var(--text)] mb-4">Features</h3>
              <ul className="space-y-2">
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Browse Library
                </li>
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Read Books
                </li>
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Track Progress
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text)] mb-4">Support</h3>
              <ul className="space-y-2">
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Help Center
                </li>
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Privacy Policy
                </li>
                <li className="text-[var(--muted-text)] hover:text-blue-600 transition-colors">
                    Terms of Service
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-[var(--muted-text)] text-sm">
          <p>&copy;2026 MyBookShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
