"use client";

import axios from "axios";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import globalStyles from "@/styles/Global.module.sass";
import { ArrowLeft } from "lucide-react";
import ScrollableCarousel from "@/components/ScrollableCarousel";
axios.defaults.baseURL = "https://tidbits.onrender.com";
export interface tidbit {
    title: string;
    duration: number;
    imageUrl: string;
    vid: string;
    tag: string | null;
    description: string;
    course: string;
    videoUrl: string;
}

export interface ITidbitVideo {
    // description: string;
    // course: string;
    // username: string;
    // pfp: string;
    // song: string;
    // tag: string;
    // videoUrl: string;
}

// TODO: retrieve this from the backend
// test for jasmine
const tags = ["algorithms", "data structures", "system design"];

function CourseUI({
    course,
    setCurrentCourse,
}: {
    course: string;
    setCurrentCourse: Dispatch<SetStateAction<string | null>>;
}) {
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [previews, setPreviews] = useState<tidbit[]>([]);
    const [vid, setVid] = useState<string | null>(null);
    // format the course to be compatible with query data
    let sanitizedCourse = course.replaceAll(" ", "%20");
    useEffect(() => {
        // retrieve all the reel data associated with the user
        axios
            .get(`reels/info?uid=test&course=${sanitizedCourse}`)
            .then((res) => {
                // now, we have to iterate through all of the reels and display their preview images
                const data = res.data;
                console.log(data);
                for (const tidbitData of data) {
                    axios
                        .get(`thumbnail?vid=${tidbitData.id}`, {
                            responseType: "blob",
                        })
                        .then(async (res) => {
                            const thumbnailData = res.data;
                            const url = URL.createObjectURL(thumbnailData);

                            const reelRes = await axios.get(
                                `reel?vid=${tidbitData.id}`,
                                {
                                    responseType: "blob",
                                },
                            );

                            const reelData = reelRes.data;
                            const reelUrl = URL.createObjectURL(reelData);

                            // set the state through a functional update to avoid concurrency issues
                            setPreviews((prevPreviews) => {
                                const newPreview: tidbit = {
                                    title: tidbitData.name,
                                    duration: tidbitData.duration_seconds,
                                    vid: tidbitData.id,
                                    imageUrl: url,
                                    tag: thumbnailData.tag ?? null,
                                    description: tidbitData.description,
                                    course: tidbitData.course,
                                    // TODO: Fix this
                                    videoUrl: reelUrl,
                                };
                                return [...prevPreviews, newPreview];
                            });
                        });
                }
            });
    }, []);
    if (vid === null) {
        return (
            //* course inner header
            <div className={globalStyles.neighbors}>
                {/* header */}
                <div
                    className={globalStyles.courseHeading}
                    style={{ justifyItems: "flex-start" }}
                >
                     <div style={{marginBottom: "4vh"}}>
                    
                        <div className={globalStyles.headingRow}>
                            <button
                                className={globalStyles.backButton}
                                onClick={() => setCurrentCourse(null)}
                            >
                                <ArrowLeft size={32} />
                            </button>
                            <div className={globalStyles.h1}>
                                &nbsp;&nbsp;{course}{" "}
                            </div>
                        </div>
                        <div>
                            {/* filters */}
                            <div className={globalStyles.tagsContain}>
                                {/* show all the tags associated with the course */}
                                {tags.map((tag, index) => (
                                    <button
                                        key={`${tag}-${index}`}
                                        onClick={() => {
                                            if (selectedTags.has(tag)) {
                                                // remove it
                                                const deepClonedSet: Set<string> =
                                                    new Set(
                                                        JSON.parse(
                                                            JSON.stringify([
                                                                ...selectedTags,
                                                            ]),
                                                        ),
                                                    );
                                                deepClonedSet.delete(tag);
                                                setSelectedTags(deepClonedSet);
                                            } else {
                                                // add it
                                                // deep clonse
                                                const deepClonedSet: Set<string> =
                                                    new Set(
                                                        JSON.parse(
                                                            JSON.stringify([
                                                                ...selectedTags,
                                                                tag,
                                                            ]),
                                                        ),
                                                    );
                                                setSelectedTags(deepClonedSet);
                                            }
                                        }}
                                        className={`${
                                            selectedTags.has(tag)
                                                ? globalStyles.selected
                                                : globalStyles.unselected
                                        } ${globalStyles.p}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`${globalStyles.videosContain}`}>
                        {previews.map((preview, index) => {
                            // filter through the tidbits for any selected tag
                            if (
                                selectedTags.size > 0 &&
                                (preview.tag === null ||
                                    !selectedTags.has(preview.tag))
                            ) {
                                return null;
                            }
                            return (
                                //* video tags
                                <button
                                    onClick={() => setVid(preview.vid)}
                                    key={`preview-${preview.vid}-${index}`}
                                    className={globalStyles.videoElement}
                                >
                                    <img src={preview.imageUrl} />
                                    <div
                                        className={globalStyles.h2}
                                        style={{ textAlign: "left" }}
                                    >
                                        {preview.title}
                                    </div>
                                    <div
                                        className={globalStyles.iconTag}
                                        style={{ textAlign: "left" }}
                                    >
                                        {preview.duration} seconds
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        return <ScrollableCarousel tidbits={previews} />;
    }
}

export default CourseUI;
