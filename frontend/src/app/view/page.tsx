"use client";
import Navbar from "@/components/Navbar";
import ScrollableCarousel from "@/components/ScrollableCarousel";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { tidbit } from "../browse/course";

axios.defaults.baseURL = "https://tidbits.onrender.com";

const tidbits: tidbit[] = [
    {
        description:
            "Bubble sort algorithms compared a list of items in a sequence",
        course: "CS50",
        tag: "Algorithms",
        videoUrl: "./example/salad_1.mp4",
        title: "Bubble Sort",
        duration: 53,
        imageUrl: "./example/thumbnail_example.png",
        vid: "1",
    },
    {
        description: "Hashmaps access elements in constant time",
        course: "CS50",
        tag: "Data Structures",
        videoUrl: "./example/salad.mp4",
        title: "Bubble Sort",
        duration: 53,
        imageUrl: "./example/thumbnail_example.png",
        vid: "2",
    },
    {
        description: "Heap sorts items using a heap data structure",
        course: "CS50",
        tag: "Algorithms",
        videoUrl: "./example/trees.mp4",
        title: "Bubble Sort",
        duration: 53,
        imageUrl: "./example/thumbnail_example.png",
        vid: "3",
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

    return (
        <main>
            <ScrollableCarousel tidbits={tidbits} />
            <Navbar current="home" />
        </main>
    );
}
