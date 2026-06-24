import { LoginCard } from "@/features/auth/components/LoginCard";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">KapuLetu Finance</h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginCard />
      </div>
    </div>
  );
};

export default LoginPage;
