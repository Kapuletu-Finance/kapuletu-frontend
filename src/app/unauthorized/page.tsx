import { ErrorStateUI } from "@/features/shared/components/ErrorStateUI";

const UnauthorizedPage = () => {
  return (
    <ErrorStateUI
      statusCode={403}
      title="Access Denied"
      message="You do not have permission to view this page or perform this action. If you believe this is a mistake, please contact support or upgrade your plan."
      actionLabel="Go to Dashboard"
      actionHref="/dashboard"
    />
  );
};

export default UnauthorizedPage;
