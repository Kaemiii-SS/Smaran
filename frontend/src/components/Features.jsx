import { motion } from 'framer-motion';
import feature1 from '../assets/feature1.png';
import feature2 from '../assets/feature2.png';
import feature3 from '../assets/feature3.png';
import feature4 from '../assets/feature4.png';
import feature5 from '../assets/feature5.png';
import feature6 from '../assets/feature6.png';

const featuresData = [
    {
        title: "Memory Training Games",
        description: "Engages patients with adaptive exercises like memory card matching using familiar photos, object recognition, sequence memory, and daily life association.",
        image: feature1
    },
    {
        title: "AI Rehabilitation Chatbot",
        description: "Delivers purpose-built cognitive rehabilitation, communication practice, and emotional support within a securely guardrailed environment.",
        image: feature2
    },
    {
        title: "Voice-Assisted Daily Companion",
        description: "Provides structured voice and visual reminders for medication, meals, and appointments, allowing patients to conversationally ask what to do next.",
        image: feature3
    },
    {
        title: "Navigation & Safe Return",
        description: "Protects patients outside the home using an emergency button, safe-zone geofencing alerts, and inactivity detection.",
        image: feature4
    },
    {
        title: "Centralized Caregiver Dashboard",
        description: "Enables staff to monitor 10 to 25 patients simultaneously with scannable rosters and drill-down analytics for recent activity.",
        image: feature5
    },
    {
        title: "Adaptive AI Personalization",
        description: "Automatically adjusts the difficulty of the memory games and the chatbot's complexity based on the patient's rolling performance and sustained success.",
        image: feature6
    }
];

export default function Features() {
    return (
        <section className="relative py-16 lg:py-24 z-10 overflow-hidden">
            <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <h2 
                        className="text-3xl sm:text-4xl font-extrabold text-[#0f1912] mb-4"
                        style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: "-0.02em" }}
                    >
                        Comprehensive Care Platform
                    </h2>
                    <p 
                        className="text-sm sm:text-base font-bold text-[#1a2e22] max-w-xl mx-auto"
                        style={{ fontFamily: "'Courier New', Courier, monospace" }}
                    >
                        Purpose-built modules to support patients and empower caregivers.
                    </p>
                </motion.div>

                <div className="space-y-20 lg:space-y-32">
                    {featuresData.map((feature, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div 
                                key={index} 
                                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <motion.div 
                                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="flex-1 w-full lg:w-1/2 text-center lg:text-left"
                                >
                                    <div className="inline-flex items-center justify-center w-10 h-10 mb-5 rounded-full bg-white/50 text-[#0f1912] font-extrabold border border-white/60 backdrop-blur-md shadow-sm text-sm" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        0{index + 1}
                                    </div>
                                    <h3 
                                        className="text-2xl lg:text-3xl font-extrabold text-[#0f1912] mb-4 leading-tight"
                                        style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: "-0.02em" }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p 
                                        className="text-sm lg:text-base font-bold leading-relaxed text-[#1a2e22] opacity-90 max-w-lg mx-auto lg:mx-0"
                                        style={{ fontFamily: "'Courier New', Courier, monospace" }}
                                    >
                                        {feature.description}
                                    </p>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                    className="flex-1 w-full lg:w-1/2 flex justify-center"
                                >
                                    <div className="relative w-full max-w-md lg:max-w-lg rounded-[2.5rem] bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-xl border border-white/60 p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(15,25,18,0.1)] aspect-[4/3] flex items-center justify-center overflow-hidden group">
                                         
                                         <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-white/5 to-transparent opacity-80 pointer-events-none rounded-[2.5rem]"></div>
                                         
                                         <img 
                                            src={feature.image} 
                                            alt={feature.title} 
                                            className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:scale-[1.03] transition-all duration-500 ease-out"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </section>
    );
}