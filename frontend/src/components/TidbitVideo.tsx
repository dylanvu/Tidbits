export interface ITidbitVideo {
    description: string;
    course: string;
    username: string;
    pfp: string;
    song: string;
    tag: string;
    url: string;
}
function TidbitVideo({ tidbit }: { tidbit: ITidbitVideo }) {
    return (
        <div>
            <div>{tidbit.tag}</div>
            <video
                src={tidbit.url}
                autoPlay
                controls
                style={{ width: "auto", height: "70vh" }}
            />
            {/* overlay */}
            <div>
                <div>
                    <img
                        src={tidbit.pfp}
                        draggable={false}
                        style={{ width: "auto", height: "10vh" }}
                    />
                </div>
                <div>
                    {/* username and course */}
                    <div>
                        <span>{tidbit.username}</span>
                        <span className="float-right">{tidbit.course}</span>
                    </div>
                    {/* tidbit description */}
                    <div>{tidbit.description}</div>
                </div>
            </div>
        </div>
    );
}

export default TidbitVideo;
