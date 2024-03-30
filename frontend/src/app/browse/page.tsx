"use client";
import Navbar from "@/components/Navbar";
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
    return (
        <main>
            <div>
                {sets.map((set) => {
                    return <StudySetCard set={set} />;
                })}
            </div>
            <Navbar current="home" />
        </main>
    );
}
