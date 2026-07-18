import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

export const LandingFooter = () => {
  return (
    <footer className="w-full pt-16 pb-8 bg-refined-blue text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SiteLogo
                variant="full"
                className="text-2xl text-primary-foreground"
                logoClassName="h-[1em] w-[1em] text-primary-foreground"
              />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-xs">
              KapuLetu is a secure group finance platform that helps treasurers and fundraising
              committees manage contributions, track money transparently, and build financial trust.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon
                url="https://facebook.com"
                style={{ height: 32, width: 32 }}
                bgColor="#ffffff20"
                fgColor="#ffffff"
              />
              <SocialIcon
                url="https://linkedin.com"
                style={{ height: 32, width: 32 }}
                bgColor="#ffffff20"
                fgColor="#ffffff"
              />
              <SocialIcon
                url="https://x.com"
                style={{ height: 32, width: 32 }}
                bgColor="#ffffff20"
                fgColor="#ffffff"
              />
              <SocialIcon
                url="https://instagram.com"
                style={{ height: 32, width: 32 }}
                bgColor="#ffffff20"
                fgColor="#ffffff"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <span className="font-semibold text-primary-foreground">Support:</span>{" "}
                support@kapuletu.co.ke
              </li>
              <li>
                <span className="font-semibold text-primary-foreground">Info:</span>{" "}
                info@kapuletu.co.ke
              </li>
              <li>
                <span className="font-semibold text-primary-foreground">Phone:</span> +254143933472
              </li>
              <li>
                <span className="font-semibold text-primary-foreground">Location:</span> Nairobi,
                Kenya
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>
                <Link href="/blogs" className="hover:text-primary-foreground transition-colors">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link href="#faqs" className="hover:text-primary-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ready to Start?</h3>
            <p className="text-sm text-primary-foreground/80 mb-6">
              Create your group today and experience transparent, secure financial management.
            </p>
            <Link href="/sign-up">
              <Button>Create Your Group</Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} KapuLetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
