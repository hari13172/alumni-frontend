import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { api } from "@/api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { motion, type Variants } from "framer-motion";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onCancel: () => void;
}

const AdminLogin = ({ onLogin, onCancel }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${api.ADMIN_BASE_URL}/login`, {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("adminToken", token);
      setIsLoading(false);
      toast.success("Login successful!");
      onLogin(true);
      navigate("/admin/panel");
    } catch (err: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred during login");
      } else {
        setError("An error occurred during login");
      }
    }
  };

  // Framer Motion variants for the main card
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Variants for the form (staggered children)
  const formVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for individual form items and buttons
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Variants for the password toggle icon
  const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Variants for button hover effect
  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center space-y-1">
            <motion.div
              variants={itemVariants}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="h-8 w-8 text-blue-600" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <p className="text-gray-600">
                Enter your credentials to access the admin panel
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  variants={itemVariants}
                  className="text-red-600 text-sm text-center bg-red-50 p-2 roundedPl rounded"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                className="flex space-x-3"
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;