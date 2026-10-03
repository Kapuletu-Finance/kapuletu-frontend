import Image from "next/image";
import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const TrustAndSecuritySection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-zinc-950 text-zinc-50 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-primary font-semibold tracking-wider uppercase text-sm">
              <IconLibrary name="shield" className="w-4 h-4" />
              <span>Trust & Security</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Enterprise-Grade Protection for Community Funds
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              We take the security of your financial data as seriously as a bank would. Our platform
              is built from the ground up with security, privacy, and immutability in mind.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                "End-to-End Encryption for all data at rest and in transit.",
                "Immutable ledger technology ensures transactions cannot be secretly altered.",
                "Role-based access control prevents unauthorized dashboard access.",
                "Regular third-party security audits and compliance checks.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <IconLibrary name="check" className="w-3 h-3" />
                  </div>
                  <span className="text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="aspect-square relative w-full max-w-md mx-auto">
              <Image
                src="/images/about/security.jpg"
                alt="High-tech security vault"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
