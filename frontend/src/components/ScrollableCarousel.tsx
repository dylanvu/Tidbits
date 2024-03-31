"use client";
import { MouseEvent as ReactMouseEvent, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type PanInfo } from "framer-motion";
import styles from "@/styles/components/ScrollableCarousel.module.sass";
import TidbitVideo, { ITidbitVideo } from "./TidbitVideo";

// configuration variables on the animation
const DRAG_THRESHOLD = 10;
const FALLBACK_HEIGHT = 500;
const CURSOR_SIZE = 80;

function ScrollableCarousel({ tidbits }: { tidbits: ITidbitVideo[] }) {
    const containerRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const canScrollPrev = activeSlide > 0;
    const canScrollNext = activeSlide < tidbits.length - 1;

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

        //snap back if not dragged far enough or if at the start/end of the list
        if (
            Math.abs(dragOffset) < DRAG_THRESHOLD ||
            (!canScrollPrev && dragOffset > 0) ||
            (!canScrollNext && dragOffset < 0)
        ) {
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
        for (
            let i = activeSlide;
            dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
            dragOffset > 0 ? i-- : i++
        ) {
            const item = itemsRef.current[i];
            if (item === null) continue;
            const itemOffset = item.offsetHeight;

            const prevItemHeight =
                itemsRef.current[i - 1]?.offsetHeight ?? FALLBACK_HEIGHT;
            const nextItemHeight =
                itemsRef.current[i + 1]?.offsetHeight ?? FALLBACK_HEIGHT;

            if (
                (dragOffset > 0 && //dragging left
                    dragOffset > offsetHeight + itemOffset && //dragged past item
                    i > 1) || //not the first/second item
                (dragOffset < 0 && //dragging right
                    dragOffset < offsetHeight + -itemOffset && //dragged past item
                    i < itemsRef.current.length - 2) //not the last/second to last item
            ) {
                dragOffset > 0
                    ? (offsetHeight += prevItemHeight)
                    : (offsetHeight -= nextItemHeight);
                continue;
            }

            if (dragOffset > 0) {
                //prev
                offsetY.set(currentOffset + offsetHeight + prevItemHeight);
                setActiveSlide(i - 1);
            } else {
                //next
                offsetY.set(currentOffset + offsetHeight - nextItemHeight);
                setActiveSlide(i + 1);
            }
            break;
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
            <motion.ul
                ref={containerRef}
                className="flex h-screen cursor-grab flex-col items-start"
                style={{
                    y: animatedY,
                }}
                drag="y"
                dragConstraints={{
                    top: -(FALLBACK_HEIGHT * (tidbits.length - 1)),
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
                    if (!active) {
                        return;
                    }
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
                            // style={{
                            //     flexBasis: active ? "40%" : "30%",
                            // }}
                        >
                            <div
                                draggable={false}
                                onClick={disableDragClick}
                                className={`${
                                    active
                                        ? "mt-4 flex justify-center"
                                        : "hidden"
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
