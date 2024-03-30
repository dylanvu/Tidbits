"use client";
import StudySetCard, { StudySet } from "@/components/StudySetCard";
import { useRouter } from "next/navigation";

// TODO: fetch this from backend
const sets: StudySet[] = [
    {
        title: "CS50",
        instructor: "Dr. Malan",
    },
    {
        title: "CPSC 100",
        instructor: "Dr. Malan",
    },
    {
        title: "COMPSCI 161",
        instructor: "Professor Shindler",
    },
];

export default function Browse() {
    const router = useRouter();
    return (
        <main>
            <div>
                Here is where you would look at the reel organization structure
                and view reels
            </div>
            {sets.map((set) => {
                return <StudySetCard set={set} />;
            })}
        </main>
    );
}
