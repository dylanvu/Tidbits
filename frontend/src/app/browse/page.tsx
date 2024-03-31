"use client";
import { IDailyTidbit } from "@/components/DailyTidbit";
import Navbar from "@/components/Navbar";
import { StudySet } from "@/components/StudySetCard";
import { useEffect, useState } from "react";
import FoldersUI from "./folders";
import CourseUI from "./course";
import globalStyles from "@/styles/Global.module.sass";
// TODO: fetch this from backend
const sets: StudySet[] = [
    {
        //* pink
        title: "CS50",
        instructor: "Dr. Malan",
        iconColor: "#F400CD",
        iconBackgroundColor: "#FFE7FE",
    },
    {
        //* green
        title: "CPSC 100",
        instructor: "Dr. Malan",
        iconColor: "#28B305",
        iconBackgroundColor: "#DFFFD7",
    },
    {
        //* blue
        title: "COMPSCI 161",
        instructor: "Professor Shindler",
        iconColor: "#00C3DD",
        iconBackgroundColor: "#CAF9FF",
    },
];

// TODO: fetch this from backend
const daily: IDailyTidbit = {
    title: "Bubble sort algorithm",
    course: "CS50",
    duration: 120,
};

export default function Browse() {
    const [currentCourse, setCurrentCourse] = useState<string | null>(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentCourse]);
    return (
        <main className={globalStyles.body}>
            <div className={globalStyles.test}>
                {/* switch the UIs depending on the render state */}
                {currentCourse === null ? (
                    <FoldersUI
                        sets={sets}
                        daily={daily}
                        setCurrentCourse={setCurrentCourse}
                    />
                ) : (
                    <CourseUI
                        course={currentCourse}
                        setCurrentCourse={setCurrentCourse}
                    />
                )}
                <Navbar current="home" setCurrentCourse={setCurrentCourse} />
            </div>
        </main>
    );
}
