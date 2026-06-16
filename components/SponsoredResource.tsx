"use client";

interface SponsoredResourceProps {
  category: string;
}

export default function SponsoredResource({ category }: SponsoredResourceProps) {
  // Map categories to relevant sponsor types
  const getSponsorData = () => {
    switch (category) {
      case "Traffic":
        return {
          title: "Sponsored Local Attorney",
          desc: "Need legal help after an accident? Get a free consultation today.",
          cta: "Call Now",
          icon: "⚖️",
          color: "#D4A200"
        };
      case "Fire & EMS":
      case "Weather":
        return {
          title: "Sponsored Restoration Company",
          desc: "Emergency cleanup and restoration services for fire, water, and storm damage.",
          cta: "Learn More",
          icon: "🏗️",
          color: "#E03C31"
        };
      case "Lost & Found Pets":
        return {
          title: "Sponsored Local Veterinarian",
          desc: "Need help finding or treating a pet? Our clinic is here 24/7.",
          cta: "Contact Clinic",
          icon: "🏥",
          color: "#7B2D8B"
        };
      case "Public Safety":
      case "Community Alerts":
        return {
          title: "Sponsored Home Security Systems",
          desc: "Protect your family and property with 24/7 monitored smart home security.",
          cta: "Get a Quote",
          icon: "🛡️",
          color: "#0D1B3E"
        };
      default:
        return null;
    }
  };

  const ad = getSponsorData();
  
  if (!ad) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden transition-all hover:border-gray-300 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Sponsored Community Resource
        </span>
      </div>
      
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${ad.color}15`, color: ad.color }}
        >
          {ad.icon}
        </div>
        
        <div className="flex-grow">
          <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "Merriweather, serif" }}>
            {ad.title}
          </h4>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {ad.desc}
          </p>
          
          <button 
            className="text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ 
              background: "white", 
              border: `1px solid ${ad.color}40`,
              color: ad.color
            }}
          >
            {ad.cta} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
