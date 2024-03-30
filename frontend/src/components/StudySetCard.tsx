export interface StudySet {
    title: string;
    instructor: string;
}

function StudySetCard({ set }: { set: StudySet }) {
    return (
        <div style={{ backgroundColor: "blue", margin: "10px" }}>
            <div>{set.title}</div>
            <div>{set.instructor}</div>
            {/* // TODO: Link this to the right page */}
            <button>Study All</button>
        </div>
    );
}

export default StudySetCard;
