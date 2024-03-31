export interface ITidbitVideo {
    description: string;
    course: string;
    username: string;
    pfp: string;
    song: string;
    tag: string;
}
function TidbitVideo({ tidbit }: { tidbit: ITidbitVideo }) {
    return (
        <div>
            <div>{tidbit.tag}</div>
            <video src="./bubble_sort.mp4" autoPlay controls />
            {/* overlay */}
            <div>
                <div>
                    <img src={tidbit.pfp} draggable={false} />
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
