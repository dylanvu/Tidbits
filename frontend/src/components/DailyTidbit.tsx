import { useRouter } from "next/navigation";
import globalStyles from "@/styles/Global.module.sass";
export interface IDailyTidbit {
    title: string;
    course: string;
    duration: number;
    image?: string;
}
function DailyTidbit({ tidbit }: { tidbit: IDailyTidbit }) {
    const router = useRouter();
    return (
        <div className={globalStyles.test}>
            <div>{tidbit.title}</div>
            <div>{tidbit.course}</div>
            <div>{tidbit.duration} seconds</div>
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
