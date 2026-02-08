import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Heart, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);

    try {
      // Insert email subscription into Supabase
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("This email is already subscribed to our newsletter");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully subscribed to our newsletter!");
        setEmail("");
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/50 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.png" alt="Tech Atlas" className="w-8 h-8 rounded-lg" />
              <h3 className="text-white font-bold text-xl font-['Space_Grotesk']">Tech Atlas</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Uganda's open platform for tech ecosystem mapping and community connection. Built by the ecosystem, for the ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/techatlas-ug" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/techatlas_ug" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/techatlas-ug" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/ecosystem" className="text-slate-400 hover:text-blue-400 transition-colors">Ecosystem</Link></li>
              <li><Link href="/jobs" className="text-slate-400 hover:text-blue-400 transition-colors">Jobs & Gigs</Link></li>
              <li><Link href="/learning" className="text-slate-400 hover:text-blue-400 transition-colors">Learning Hub</Link></li>
              <li><Link href="/events" className="text-slate-400 hover:text-blue-400 transition-colors">Events</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/profiles" className="text-slate-400 hover:text-blue-400 transition-colors">People</Link></li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="/team" className="text-slate-400 hover:text-blue-400 transition-colors">Team</Link></li>
              <li><Link href="/contribute" className="text-slate-400 hover:text-blue-400 transition-colors">Contribute</Link></li>
              <li><Link href="/governance" className="text-slate-400 hover:text-blue-400 transition-colors">Governance</Link></li>
              <li><Link href="/support" className="text-slate-400 hover:text-blue-400 transition-colors">Support</Link></li>
              <li><Link href="/forum" className="text-slate-400 hover:text-blue-400 transition-colors">Forum</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest updates on Uganda's tech ecosystem, opportunities, and events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                disabled={isSubscribing}
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isSubscribing ? (
                  "Subscribing..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-slate-800/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link href="/code-of-conduct" className="text-slate-400 hover:text-blue-400 transition-colors">Code of Conduct</Link>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> in Uganda
            </p>
          </div>
          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} Tech Atlas. Open source and community-driven.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              ⚠️ Please conduct due diligence before engaging with any opportunities or hiring through this platform.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
