"use client";
import globalStyles from "@/styles/Global.module.sass";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { global } from "styled-jsx/css";
import { Folder } from "lucide-react";

export interface StudySet {
    title: string;
    instructor: string;
    iconColor: string;
    iconBackgroundColor: string;
}

function StudySetCard({
    set,
    setCurrentCourse,
}: {
    set: StudySet;
    setCurrentCourse: Dispatch<SetStateAction<string | null>>;
}) {
    const router = useRouter();
    return (
        <div
            className={globalStyles.card}
            style={{ marginTop: "1vh" }}
            // TODO: Link this to the right page
            onClick={() => setCurrentCourse(set.title)}
        >
            <div
                className={globalStyles.row}
                style={{ justifyContent: "flex-start" }}
            >
                {/* icon container */}
                <div
                    className={globalStyles.iconContain}
                    style={{ backgroundColor: set.iconBackgroundColor }}
                >
                    <Folder color={set.iconColor} size={24} />
                </div>
                {/* side columns */}
                <div className={globalStyles.column}>
                    <div className={globalStyles.h2}>{set.title}</div>
                    <div className={globalStyles.p}>{set.instructor}</div>
                </div>
            </div>
        </div>
    );
}

export default StudySetCard;
