const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-light py-5 px-6 mt-12 w-full">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6 text-[10px] text-text-secondary leading-relaxed font-light">

        {/* Pillar 1 */}
        <div className="flex items-center gap-2">
          <span className="text-sm">🛡️</span>
          <div>
            <p className="font-bold text-text-primary uppercase tracking-wider text-[9px]">Secure Payment</p>
            <p className="text-[10px]">100% secure checkout protection</p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="flex items-center gap-2">
          <span className="text-sm">🔄</span>
          <div>
            <p className="font-bold text-text-primary uppercase tracking-wider text-[9px]">Easy Returns</p>
            <p className="text-[10px]">30-day return window</p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="flex items-center gap-2">
          <span className="text-sm">🎧</span>
          <div>
            <p className="font-bold text-text-primary uppercase tracking-wider text-[9px]">24/7 Support</p>
            <p className="text-[10px]">Dedicated customer help center</p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="flex items-center gap-2">
          <span className="text-sm">⭐️</span>
          <div>
            <p className="font-bold text-text-primary uppercase tracking-wider text-[9px]">Trusted by Thousands</p>
            <p className="text-[10px]">4.8 overall user rating</p>
          </div>
        </div>

        {/* Brand Copyright */}
        <p className="w-full sm:w-auto text-center sm:text-right text-[9px] text-text-secondary border-t sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
          &copy; {new Date().getFullYear()} Shopsphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
