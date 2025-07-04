import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

const Home = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            <NavBar />
            {/* Hero Section - FarmrSwap Style */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 pt-20 pb-8 flex-1 relative">
                {/* Tomato Farmer (left) */}
                <div className="flex-1 flex flex-col items-center md:items-start z-10">
                    <span className="text-[10rem] md:text-[14rem]">🍅</span>
                    {/* You can replace the emoji with an SVG for a real mascot */}
                </div>
                {/* Floating Tomatoes */}
                <div className="absolute left-1/3 top-10 text-5xl rotate-[-10deg] opacity-80">🍅</div>
                <div className="absolute right-20 top-0 text-4xl rotate-[15deg] opacity-80">🍅</div>
                <div className="absolute right-40 bottom-32 text-6xl rotate-[-5deg] opacity-80">🍅</div>
                <div className="absolute left-1/2 bottom-10 text-5xl rotate-[8deg] opacity-80">🍅</div>
                {/* Slogan (right) */}
                <div className="flex-1 flex flex-col items-center md:items-end justify-center z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d3e3e] drop-shadow-lg text-right tracking-wide" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                        SWAP.<br />
                        STAKE AND EARN. WIN.
                    </h1>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home