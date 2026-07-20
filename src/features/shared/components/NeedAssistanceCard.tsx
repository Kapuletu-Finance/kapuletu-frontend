import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IconLibrary from "@/features/shared/components/IconLibrary";

const NeedAssistanceCard = () => {
  return (
    <>
      {/* Full Card View */}
      <Card className="bg-primary border-none shadow-lg text-primary-foreground relative overflow-hidden group-data-[collapsible=icon]:hidden">
        {/* Decorative background arcs */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-background" />
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-2 border-background" />
        </div>

        <CardContent className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-background/10 p-2 rounded-xl">
              <IconLibrary name="help" className="w-6 h-6 text-background" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Need assistance?</h3>
          </div>

          <p className="text-primary-foreground/90 text-sm leading-relaxed">
            Find quick solutions in our <br />
            FAQ center.
          </p>

          <Button variant="secondary" className="font-semibold text-primary hover:bg-background">
            Visit our FAQs Page
          </Button>
        </CardContent>
      </Card>

      {/* Collapsed Icon View */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center shrink-0">
        <div className="flex items-center justify-center size-10 rounded-sm bg-primary text-primary-foreground cursor-pointer hover:opacity-80 transition-opacity">
          <IconLibrary name="help" className="size-5" />
        </div>
      </div>
    </>
  );
};

export default NeedAssistanceCard;
