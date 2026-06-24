import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold">K</span>
          </div>
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">KapuLetu Finance</h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <ResetPasswordForm />
      </div>

      {/* Footer / Branding */}
      <div className="mt-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} KapuLetu Core Infrastructure. All rights reserved.</p>
        <p className="mt-1 text-xs">Secured by End-to-End Edge Shield</p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
