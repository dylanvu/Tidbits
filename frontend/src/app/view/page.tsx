"use client";
import ScrollableCarousel from "@/components/ScrollableCarousel";
import { ITidbitVideo } from "@/components/TidbitVideo";
import { useSearchParams } from "next/navigation";

const tidbits: ITidbitVideo[] = [
    {
        description:
            "Bubble sort algorithms compared a list of items in a sequence",
        course: "CS50",
        username: "@profjasmine",
        pfp: "./profile.png",
        song: "Mozart",
        tag: "Algorithms",
        url: "./example/salad_1.mp4",
    },
    {
        description: "Hashmaps access elements in constant time",
        course: "CS50",
        username: "@profjasmine",
        pfp: "./profile.png",
        song: "Mozart",
        tag: "Data Structures",
        url: "./example/salad.mp4",
    },
    {
        description: "Heap sorts items using a heap data structure",
        course: "CS50",
        username: "@profjasmine",
        pfp: "./profile.png",
        song: "Mozart",
        tag: "Algorithms",
        url: "./example/trees.mp4",
    },
];
export default function Reels() {
    const searchParams = useSearchParams();

    const vidParam = searchParams.get("vid");
    let vid: null | number;
    if (vidParam !== null) {
        vid = parseInt(vidParam);
    } else {
        vid = vidParam;
    }
    console.log(vid);
    return (
        <main>
            <ScrollableCarousel tidbits={tidbits} />
        </main>
    );
}
