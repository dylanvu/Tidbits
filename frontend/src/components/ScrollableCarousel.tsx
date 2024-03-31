"use client";
import { MouseEvent as ReactMouseEvent, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type PanInfo } from "framer-motion";
import styles from "@/styles/components/ScrollableCarousel.module.sass";
import TidbitVideo from "./TidbitVideo";
import { tidbit } from "@/app/browse/course";
import globalStyles from "@/styles/Global.module.sass";
import { ArrowLeft } from "lucide-react";

// configuration variables on the animation
const DRAG_THRESHOLD = 200;
const FALLBACK_HEIGHT = 500;
const CURSOR_SIZE = 80;

function ScrollableCarousel({ tidbits }: { tidbits: tidbit[] }) {
    const containerRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);

    const offsetY = useMotionValue(0);
    const animatedY = useSpring(offsetY, {
        damping: 20,
        stiffness: 150,
    });

    const [isDragging, setIsDragging] = useState(false);
    function handleDragSnap(
        _: MouseEvent,
        { offset: { y: dragOffset } }: PanInfo,
    ) {
        //reset drag state
        setIsDragging(false);
        containerRef.current?.removeAttribute("data-dragging");

        //stop drag animation (rest velocity)
        animatedY.stop();

        const currentOffset = offsetY.get();

        //snap back if not dragged far enough
        if (Math.abs(dragOffset) < DRAG_THRESHOLD) {
            animatedY.set(currentOffset);
            return;
        }

        let offsetHeight = 0;
        /*
        - start searching from currently active slide in the direction of the drag
        - check if the drag offset is greater than the width of the current item
        - if it is, add/subtract the width of the next/prev item to the offsetWidth
        - if it isn't, snap to the next/prev item
        */
        const item = itemsRef.current[activeSlide];
        if (item === null) return;
        const itemOffset = item.offsetHeight;
        const prevIndex = (activeSlide + tidbits.length - 1) % tidbits.length;
        const nextIndex = (activeSlide + 1) % tidbits.length;

        const prevItemHeight =
            itemsRef.current[prevIndex]?.offsetHeight ?? FALLBACK_HEIGHT;
        const nextItemHeight =
            itemsRef.current[nextIndex]?.offsetHeight ?? FALLBACK_HEIGHT;

        // if (
        //     (dragOffset > 0 && //dragging left
        //         dragOffset > offsetHeight + itemOffset && //dragged past item
        //         activeSlide > 1) || //not the first/second item
        //     (dragOffset < 0 && //dragging right
        //         dragOffset < offsetHeight + -itemOffset && //dragged past item
        //         activeSlide < itemsRef.current.length - 2) //not the last/second to last item
        // ) {
        //     dragOffset > 0
        //         ? (offsetHeight += prevItemHeight)
        //         : (offsetHeight -= nextItemHeight);
        // }

        if (dragOffset > 0) {
            //prev
            let newOffset = currentOffset + offsetHeight + prevItemHeight;
            // if (newOffset === nextItemHeight * tidbits.length) {
            //     newOffset = 0;
            // }
            // console.log(
            //     "new",
            //     newOffset,
            //     "current",
            //     currentOffset,
            //     "next",
            //     nextItemHeight,
            // );
            offsetY.set(newOffset);
            setActiveSlide(prevIndex);
        } else {
            //next
            let newOffset = currentOffset + offsetHeight - nextItemHeight;
            if (newOffset === -nextItemHeight * tidbits.length) {
                newOffset = 0;
            }
            offsetY.set(newOffset);
            setActiveSlide(nextIndex);
        }
    }

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function disableDragClick(e: ReactMouseEvent<HTMLDivElement>) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    return (
        <div>
            {/* heading for reels */}
            <div className={globalStyles.headingRow}>
                <button
                    className={globalStyles.backButton}
                    // onClick={() => setCurrentCourse(null)}
                >
                    <ArrowLeft size={26} />
                </button>
                {tidbits.length > 0 ? (
                    <div className={globalStyles.p}>
                        {tidbits[activeSlide].tag ?? "Tidbit"}
                    </div>
                ) : (
                    "Loading Reels..."
                )}
            </div>
            <motion.ul
                ref={containerRef}
                className="flex h-screen cursor-grab flex-col items-start"
                style={{
                    y: animatedY,
                }}
                drag="y"
                dragConstraints={{
                    top: -(FALLBACK_HEIGHT * (tidbits.length - 1)),
                    // top: -FALLBACK_HEIGHT,
                    bottom: FALLBACK_HEIGHT,
                }}
                onMouseMove={({ currentTarget, clientX, clientY }) => {
                    const parent = currentTarget.offsetParent;
                    if (!parent) return;
                    const { left, top } = parent.getBoundingClientRect();
                    mouseX.set(clientX - left - CURSOR_SIZE / 2);
                    mouseY.set(clientY - top - CURSOR_SIZE / 2);
                }}
                onDragStart={() => {
                    containerRef.current?.setAttribute("data-dragging", "true");
                    setIsDragging(true);
                }}
                onDragEnd={handleDragSnap}
            >
                {tidbits.map((tidbit, index) => {
                    const active = index === activeSlide;
                    return (
                        <motion.li
                            layout
                            key={index}
                            ref={(el) => {
                                itemsRef.current[index] = el;
                            }}
                            transition={{
                                ease: "easeInOut",
                                duration: 0.4,
                            }}
                            style={{
                                flexBasis: active ? "40%" : "30%",
                            }}
                        >
                            <div
                                draggable={false}
                                onClick={disableDragClick}
                                className={`${
                                    active ? "flex justify-center" : "hidden"
                                } ${styles.video}`}
                            >
                                <TidbitVideo tidbit={tidbit} active={active} />
                            </div>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </div>
    );
}

export default ScrollableCarousel;
