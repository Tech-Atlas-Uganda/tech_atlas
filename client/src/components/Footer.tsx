import { Link } from "wouter";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tech Atlas</h3>
            <p className="text-slate-400 text-sm">
              Mapping Uganda's tech ecosystem. Built by the community, for the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition">About</Link></li>
              <li><Link href="/team" className="text-slate-400 hover:text-blue-400 transition">Team</Link></li>
              <li><Link href="/contribute" className="text-slate-400 hover:text-blue-400 transition">Contribute</Link></li>
              <li><Link href="/support" className="text-slate-400 hover:text-blue-400 transition">Support Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-blue-400 transition">Terms of Service</Link></li>
              <li><Link href="/code-of-conduct" className="text-slate-400 hover:text-blue-400 transition">Code of Conduct</Link></li>
              <li><Link href="/governance" className="text-slate-400 hover:text-blue-400 transition">Governance</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="https://github.com/techatlas-ug" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-blue-400 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/techatlas_ug" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/techatlas-ug" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-slate-400 text-sm mt-4 flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> in Uganda
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Tech Atlas. Open source and community-driven.</p>
          <p className="mt-2 text-xs text-slate-500">
            ⚠️ Please conduct due diligence before engaging with any opportunities or hiring through this platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
