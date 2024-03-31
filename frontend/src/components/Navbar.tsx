"use client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

function Navbar({
    current,
    setCurrentCourse,
}: {
    current: "home" | "browse";
    setCurrentCourse?: Dispatch<SetStateAction<string | null>>;
}) {
    const router = useRouter();
    // Tell Dylan to implement the opacity/color change depending on where you are
    return (
        <div>
            <button
                onClick={() => {
                    if (setCurrentCourse) {
                        setCurrentCourse(null);
                    } else {
                        router.push("/browse");
                    }
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
