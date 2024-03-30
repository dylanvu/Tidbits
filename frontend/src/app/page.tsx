"use client";

import styles from "@/styles/pages/Home.module.sass";
import { ChangeEvent, useState } from "react";

export default function Home() {
    const [file, setFile] = useState<File | null>();
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files) {
            setFile(files[0]);
        }
    }
    return (
        <main>
            <div className={styles.test}>
                <input
                    type="file"
                    hidden
                    id="file-btn"
                    onChange={handleChange}
                    accept=".mp3,.mp4,.mov"
                />
                <label htmlFor="file-btn" style={{ cursor: "pointer" }}>
                    {/* add image here */}
                    {file ? (
                        <div>{file.name}</div>
                    ) : (
                        <>
                            <img />
                            <div>Upload a video</div>
                            <div>Accepting mp3, .mov, and mp4</div>
                        </>
                    )}
                </label>
            </div>
        </main>
    );
}
