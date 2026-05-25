import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
import { register, emailLogin, googleLogin } from "../services/authService.js";

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) return toast.error("Please fill in all fields.");
    if (isSignUp && !name) return toast.error("Please enter your name.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const result = isSignUp
        ? await register(name, email, password)
        : await emailLogin(email, password);
      login(result.token, result.user);
      toast.success(
        isSignUp
          ? `Welcome, ${result.user.name}!`
          : `Welcome back, ${result.user.name}!`
      );
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      login(result.token, result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      navigate("/");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            <span className="text-accent">&lt;</span>
            CodeTranslator
            <span className="text-accent">/&gt;</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Translate code between languages with AI
          </p>
        </div>

        <div className="bg-dark-card border border-gray-700/50 rounded-2xl p-8 shadow-xl">
          <div className="flex mb-6 bg-dark-bg rounded-xl p-1 border border-gray-700/50">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isSignUp
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isSignUp
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200
                             placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50
                             focus:border-accent/50 transition-all text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200
                           placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50
                           focus:border-accent/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200
                           placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50
                           focus:border-accent/50 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-accent text-white font-medium text-sm
                         hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all shadow-lg shadow-accent/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-dark-card px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed.")}
              theme="outline"
              shape="rectangular"
              size="large"
              text="continue_with"
              width="300"
            />
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent hover:text-accent-hover font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
