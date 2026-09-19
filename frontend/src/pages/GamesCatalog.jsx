import { Search, Map, Music, Brain, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GamesCatalog() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse search query
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const games = [
        {
            title: "Find It",
            description: "Enhance your visual search and attention skills by finding hidden objects.",
            icon: <Search className="w-8 h-8 text-emerald-700" />,
            path: "/game/find-it",
            color: "bg-emerald-100"
        },
        {
            title: "Constellation",
            description: "Boost your spatial memory by connecting stars in the correct pattern.",
            icon: <Map className="w-8 h-8 text-blue-700" />,
            path: "/game/constellation",
            color: "bg-blue-100"
        },
        {
            title: "Follow The Rhythm",
            description: "Improve auditory memory and timing by repeating rhythmic sequences.",
            icon: <Music className="w-8 h-8 text-purple-700" />,
            path: "/game/follow-the-rhythm",
            color: "bg-purple-100"
        },
        {
            title: "Recall",
            description: "Test your short-term memory by recalling recently shown items.",
            icon: <Brain className="w-8 h-8 text-orange-700" />,
            path: "/game/recall",
            color: "bg-orange-100"
        },
        {
            title: "See & Say",
            description: "Identify animals and faces by name — builds recognition and language recall.",
            icon: <Eye className="w-8 h-8 text-pink-700" />,
            path: "/game/name-game",
            color: "bg-pink-100"
        }
    ];

    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchQuery) || 
        game.description.toLowerCase().includes(searchQuery)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    return (
        <motion.div 
            className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div>
                <h2 className="text-3xl font-extrabold text-[#0f1912] mb-2">Cognitive Games Library</h2>
                <p className="text-[#1a2e22]/80 font-bold max-w-2xl">
                    Choose from our collection of specialized cognitive games designed to stimulate different areas of your brain.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-gray-500 font-bold text-lg">No games found matching "{searchQuery}"</p>
                        <button onClick={() => navigate('/dashboard/games')} className="mt-4 text-emerald-700 hover:underline font-bold">Clear Search</button>
                    </div>
                ) : (
                    filteredGames.map((game, index) => (
                        <motion.div 
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(game.path)}
                        className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg cursor-pointer flex flex-col h-full group"
                    >
                        <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-md transition-shadow`}>
                            {game.icon}
                        </div>
                        <h3 className="text-xl font-extrabold text-[#0f1912] mb-2">{game.title}</h3>
                        <p className="text-[#1a2e22]/70 font-bold text-sm flex-1">{game.description}</p>
                        
                        <div className="mt-6 flex items-center text-emerald-800 font-extrabold text-sm group-hover:text-emerald-600 transition-colors">
                            Play Now <span className="ml-1 text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
