import Banner728x90 from './Banner728x90';
import Banner320x50 from './Banner320x50';

/**
 * Responsive Leaderboard Ad
 * Shows 728x90 on Desktop/Tablet (md and above)
 * Shows 320x50 on Mobile (below md)
 */
const ResponsiveLeaderboardAd = ({ className = '' }) => {
    return (
        <div className={`w-full max-w-full flex justify-center items-center overflow-hidden ${className}`}>
            <div className="hidden md:flex justify-center w-full max-w-full overflow-hidden">
                <Banner728x90 />
            </div>
            <div className="flex md:hidden justify-center w-full max-w-full overflow-hidden">
                <Banner320x50 />
            </div>
        </div>
    );
};

export default ResponsiveLeaderboardAd;
