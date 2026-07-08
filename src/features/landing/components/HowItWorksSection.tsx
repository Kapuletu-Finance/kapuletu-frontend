export const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <span className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80 mb-4 block">
          How KapuLetu Works
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-16">
          Three steps to smarter group finance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-primary-foreground/20 z-0"></div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-background text-primary flex items-center justify-center text-5xl font-black mb-8 shadow-xl rotate-[-5deg]">
              1
            </div>
            <h3 className="text-xl font-bold mb-4">Create your group</h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xs text-balance">
              Register your chama or group and invite members to join your secure financial
              workspace.
            </p>
          </div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-background text-primary flex items-center justify-center text-5xl font-black mb-8 shadow-xl rotate-2">
              2
            </div>
            <h3 className="text-xl font-bold mb-4">Set your rules</h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xs text-balance">
              Define contribution schedules, loan policies, interest rates, and member roles.
            </p>
          </div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-background text-primary flex items-center justify-center text-5xl font-black mb-8 shadow-xl -rotate-3">
              3
            </div>
            <h3 className="text-xl font-bold mb-4">Start managing funds</h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-xs text-balance">
              Members can easily contribute, track their balances, request loans, and view reports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
