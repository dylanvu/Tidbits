"use client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import globalStyles from "@/styles/Global.module.sass";
import { Home, Video, Plus } from "lucide-react";

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
        <div className={globalStyles.navBar}>
            <button
                className={globalStyles.navBarItem}
                onClick={() => {
                    if (setCurrentCourse) {
                        setCurrentCourse(null);
                    } else {
                        router.push("/browse");
                    }
                }}
            >
                <Home size={28} />
                Home
            </button>
            <Link href={"/"} className={globalStyles.navBarItem}>
                <div className={globalStyles.createButton}>
                    <Plus size={32} />
                </div>
            </Link>
            <Link href={"/view"} className={globalStyles.navBarItem}>
                <Video size={28} />
                Tidbits
            </Link>
        </div>
    );
}

export default Navbar;
