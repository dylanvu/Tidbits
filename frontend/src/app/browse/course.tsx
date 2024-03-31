"use client";

import axios from "axios";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

axios.defaults.baseURL = "https://tidbits.onrender.com";

interface preview {
    title: string;
    duration: number;
    url: string;
    vid: string;
    tag: string | null;
}

// TODO: retrieve this from the backend
const tags = ["algorithms", "data structures", "system design"];

function CourseUI({
    course,
    setCurrentCourse,
}: {
    course: string;
    setCurrentCourse: Dispatch<SetStateAction<string | null>>;
}) {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [previews, setPreviews] = useState<preview[]>([]);
    useEffect(() => {
        // retrieve all the reel data associated with the user
        axios.get("reels/info?uid=test").then((res) => {
            // now, we have to iterate through all of the reels and display their preview images
            const data = res.data;
            console.log(data);
            for (const tidbitData of data) {
                axios
                    .get(`thumbnail?vid=${tidbitData.id}`, {
                        responseType: "blob",
                    })
                    .then((res) => {
                        const thumbnailData = res.data;
                        const url = URL.createObjectURL(thumbnailData);

                        // set the state through a functional update to avoid concurrency issues
                        setPreviews((prevPreviews) => {
                            const newPreview = {
                                title: tidbitData.name,
                                duration: tidbitData.duration_seconds,
                                vid: tidbitData.id,
                                url: url,
                                tag: thumbnailData.tag ?? null,
                            };
                            return [...prevPreviews, newPreview];
                        });
                    });
            }
        });
    }, []);
    useEffect(() => {
        console.log(selectedTags);
    }, [selectedTags]);
    return (
        <div>
            <div>
                <button onClick={() => setCurrentCourse(null)}>{"<--"}</button>
                &nbsp;&nbsp;{course}
            </div>
            <div>
                {/* show all the tags associated with the course */}
                {tags.map((tag, index) => (
                    <button
                        key={`${tag}-${index}`}
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
                                // deep clone
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
            {previews.map((preview, index) => {
                // filter through the tidbits for any selected tag
                if (
                    selectedTags.size > 0 &&
                    (preview.tag === null || !selectedTags.has(preview.tag))
                ) {
                    return null;
                }
                return (
                    <Link
                        href={`/view?vid=${preview.vid}`}
                        key={`preview-${preview.vid}-${index}`}
                    >
                        <img src={preview.url} />
                        <div>{preview.title}</div>
                        <div>{preview.duration} seconds</div>
                    </Link>
                );
            })}
        </div>
    );
}

export default CourseUI;
