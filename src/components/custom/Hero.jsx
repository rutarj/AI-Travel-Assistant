import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => {
    return (
        <div className="flex flex-col items-center md:mx-48 lg:mx-96 gap-9">
            <h1 className="text-center font-semibold text-[32px] md:text-[36px] lg:text-[40px] mt-10">
                <span className="text-[#f56551]">
                    Discover your Next Adventure with AI: <br />
                </span>
                Personalized Itineraries at your fingertips
            </h1>
            
            <p className="text-center text-sm md:text-base lg:text-lg">
                Plan the perfect getaway with our personalized trip planner. Explore, book, and enjoy your dream vacation.
            </p>

            <Link to={'/create-trip'}>
                <Button>
                    Get Started. It's free
                </Button>
            </Link>
        </div>
    );
};

export default Hero;
