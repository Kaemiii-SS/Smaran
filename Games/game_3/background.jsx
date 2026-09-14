import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-[#8cb691] overflow-x-hidden">

            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <svg
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    preserveAspectRatio="xMidYMin slice"
                    viewBox="0 0 1440 800"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="paper-shadow-global" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2a402d" floodOpacity="0.12" />
                        </filter>
                    </defs>

                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" filter="url(#paper-shadow-global)" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" filter="url(#paper-shadow-global)" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" filter="url(#paper-shadow-global)" />
                    <path d="M0,0 V100 C250,170 350,70 650,140 C950,210 1050,400 1250,280 C1400,190 1420,120 1440,170 V0 Z" fill="#e3f2e6" filter="url(#paper-shadow-global)" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col">
                <Navbar />
                <Hero />
                <Features />
                <Footer />
            </div>
        </div>
    );
}