import globalStyles from "@/styles/Global.module.sass";
import { ArrowLeft } from "lucide-react";
import { tidbit } from "@/app/browse/course";

function TidbitVideo({ tidbit, active }: { tidbit: tidbit; active: boolean }) {
    return (
        <div>
            {/* heading for reels */}
            <div className={globalStyles.headingRow}>
                <button
                    className={globalStyles.backButton}
                    // onClick={() => setCurrentCourse(null)}
                >
                    <ArrowLeft size={26} />
                </button>
                <div className={globalStyles.p}>{tidbit.tag}</div>
            </div>
            {/* video content */}
            <div className={globalStyles.videoBackground}>
                {active && (
                    <video
                        src={tidbit.videoUrl}
                        // {...(active ? { autoPlay: true } : {})}
                        autoPlay
                        controls
                        loop
                        disablePictureInPicture
                    />
                )}
                {/* overlay */}
                <div className={globalStyles.reelContain}>
                    <div>
                        <img
                            src="./profile.png"
                            draggable={false}
                            style={{
                                width: "6vh",
                                height: "6vh",
                                borderRadius: "100px",
                                overflowY: "hidden",
                            }}
                        />
                    </div>
                    <div className={globalStyles.reelTextContain}>
                        {/* username and course */}
                        <div className={globalStyles.reelsHeading}>
                            <span className={globalStyles.reelText}>
                                <b>@profjasmine</b>
                            </span>
                            <span
                                className={globalStyles.reelText}
                                style={{ opacity: ".5" }}
                            >
                                {tidbit.course}
                            </span>
                        </div>
                        {/* tidbit description */}
                        <div
                            className={globalStyles.reelText}
                            style={{ fontWeight: "400" }}
                        >
                            {tidbit.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TidbitVideo;
