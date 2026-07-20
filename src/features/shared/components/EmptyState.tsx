import { Search } from "lucide-react";

interface EmptyStateProps {
  message: string;
  Cta?: React.ReactElement;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, Cta }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-background p-8 text-center space-y-4">
      <div className="rounded-md bg-primary/5 p-4">
        <Search className="w-10 h-10 text-primary" strokeWidth={1.5} />
      </div>
      <p className="text-muted-foreground font-medium text-lg">{message}</p>
      {Cta && <div className="mt-2">{Cta}</div>}
    </div>
  );
};

export default EmptyState;
