import { ErrorStateUI } from "@/features/shared/components/ErrorStateUI";

const NotFoundPage = () => {
  return (
    <ErrorStateUI
      statusCode={404}
      title="Page not found"
      message="Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track."
      actionLabel="Return Home"
      actionHref="/"
    />
  );
};

export default NotFoundPage;
