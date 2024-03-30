"use client";

import Link from "next/link";
import { useState } from "react";

// TODO: retrieve this from the backend
let tidbitPreviews: { title: string; duration: number }[] = Array.from({
    length: 20,
});

// Fill the array with the same object for testing
tidbitPreviews.fill({
    title: "Bubble Sort",
    duration: 45,
});

// TODO: retrieve this from the backend
const tags = ["algorithms", "data structures", "system design"];

function CourseUI({ course }: { course: string }) {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    return (
        <div>
            <div>{course}</div>
            <div>
                {/* show all the tags associated with the course */}
                {tags.map((tag) => (
                    <button
                        onClick={() => {
                            if (selectedTags.has(tag)) {
                                // remove it
                                const deepClonedSet: Set<string> = new Set(
                                    JSON.parse(
                                        JSON.stringify([...selectedTags]),
                                    ),
                                );
                                deepClonedSet.delete(tag);
                                setSelectedTags(deepClonedSet);
                            } else {
                                // add it
                                // deep clonse
                                const deepClonedSet: Set<string> = new Set(
                                    JSON.parse(
                                        JSON.stringify([...selectedTags, tag]),
                                    ),
                                );
                                setSelectedTags(deepClonedSet);
                            }
                        }}
                        className={selectedTags.has(tag) ? "selected" : ""}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            {tidbitPreviews.map((tidbit, index) => (
                <Link href="/view" key={tidbit.title + `-${index}`}>
                    <img src="./placeholder.png" />
                    <div>{tidbit.title}</div>
                    <div>{tidbit.duration} seconds</div>
                </Link>
            ))}
        </div>
    );
}

export default CourseUI;
