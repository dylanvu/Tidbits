import DailyTidbit, { IDailyTidbit } from "@/components/DailyTidbit";
import StudySetCard, { StudySet } from "@/components/StudySetCard";
import { Dispatch, SetStateAction } from "react";
import globalStyles from "@/styles/Global.module.sass";
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
            <div className={globalStyles.container}>
                <div className={globalStyles.p}>Your Daily Tidbit</div>
                <DailyTidbit tidbit={daily} />
            </div>

            <div>
                {sets.map((set, index) => {
                    return (
                        <StudySetCard
                            set={set}
                            setCurrentCourse={setCurrentCourse}
                            key={`${set.title}-${set.instructor}-${index}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default FoldersUI;
