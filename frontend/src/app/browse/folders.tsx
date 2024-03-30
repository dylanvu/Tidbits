import DailyTidbit, { IDailyTidbit } from "@/components/DailyTidbit";
import StudySetCard, { StudySet } from "@/components/StudySetCard";
import { Dispatch, SetStateAction } from "react";

function FoldersUI({
    sets,
    daily,
    setCurrentCourse,
}: {
    sets: StudySet[];
    daily: IDailyTidbit;
    setCurrentCourse: Dispatch<SetStateAction<string | null>>;
}) {
    return (
        <div>
            <div
                style={{
                    backgroundColor: "gray",
                    marginLeft: "10%",
                    marginRight: "10%",
                }}
            >
                <div>Your Daily Tidbit</div>
                <DailyTidbit tidbit={daily} />
            </div>
            <div>
                {sets.map((set) => {
                    return (
                        <StudySetCard
                            set={set}
                            setCurrentCourse={setCurrentCourse}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default FoldersUI;
