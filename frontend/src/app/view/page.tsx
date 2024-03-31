"use client";
import Navbar from "@/components/Navbar";
import ScrollableCarousel from "@/components/ScrollableCarousel";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { tidbit } from "../browse/course";

axios.defaults.baseURL = "https://tidbits.onrender.com";

export default function Reels() {
    const searchParams = useSearchParams();

    const vidParam = searchParams.get("vid");
    let vid: null | number;
    if (vidParam !== null) {
        vid = parseInt(vidParam);
    } else {
        vid = vidParam;
    }

    const [previews, setPreviews] = useState<tidbit[]>([]);

    useEffect(() => {
        // retrieve all the reel data associated with the user
        axios.get(`reels/info?uid=test`).then((res) => {
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
                                videoUrl: reelUrl,
                            };
                            return [...prevPreviews, newPreview];
                        });
                    });
            }
        });
    }, []);

    return (
        <main>
            <ScrollableCarousel tidbits={previews} />
            <Navbar current="home" />
        </main>
    );
}
