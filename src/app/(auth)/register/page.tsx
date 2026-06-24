import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">KapuLetu</h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
