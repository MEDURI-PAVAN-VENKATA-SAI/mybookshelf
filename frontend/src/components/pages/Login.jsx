import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useUser } from "../contexts/UserContext";
import Button from '../utils/Button';
import SafeImage from '../utils/SafeImage';
import { toast } from 'react-toastify';
import { loginWithGoogle, loginWithEmail } from "../../firebasesetup/authService";
import { useLoader } from '../contexts/LoaderContext';
import Loading from '../utils/Loading';

const useAutoClear = (value, setter, delay = 10000) => {
  useEffect(() => {
    if (!value) return;
    const timer = setTimeout(() => setter(""), delay);
    return () => clearTimeout(timer);
  }, [value]);
};

function Login() {
  const { setUser } = useUser();
  const { loading, setLoading } = useLoader();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useAutoClear(message, setMessage);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email.trim() || !password.trim()) { setMessage("Invalid Email or password"); setLoading(false); return; }   // Check if any Empty fields
    if (password.trim().length < 6) { setMessage("Invalid Password"); setLoading(false); return; }   // Check Password length
    try { await loginWithEmail(email.trim(), password.trim(), setUser, setMessage, navigate, toast); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try { await loginWithGoogle(setUser, navigate, toast); }
    finally { setLoading(false); }
  };


  return (
    <div className={`w-full h-full flex items-center overflow-hidden justify-center px-2 py-8 bg-[var(--background)]`}>
      <Loading message="Please wait..." className={ loading ? "" : "hidden" }/>
      <div className={`w-[calc(100%-16px)] max-w-md h-fit overflow-x-hidden overflow-y-auto scrollbar-auto ${loading ? "blur-sm pointer-events-none" : ""}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
            <SafeImage src="/logo.png" alt="Logo" className="h-7 w-7"/>
          </div>

          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--muted-text)]">
            Sign in to continue to your library
          </p>
        </div>

        <div className="bg-[var(--card)] text-[var(--card-text)]
          rounded-2xl shadow-xl p-8">

          <form onSubmit={handleEmailLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2
                  w-5 h-5 text-[var(--muted-text)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3
                    bg-[var(--secondary)]
                    border border-[var(--border)]
                    rounded-lg
                    text-[var(--text)]
                    placeholder:text-[var(--muted-text)]
                    focus:outline-none
                    focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--muted-text)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                  w-5 h-5 text-[var(--muted-text)]" />
                <input
                  type={ show ? "text" : "password" }
                  value={password}
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3
                    bg-[var(--secondary)]
                    border border-[var(--border)]
                    rounded-lg
                    text-[var(--text)]
                    placeholder:text-[var(--muted-text)]
                    focus:outline-none
                    focus:ring-2 focus:ring-[var(--ring)]"
                />
                <div className="w-8 h-8 absolute right-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-[var(--border)] cursor-pointer
                    items-center justify-center flex flex-row text-[var(--text)] p-1 rounded-full" onClick={()=>setShow(!show)}>
                  { show ? <EyeOff size={20} /> : <Eye size={20} /> }
                </div>
              </div>
            </div>

            { message && (<p className="w-full p-2 text-red-500 text-[14px] flex flex-row items-center justify-center">{message}</p>) }

            {/* Options */}
            <div className="flex items-center justify-center">
              <p onClick={handleGoogleLogin} className="text-sm text-[var(--accent)] hover:opacity-80">
                Forgot password?
              </p>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--card)] text-[var(--muted-text)]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button disabled={ loading }
              onClick={ handleGoogleLogin }
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border)] rounded-lg
                  hover:bg-[var(--hover)] transition-colors cursor-pointer">
              <SafeImage src="/google.png" className="w-7 h-7" />
              <span className="font-medium text-[var(--text)]">
                Sign in with Google
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 justify-center items-center flex">
            <div className='text-center text-sm text-[var(--muted-text)] mr-2'>Don't have an account?</div>
            <div disabled={ loading }
              onClick={ handleGoogleLogin }
              className="text-[18px] font-medium text-[var(--accent)] hover:opacity-80 cursor-pointer underline">
              Sign up
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Login;