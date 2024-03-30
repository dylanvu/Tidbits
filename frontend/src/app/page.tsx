"use client";

import styles from "@/styles/pages/Home.module.sass";

export default function Home() {
    return (
        <main>
            <div className={styles.test}>
                <input type="file" hidden id="file-btn" />
                <label htmlFor="file-btn" style={{ cursor: "pointer" }}>
                    {/* add image here */}
                    <img />
                    <div>Upload a video</div>
                    <div>Accepting mp3, .mov, and mp4</div>
                </label>
            </div>
        </main>
    );
}
