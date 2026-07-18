export const getTierStyles = (id: string) => {
  switch (id) {
    case "basic":
      return {
        titleColor: "text-foreground",
        iconColor: "text-muted-foreground",
        borderColor: "border-muted-foreground",
        radioClass:
          "data-checked:bg-foreground data-checked:border-foreground dark:data-checked:bg-foreground",
        btnClass:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground w-full tracking-wider font-semibold",
      };
    case "bronze":
      return {
        titleColor: "text-burnt-amber",
        iconColor: "text-burnt-amber",
        borderColor: "border-burnt-amber",
        radioClass:
          "data-checked:bg-burnt-amber data-checked:border-burnt-amber dark:data-checked:bg-burnt-amber",
        btnClass:
          "bg-burnt-amber hover:bg-burnt-amber/90 text-white w-full tracking-wider font-semibold",
      };
    case "silver":
      return {
        titleColor: "text-primary",
        iconColor: "text-primary",
        borderColor: "border-primary",
        radioClass:
          "data-checked:bg-primary data-checked:border-primary dark:data-checked:bg-primary",
        btnClass:
          "bg-primary hover:bg-primary/90 text-primary-foreground w-full tracking-wider font-semibold",
      };
    case "gold":
      return {
        titleColor: "text-refined-blue",
        iconColor: "text-refined-blue",
        borderColor: "border-refined-blue",
        radioClass:
          "data-checked:bg-refined-blue data-checked:border-refined-blue dark:data-checked:bg-refined-blue",
        btnClass:
          "bg-refined-blue hover:bg-refined-blue/90 text-white w-full tracking-wider font-semibold",
      };
    default:
      return {
        titleColor: "text-foreground",
        iconColor: "text-primary",
        borderColor: "border-primary",
        radioClass:
          "data-checked:bg-primary data-checked:border-primary dark:data-checked:bg-primary",
        btnClass: "w-full",
      };
  }
};
