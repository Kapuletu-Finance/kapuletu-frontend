import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const TeamSection: React.FC = () => {
  const team = [
    {
      name: "Alex Mwangi",
      role: "Co-Founder & CEO",
      bio: "Former investment banker who spent years managing local investment clubs. Built KapuLetu out of sheer frustration with spreadsheets.",
      social: "#",
    },
    {
      name: "Sarah Kioko",
      role: "Co-Founder & CTO",
      bio: "A security fanatic and distributed systems engineer. Ensures every KapuLetu ledger is mathematically immutable and unhackable.",
      social: "#",
    },
    {
      name: "David Ochieng",
      role: "Head of Product",
      bio: "Obsessed with radical simplicity. David's goal is to make KapuLetu so easy to use that even your grandmother can be a treasurer.",
      social: "#",
    },
  ];

  return (
    <section className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet the Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are a team of finance nerds, security engineers, and community organizers dedicated
            to solving the trust gap in group finance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-full h-64 bg-muted flex items-center justify-center relative overflow-hidden">
                {/* Fallback avatar if no image */}
                <IconLibrary name="user" className="w-20 h-20 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={member.social}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:scale-110 transition-transform"
                  >
                    <IconLibrary name="globe" className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-foreground mb-1">{member.name}</h4>
                <span className="text-sm font-semibold text-primary block mb-4">{member.role}</span>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
