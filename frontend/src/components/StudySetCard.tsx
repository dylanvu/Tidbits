"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

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
            style={{
                backgroundColor: "gray",
                margin: "10px",
                cursor: "pointer",
            }}
            // TODO: Link this to the right page
            onClick={() => setCurrentCourse(set.title)}
        >
            <div>{set.title}</div>
            <div>{set.instructor}</div>
        </div>
    );
}

export default StudySetCard;
