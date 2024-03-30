"use client";

import { useRouter } from "next/navigation";

export interface StudySet {
    title: string;
    instructor: string;
}

function StudySetCard({ set }: { set: StudySet }) {
    const router = useRouter();
    return (
        // feel free to remove the styling here
        <div
            style={{ backgroundColor: "gray", margin: "10px" }}
            // TODO: Link this to the right page
            onClick={() => router.push("/browse")}
        >
            <div>{set.title}</div>
            <div>{set.instructor}</div>
        </div>
    );
}

export default StudySetCard;
