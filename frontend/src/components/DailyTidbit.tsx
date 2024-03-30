import { useRouter } from "next/navigation";
import globalStyles from "@/styles/Global.module.sass";
import { Clock } from "lucide-react";
export interface IDailyTidbit {
    title: string;
    course: string;
    duration: number;
    image?: string;
}
function DailyTidbit({ tidbit }: { tidbit: IDailyTidbit }) {
    const router = useRouter();
    return (
        <div className={`${globalStyles.test} ${globalStyles.card}`}>
            <div className={globalStyles.h1}>{tidbit.title}</div>
            <div className={globalStyles.p}>{tidbit.course}</div>
            <div className={globalStyles.iconTag}>
                {" "}
                <Clock color={globalStyles.$iconColor} size={48} />
                <p>{tidbit.duration} seconds</p>
            </div>
            <img src="./placeholder.png"></img>
            {/* TODO: link this to the real video */}
            <button
                onClick={() => router.push("/view")}
                className={globalStyles.primary}
            >
                Study now
            </button>
        </div>
    );
}

export default DailyTidbit;
