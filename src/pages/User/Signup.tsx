import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import { useAuth } from "../../auth/AuthContext";
import { TicketsPlane as Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RightLayout from "./RightLayout";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  /* ---------------- Validation Helpers ---------------- */

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    return "Medium";
  };

  const passwordStrength = getPasswordStrength(password);

  const emailError = touched.email && !email;
  const passwordError = touched.password && !password;
  const confirmPasswordError =
    touched.confirmPassword && password !== confirmPassword;

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  /* ---------------- Submit Handler ---------------- */

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const userData = await signup(email, password);
      setUser(userData);
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 flex items-center justify-center rounded-full">
                <Ticket className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold">Ticket Desk</span>
            </div>

            <h2 className="mt-6 text-3xl font-thin">Welcome,</h2>
            <h4 className="font-thin">Sign Up to Create Account</h4>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Email */}
            <div>
              <Input
                className="border border-gray-300 bg-white"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() =>
                  setTouched(t => ({ ...t, email: true }))
                }
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">
                  Email is required
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                className="border border-gray-300 bg-white"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() =>
                  setTouched(t => ({ ...t, password: true }))
                }
              />

              {passwordError && (
                <p className="mt-1 text-sm text-red-500">
                  Password is required
                </p>
              )}

              {password && (
                <p
                  className={`mt-1 text-sm ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                className="border border-gray-300 bg-white"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e =>
                  setConfirmPassword(e.target.value)
                }
                onBlur={() =>
                  setTouched(t => ({
                    ...t,
                    confirmPassword: true,
                  }))
                }
              />

              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="outline"
              disabled={!isFormValid}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">Or</span>
            </div>
          </div>

          {/* Login Redirect */}
          <h4 className="font-thin">
            Already have an account?
            <span
              className="ml-1 font-semibold text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </h4>
        </div>
      </div>

      {/* Right Side - Image */}
      <RightLayout />
    </div>
  );
};

export default SignUp;
