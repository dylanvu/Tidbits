import globalStyles from "@/styles/Global.module.sass";

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
            <div>{tidbit.tag}</div>
            {active && (
                <video
                    src={tidbit.url}
                    // {...(active ? { muted: true } : {})}
                    autoPlay
                    controls
                    style={{ width: "auto", height: "70vh" }}
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
    );
}

export default TidbitVideo;
