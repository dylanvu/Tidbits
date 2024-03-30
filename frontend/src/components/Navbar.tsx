"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

function Navbar({
    current,
    setCurrentCourse,
}: {
    current: "home" | "browse";
    setCurrentCourse: Dispatch<SetStateAction<string | null>>;
}) {
    const router = useRouter();
    // Tell Dylan to implement the opacity/color change depending on where you are
    return (
        <div>
            <button
                onClick={() => {
                    setCurrentCourse(null);
                }}
            >
                Home
            </button>
            <Link href={"/"}> + </Link>
            <Link href={"/view"}>Tidbits</Link>
        </div>
    );
}

export default Navbar;
