export default function BackgroundWaves() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-sage-lightest">
      {/* Top Wave */}
      <svg className="absolute top-0 left-0 w-full text-sage-light" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,138.7C672,149,768,203,864,224C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
      {/* Bottom Waves */}
      <svg className="absolute bottom-0 left-0 w-full text-sage-medium opacity-50" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" fillOpacity="1" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <svg className="absolute bottom-0 left-0 w-full text-sage-dark opacity-30 h-[20vh]" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" fillOpacity="1" d="M0,192L48,208C96,224,192,256,288,256C384,256,480,224,576,202.7C672,181,768,171,864,181.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}
