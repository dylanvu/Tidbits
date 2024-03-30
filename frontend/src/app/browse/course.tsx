import Link from "next/link";

// TODO: retrieve this from the backend
let tidbitPreviews: { title: string; duration: number }[] = Array.from({
    length: 20,
});

// Fill the array with the same object for testing
tidbitPreviews.fill({
    title: "Bubble Sort",
    duration: 45,
});

// duplicate this

function CourseUI({ course }: { course: string }) {
    return (
        <div>
            <div>Reels for {course}</div>
            {tidbitPreviews.map((tidbit) => (
                <Link href="/view">
                    <img src="./placeholder.png" />
                    <div>{tidbit.title}</div>
                    <div>{tidbit.duration} seconds</div>
                </Link>
            ))}
        </div>
    );
}

export default CourseUI;
