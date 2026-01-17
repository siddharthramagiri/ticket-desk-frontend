import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../../components/ui/button";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TicketsPlane as Ticket } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      setUser(userData);

      // Redirect based on role
      if (userData.roles.includes("ADMIN")) navigate("/admin");
      else if (userData.roles.includes("DEVELOPER")) navigate("/developer");
      else if (userData.roles.includes("SUPPORT")) navigate("/support");
      else navigate("/client");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold">Ticket Desk</span>
            </div>
            <h2 className="mt-6 text-3xl font-thin">Welcome back,</h2>
            <h4 className="font-thin">Login to continue</h4>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleLogin}>
              <Input
                className="border border-gray-300 bg-white text-gray-900"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <Input
                className="border border-gray-300 bg-white text-gray-900"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <Button
                variant="outline"
                className="text-white bg-blue-500 border-none hover:bg-blue-600 hover:text-white"
                type="submit"
              >
                Login
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">Or</span>
              </div>
            </div>

            <div>
              <h4 className="font-thin">
                Don't have an account? 
                <span
                  className="ml-1 font-semibold text-blue-500 hover:cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-90"></div>
        <img
          src="Logo.png"
          alt="Ticket Desk"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-gray-900">
          <h2 className="mb-4 text-3xl font-bold">Jira Inspired Ticketing System</h2>
          <p className="max-w-md text-center text-lg">"Make Development faster"</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
