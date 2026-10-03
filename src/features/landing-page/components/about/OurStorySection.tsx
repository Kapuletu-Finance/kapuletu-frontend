import type React from "react";

export const OurStorySection: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-primary font-semibold tracking-wider uppercase text-sm mb-4">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span>How It Started</span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">The KapuLetu Story</h2>
        </div>

        <div className="relative border-l-2 border-primary/30 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/30 -translate-x-1/2"></div>

          <div className="space-y-16">
            {/* Year 1 */}
            <div className="relative md:flex items-center justify-between w-full">
              <div className="absolute -left-10 md:left-1/2 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2 mt-1.5 md:mt-0 ring-4 ring-background z-10"></div>

              <div className="md:w-5/12 mb-4 md:mb-0 md:text-right md:pr-10">
                <span className="text-primary font-bold text-xl block mb-2">The Beginning</span>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  Frustration with Spreadsheets
                </h4>
                <p className="text-muted-foreground">
                  Our founders were treasurers for their own investment clubs. After spending too
                  many weekends trying to match WhatsApp screenshots with bank statements, they
                  decided there had to be an easier way.
                </p>
              </div>
              <div className="md:w-5/12 md:pl-10"></div>
            </div>

            {/* Year 2 */}
            <div className="relative md:flex items-center justify-between w-full flex-row-reverse">
              <div className="absolute -left-10 md:left-1/2 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2 mt-1.5 md:mt-0 ring-4 ring-background z-10"></div>

              <div className="md:w-5/12 mb-4 md:mb-0 md:pl-10">
                <span className="text-primary font-bold text-xl block mb-2">The Solution</span>
                <h4 className="text-xl font-bold text-foreground mb-2">Building KapuLetu</h4>
                <p className="text-muted-foreground">
                  We built the first version of KapuLetu to track our own group's money. When we saw
                  how much time it saved, we shared it with other groups to help them too.
                </p>
              </div>
              <div className="md:w-5/12 md:pr-10 text-left md:text-right"></div>
            </div>

            {/* Year 3 */}
            <div className="relative md:flex items-center justify-between w-full">
              <div className="absolute -left-10 md:left-1/2 w-4 h-4 rounded-full bg-primary md:-translate-x-1/2 mt-1.5 md:mt-0 ring-4 ring-background z-10"></div>

              <div className="md:w-5/12 mb-4 md:mb-0 md:text-right md:pr-10">
                <span className="text-primary font-bold text-xl block mb-2">Today</span>
                <h4 className="text-xl font-bold text-foreground mb-2">Growing Together</h4>
                <p className="text-muted-foreground">
                  Today, KapuLetu helps hundreds of groups—from small family chamas to large
                  associations—manage their money easily and openly.
                </p>
              </div>
              <div className="md:w-5/12 md:pl-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
