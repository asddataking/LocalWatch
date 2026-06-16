export default function AdBanner() {
  return (
    <div
      className="w-full my-6 flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-300 relative overflow-hidden bg-gray-50 group transition-colors hover:border-gray-400 hover:bg-gray-100"
    >
      {/* "Sponsored" Label */}
      <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-bl-lg z-10">
        Sponsored
      </div>
      
      {/* Content */}
      <div className="text-center opacity-70 group-hover:opacity-100 transition-opacity">
        <span className="text-2xl block mb-1">🏷️</span>
        <h3 className="text-sm font-bold text-gray-700">Your Ad Here</h3>
        <p className="text-xs text-gray-500">Support your local community.</p>
        
        {/* Replace this div with actual Google AdSense, Amazon Affiliate, or sponsor banner code */}
        {/* <div dangerouslySetInnerHTML={{ __html: `<!-- Ad Code Here -->` }} /> */}
      </div>
    </div>
  );
}
