import DailyTidbit, { IDailyTidbit } from "@/components/DailyTidbit";
import StudySetCard, { StudySet } from "@/components/StudySetCard";
import { Dispatch, SetStateAction } from "react";
import globalStyles from "@/styles/Global.module.sass";
import { Search } from "lucide-react";
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
        //* home page when no card is selected
        <main>
            <div className={globalStyles.neighbors}>
                {/* style={{gap:"22px"}} */}
                {/* search */}
                <div className={globalStyles.container}>
                    <div className={globalStyles.p}>Find a topic</div>
                    <div className={globalStyles.search}>
                        <Search size={28} />
                        <div className={globalStyles.p}>Find a topic</div>
                    </div>
                </div>
                {/* daily tidbit */}
                <div className={globalStyles.container}>
                    <div className={globalStyles.p}>Your daily tidbit</div>
                    <DailyTidbit tidbit={daily} />
                </div>
                {/* classes content */}
                <div>
                    <div className={globalStyles.p}>Your study library</div>
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
        </main>
    );
}

export default FoldersUI;
