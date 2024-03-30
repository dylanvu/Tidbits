"use client";
import { MouseEvent as ReactMouseEvent, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, type PanInfo } from "framer-motion";

// configuration variables on the animation
const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 509;
const CURSOR_SIZE = 80;

// TODO: Turn this into a prop
const videos = [
    { title: "Video 1" },
    { title: "Video 2" },
    { title: "Video 3" },
];

function ScrollableCarousel() {
    const containerRef = useRef<HTMLUListElement>(null);
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const canScrollPrev = activeSlide > 0;
    const canScrollNext = activeSlide < videos.length - 1;

    const offsetY = useMotionValue(0);
    const animatedY = useSpring(offsetY, {
        damping: 20,
        stiffness: 150,
    });

    const [isDragging, setIsDragging] = useState(false);
    function handleDragSnap(
        _: MouseEvent,
        { offset: { x: dragOffset } }: PanInfo,
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

        let offsetWidth = 0;
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
            const itemOffset = item.offsetWidth;

            const prevItemWidth =
                itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
            const nextItemWidth =
                itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;

            if (
                (dragOffset > 0 && //dragging left
                    dragOffset > offsetWidth + itemOffset && //dragged past item
                    i > 1) || //not the first/second item
                (dragOffset < 0 && //dragging right
                    dragOffset < offsetWidth + -itemOffset && //dragged past item
                    i < itemsRef.current.length - 2) //not the last/second to last item
            ) {
                dragOffset > 0
                    ? (offsetWidth += prevItemWidth)
                    : (offsetWidth -= nextItemWidth);
                continue;
            }

            if (dragOffset > 0) {
                //prev
                offsetY.set(currentOffset + offsetWidth + prevItemWidth);
                setActiveSlide(i - 1);
            } else {
                //next
                offsetY.set(currentOffset + offsetWidth - nextItemWidth);
                setActiveSlide(i + 1);
            }
            break;
        }
    }

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function disableDragClick(e: ReactMouseEvent<HTMLAnchorElement>) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    return (
        <div>
            <motion.ul
                ref={containerRef}
                className="flex cursor-grab items-start"
                style={{
                    x: animatedY,
                }}
                drag="x"
                dragConstraints={{
                    left: -(FALLBACK_WIDTH * (videos.length - 1)),
                    right: FALLBACK_WIDTH,
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
                {videos.map((video, index) => {
                    const active = index === activeSlide;
                    return (
                        <motion.li
                            layout
                            key={video.title}
                            ref={(el) => (itemsRef.current[index] = el)}
                            transition={{
                                ease: "easeInOut",
                                duration: 0.4,
                            }}
                            style={{
                                flexBasis: active ? "40%" : "30%",
                            }}
                        >
                            <div>
                                <div
                                    draggable={false}
                                    onClick={disableDragClick}
                                    className={
                                        active
                                            ? "mt-4 flex justify-center"
                                            : "hidden"
                                    }
                                >
                                    {video.title}
                                </div>
                            </div>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </div>
    );
}

export default ScrollableCarousel;
