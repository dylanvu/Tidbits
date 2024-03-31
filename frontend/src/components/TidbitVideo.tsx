import globalStyles from "@/styles/Global.module.sass";
import { ArrowLeft } from "lucide-react";
export interface ITidbitVideo {
    description: string;
    course: string;
    username: string;
    pfp: string;
    song: string;
    tag: string;
    url: string;
}
function TidbitVideo({
    tidbit,
    active,
}: {
    tidbit: ITidbitVideo;
    active: boolean;
}) {
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
                        src={tidbit.url}
                        // {...(active ? { autoPlay: true } : {})}
                        autoPlay
                        controls
                        style={{
                            width: "auto",
                            top: "40vh",
                            height: "80vh",
                            overflowY: "hidden",
                        }}
                        loop
                        disablePictureInPicture
                    />
                )}
                {/* overlay */}
                <div className={globalStyles.reelContain}>
                    <div>
                        <img
                            src={tidbit.pfp}
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
                                <b>{tidbit.username}</b>
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
