"use client";
import { useRouter } from "next/navigation";

function Navbar({ current }: { current: "home" | "browse" }) {
    const router = useRouter();
    // Tell Dylan to implement the opacity/color change depending on where you are
    return (
        <div>
            <button onClick={() => router.push("/browse")}>Home Button</button>
            <button onClick={() => router.push("/")}>PLUS_BUTTON</button>
            <button onClick={() => router.push("/view")}>Tidbits Button</button>
        </div>
    );
}

export default Navbar;
