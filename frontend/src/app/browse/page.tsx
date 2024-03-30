"use client";
import ScrollableCarousel from "@/components/scrollable-carousel";
import { useRouter } from "next/navigation";

export default function Browse() {
    const router = useRouter();
    return (
        <main>
            <div>
                Here is where you would look at the reel organization structure
                and view reels
            </div>
            <ScrollableCarousel />
            <button type="button" onClick={() => router.push("/browse")}>
                Browse
            </button>
        </main>
    );
}
