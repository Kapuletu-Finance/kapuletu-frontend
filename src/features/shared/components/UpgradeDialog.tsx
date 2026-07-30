import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

const UpgradeDialog = () => {
  return (
    <Card className="max-w-md w-full mx-auto border-none">
      <CardContent className="flex flex-col items-center text-center space-y-6">
        <SiteLogo />

        <div className="bg-primary/10 p-4 rounded-full">
          <IconLibrary name="gem" className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            You've discovered a premium feature!
          </h2>
          <p className="text-muted-foreground text-sm">
            Upgrade to manage your group funds <br />
            without any limits.
          </p>
        </div>

        <div className="w-full space-y-3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold">
            Upgrade Now
          </Button>
          <Button
            variant="ghost"
            className="w-full py-6 text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeDialog;
