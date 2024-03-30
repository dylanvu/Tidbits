"use client";
import DailyTidbit, { IDailyTidbit } from "@/components/DailyTidbit";
import Navbar from "@/components/Navbar";
import StudySetCard, { StudySet } from "@/components/StudySetCard";

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

// TODO: fetch this from backend
const daily: IDailyTidbit = {
    title: "Bubble sort algorithm",
    course: "CS50",
    duration: 120,
};

export default function Browse() {
    return (
        <main>
            <div
                style={{
                    backgroundColor: "gray",
                    marginLeft: "10%",
                    marginRight: "10%",
                }}
            >
                <div>Your Daily Tidbit</div>
                <DailyTidbit tidbit={daily} />
            </div>
            <div>
                {sets.map((set) => {
                    return <StudySetCard set={set} />;
                })}
            </div>
            <Navbar current="home" />
        </main>
    );
}
