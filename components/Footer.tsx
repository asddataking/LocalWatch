import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-12 pb-8 text-sm bg-[#0D1B3E] text-white/80 border-t-4 border-[#C8102E]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div>
            <Link href="/" className="inline-block mb-3 text-white no-underline group">
              <span className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ fontFamily: "Merriweather, serif" }}>
                <span className="bg-[#C8102E] text-white w-8 h-8 rounded-md flex items-center justify-center text-lg shadow-sm">★</span>
                LocalWatch
              </span>
            </Link>
            <p className="leading-relaxed opacity-90 mb-4">
              Community-powered neighborhood awareness. Helping you stay informed about what's happening right outside your door.
            </p>
          </div>

          {/* Mini FAQ */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Merriweather, serif" }}>Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <strong className="block text-white mb-1">Are reports anonymous?</strong>
                <p className="text-xs opacity-80">Yes. You can toggle "Submit anonymously" when creating a report. We do not require an account.</p>
              </div>
              <div>
                <strong className="block text-white mb-1">How are reports verified?</strong>
                <p className="text-xs opacity-80">Through community consensus. The more "Confirms" a report gets, the higher its verified status.</p>
              </div>
              <div>
                <strong className="block text-white mb-1">What should I report?</strong>
                <p className="text-xs opacity-80">Safety hazards, traffic issues, lost pets, and suspicious activity. Do not post private information.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "Merriweather, serif" }}>Links</h3>
            <ul className="space-y-2 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Report</Link></li>
              {/* Placeholders for future pages */}
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>
            ⚠️ Do not post personal information, names, or accusations. Report what you observed, not who you think did it.
          </p>
          <p>&copy; {currentYear} LocalWatch. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
