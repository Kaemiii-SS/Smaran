import React from "react";
import backgroundImage from "./Gemini_Generated_Image_gttwnqgttwnqgttw.png";

export default function LandingPage({ onEnterGame }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans bg-[#8cb691]">

            {/* =========================================================
                BACKGROUND IMAGE
            ========================================================= */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            />

            {/* Dark transparent overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

            {/* =========================================================
                NAVBAR
            ========================================================= */}
            <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-10">

                {/* Logo */}
                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4C7] shadow-lg">
                        <span className="text-2xl">
                            🔎
                        </span>
                    </div>

                    <div>
                        <h2 className="text-lg font-extrabold text-[#214A32]">
                            Find It
                        </h2>

                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#315C3D]">
                            Visual Adventure
                        </p>
                    </div>

                </div>


                {/* Right Badge */}
                <div
                    className="
                        hidden
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/70
                        bg-[#FFF4C7]/90
                        px-5
                        py-2
                        text-sm
                        font-bold
                        text-[#315C3D]
                        shadow-lg
                        backdrop-blur-md
                        sm:flex
                    "
                >
                    <span>🌿</span>
                    <span>Relax & Explore</span>
                </div>

            </header>


            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <main className="relative z-20 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 pb-12">

                <div className="flex w-full max-w-5xl flex-col items-center text-center">

                    {/* =================================================
                        SMALL BADGE
                    ================================================= */}
                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-white/70
                            bg-[#FFF4C7]/90
                            px-5
                            py-2
                            shadow-lg
                            backdrop-blur-md
                            animate-fade-in
                        "
                    >

                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#5D9B63]" />

                        <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#315C3D]">
                            A Game of Observation
                        </span>

                    </div>


                    {/* =================================================
                        MAIN TITLE
                    ================================================= */}
                    <h1
                        className="
                            max-w-4xl
                            text-6xl
                            font-black
                            leading-[0.85]
                            tracking-tight
                            text-[#214A32]
                            drop-shadow-[0_3px_3px_rgba(255,255,255,0.7)]
                            sm:text-8xl
                            lg:text-9xl
                            animate-title
                        "
                    >

                        FIND

                        <span
                            className="
                                block
                                bg-gradient-to-r
                                from-[#214A32]
                                via-[#5D8E50]
                                to-[#315C3D]
                                bg-clip-text
                                text-transparent
                            "
                        >
                            IT
                        </span>

                    </h1>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}
                    <p
                        className="
                            mt-6
                            max-w-xl
                            text-base
                            font-bold
                            leading-relaxed
                            text-[#254936]
                            drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]
                            sm:text-lg
                        "
                    >
                        Explore beautiful scenes, sharpen your attention,
                        and discover hidden objects hiding right in front of you.
                    </p>


                    {/* =================================================
                        FEATURE CARDS
                    ================================================= */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">

                        {/* Feature 1 */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-white/70
                                bg-[#FFF4C7]/90
                                px-5
                                py-3
                                shadow-lg
                                backdrop-blur-md
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                            "
                        >

                            <div className="text-2xl">
                                🧠
                            </div>

                            <p className="mt-1 text-xs font-extrabold text-[#315C3D]">
                                Train Attention
                            </p>

                        </div>


                        {/* Feature 2 */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-white/70
                                bg-[#FFF4C7]/90
                                px-5
                                py-3
                                shadow-lg
                                backdrop-blur-md
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                            "
                        >

                            <div className="text-2xl">
                                🔍
                            </div>

                            <p className="mt-1 text-xs font-extrabold text-[#315C3D]">
                                Find Objects
                            </p>

                        </div>


                        {/* Feature 3 */}
                        <div
                            className="
                                rounded-2xl
                                border
                                border-white/70
                                bg-[#FFF4C7]/90
                                px-5
                                py-3
                                shadow-lg
                                backdrop-blur-md
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:scale-105
                            "
                        >

                            <div className="text-2xl">
                                🌈
                            </div>

                            <p className="mt-1 text-xs font-extrabold text-[#315C3D]">
                                Explore Scenes
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        START BUTTON
                    ================================================= */}
                    <button
                        onClick={onEnterGame}
                        className="
                            group
                            relative
                            mt-9
                            flex
                            items-center
                            gap-4
                            overflow-hidden
                            rounded-full
                            bg-[#315C3D]
                            px-8
                            py-4
                            text-lg
                            font-extrabold
                            text-white
                            shadow-[0_12px_30px_rgba(35,75,50,0.4)]
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:scale-105
                            hover:bg-[#214A32]
                            hover:shadow-[0_18px_40px_rgba(35,75,50,0.5)]
                            active:scale-95
                            sm:px-12
                            sm:py-5
                            sm:text-xl
                        "
                    >

                        {/* Button Shine */}
                        <span
                            className="
                                absolute
                                inset-0
                                -translate-x-full
                                bg-gradient-to-r
                                from-transparent
                                via-white/20
                                to-transparent
                                transition-transform
                                duration-700
                                group-hover:translate-x-full
                            "
                        />


                        {/* Start Icon */}
                        <span
                            className="
                                relative
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-[#F6C85F]
                                text-xl
                                shadow-md
                                transition-all
                                duration-300
                                group-hover:rotate-12
                                group-hover:scale-110
                            "
                        >
                            🚀
                        </span>


                        {/* Button Text */}
                        <span className="relative">
                            Start Adventure
                        </span>

                    </button>


                    {/* =================================================
                        BOTTOM TEXT
                    ================================================= */}
                    <div
                        className="
                            mt-7
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-bold
                            text-[#234B32]
                            drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]
                        "
                    >

                        <span>✨</span>

                        <span>
                            Look closely. Every detail matters.
                        </span>

                        <span>✨</span>

                    </div>

                </div>

            </main>


            {/* =========================================================
                LEFT FLOATING CARD
            ========================================================= */}
            <div
                className="
                    absolute
                    left-[5%]
                    top-[38%]
                    z-10
                    hidden
                    rotate-[-8deg]
                    rounded-2xl
                    border
                    border-white/70
                    bg-[#FFF4C7]/90
                    p-4
                    shadow-xl
                    backdrop-blur-md
                    lg:block
                    animate-float-slow
                "
            >

                <div className="text-3xl">
                    🦋
                </div>

                <p className="mt-1 text-xs font-extrabold text-[#315C3D]">
                    Can you find me?
                </p>

            </div>


            {/* =========================================================
                RIGHT FLOATING CARD
            ========================================================= */}
            <div
                className="
                    absolute
                    right-[6%]
                    top-[30%]
                    z-10
                    hidden
                    rotate-[8deg]
                    rounded-2xl
                    border
                    border-white/70
                    bg-[#FFF4C7]/90
                    p-4
                    shadow-xl
                    backdrop-blur-md
                    lg:block
                    animate-float
                "
            >

                <div className="text-3xl">
                    🌸
                </div>

                <p className="mt-1 text-xs font-extrabold text-[#315C3D]">
                    Look carefully...
                </p>

            </div>


            {/* =========================================================
                DECORATIVE DOTS
            ========================================================= */}
            <div
                className="
                    absolute
                    left-[18%]
                    top-[22%]
                    h-3
                    w-3
                    rounded-full
                    bg-[#FFF4C7]
                    shadow-md
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    right-[20%]
                    top-[25%]
                    h-2
                    w-2
                    rounded-full
                    bg-[#FFF4C7]
                    shadow-md
                    animate-pulse
                "
            />

            <div
                className="
                    absolute
                    bottom-[18%]
                    right-[15%]
                    h-3
                    w-3
                    rounded-full
                    bg-[#FFF4C7]
                    shadow-md
                    animate-pulse
                "
            />


            {/* =========================================================
                ANIMATIONS
            ========================================================= */}
            <style>{`

                @keyframes titleIn {

                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }

                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }

                }


                @keyframes fadeIn {

                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }

                }


                @keyframes float {

                    0%, 100% {
                        transform: translateY(0) rotate(8deg);
                    }

                    50% {
                        transform: translateY(-12px) rotate(8deg);
                    }

                }


                @keyframes floatSlow {

                    0%, 100% {
                        transform: translateY(0) rotate(-8deg);
                    }

                    50% {
                        transform: translateY(-15px) rotate(-8deg);
                    }

                }


                .animate-title {
                    animation: titleIn 1s ease-out forwards;
                }


                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }


                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }


                .animate-float-slow {
                    animation: floatSlow 5s ease-in-out infinite;
                }

            `}</style>

        </div>
    );
}