import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function Dashboard() {
    return (
        <div className="relative flex h-screen bg-[#8cb691] overflow-hidden" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            
            {/* Optimized SVG Background - Removed feDropShadow filter */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80">
                <svg className="absolute top-0 left-0 w-full h-full object-cover" preserveAspectRatio="xMidYMin slice" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
                    {/* Standard paths without the heavy SVG filter */}
                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" />
                </svg>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <Topbar />
                
                {/* Added 'will-change-scroll' and 'transform-gpu' to force hardware 
                  acceleration on the scrolling container 
                */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 transform-gpu will-change-scroll custom-scrollbar">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
}