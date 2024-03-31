"use client";
import globalStyles from "@/styles/Global.module.sass";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { global } from "styled-jsx/css";

export interface StudySet {
    title: string;
    instructor: string;
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
        // feel free to remove the styling here
        <div
            className={globalStyles.card}
            // TODO: Link this to the right page
            onClick={() => setCurrentCourse(set.title)}
        >
            <div className={globalStyles.h2}>{set.title}</div>
            <div className={globalStyles.p}>{set.instructor}</div>
        </div>
    );
}

export default StudySetCard;
