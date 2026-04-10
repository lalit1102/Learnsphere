import images from "@/assets/assets";
import UniversalUserForm from "@/components/auth/UniversalUserForm";
import { useAuth } from "@/context/AuthContext";
import { School } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
 
  const { user, loading, login } = useAuth();

  const handleLoginSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Login Successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  if (user && !loading) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <School className="size-4" />
            </div>
            Learnsphere.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* અહીં onSubmit અને pending પ્રોપ્સ પાસ કર્યા છે */}
            <UniversalUserForm
              type="login"
              onSubmit={handleLoginSubmit}
              pending={loading}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={images.loginimage}
          alt="Login Visual"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Login;