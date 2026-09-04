import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center z-0">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10 pt-16 w-full">
                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    
                    <div className="max-w-[460px] mx-auto text-center lg:text-left lg:ml-auto lg:mr-0 pr-0">
                        <p className="text-[10px] sm:text-xs font-extrabold tracking-widest text-[#1a2e22] uppercase drop-shadow-sm mb-3 font-mono">
                            AI-Powered Dementia Care & Cognitive Rehabilitation
                        </p>
                        
                        <h1 
                            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#0f1912] leading-[1.1] mb-5" 
                            style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: "-0.02em" }}
                        >
                            Empowering memory and daily independence
                        </h1>
                        
                        <p 
                            className="text-sm sm:text-base font-bold leading-relaxed text-[#1a2e22] mb-8" 
                            style={{ fontFamily: "'Courier New', Courier, monospace" }}
                        >
                            An integrated platform supporting patients with cognitive rehabilitation and daily assistance, while giving caregivers a centralized, low-noise monitoring dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/register" title="Get started" className="group inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-[#0f1912] border border-transparent rounded-[2rem] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg shadow-gray-900/20 font-sans" style={{ fontFamily: "'Courier New', Courier, monospace" }} role="button">
                                Get started
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[480px] mx-auto mt-6 lg:mt-0 lg:ml-auto">
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl -z-10 transform scale-100"></div>
                        <img 
                            className="w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                            src={heroImage} 
                            alt="Dementia care illustration" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}