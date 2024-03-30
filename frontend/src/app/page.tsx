"use client";

import styles from "@/styles/pages/Home.module.sass";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import LinearProgress from "@mui/material/LinearProgress";

type validStatuses = "input" | "waiting" | "done";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<validStatuses>("input");
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (file) {
            if (status === "input") {
                // create the preview
                // create the preview
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);

                // set the status to render the loading bar
                setStatus("waiting");
                // TODO: call the API to send the video data
                //.then, setStatus to be "done"

                // free memory when ever video component is unmounted
                return () => URL.revokeObjectURL(objectUrl);
            }
        }
    }, [file]);

    let ui: JSX.Element;
    if (status !== "input" && file) {
        ui = <UploadedUI file={file} status={status} preview={preview} />;
    } else {
        ui = <InputUI file={file} setFile={setFile} />;
    }

    return (
        <main>
            {ui}
            {status === "waiting" ? (
                <button
                    onClick={() => {
                        setStatus("done");
                    }}
                    style={{
                        backgroundColor: "gray",
                        padding: "1%",
                        borderRadius: "10px",
                    }}
                >
                    DEBUG BUTTON DELETE ME LATER: See "finished" state
                </button>
            ) : null}
        </main>
    );
}

/**
 * UI for accepting input
 * @returns
 */
function InputUI({
    file,
    setFile,
}: {
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
}) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files) {
            setFile(files[0]);
        }
    }
    return (
        <div className={styles.test}>
            <img src="./placeholder.png" />
            <div>Add lecture video or audio file</div>
            <div>Add lecture video or audio file</div>
            <div>
                <input
                    type="file"
                    hidden
                    id="file-btn"
                    onChange={handleChange}
                    accept=".mp3,.mp4,.mov"
                />
                <label htmlFor="file-btn" style={{ cursor: "pointer" }}>
                    <div>{file ? file.name : "Upload File"}</div>
                </label>
            </div>
        </div>
    );
}

function UploadedUI({
    status,
    file,
    preview,
}: {
    status: validStatuses;
    file: File;
    preview: string;
}) {
    const progressStyle = {
        height: 30,
        borderRadius: "10px",
    };
    return (
        <div>
            {status === "waiting" ? (
                "Generating Video"
            ) : (
                <div>
                    <div>
                        {/* // TODO: code this in */}
                        CS50 Lecture Week 2
                    </div>
                    {file.type === ".mp3" ? (
                        <audio controls>
                            <source src={preview} />
                        </audio>
                    ) : (
                        <video src={preview} controls />
                    )}
                </div>
            )}
            <div className="progress-container">
                {file.name}
                {status === "waiting" ? (
                    <>
                        <span className="float-end">
                            {Math.round((file.size / 1000000) * 100) / 100} mb
                        </span>
                        <LinearProgress sx={progressStyle} />
                    </>
                ) : (
                    <>
                        <span className="float-end">Completed</span>
                        <LinearProgress
                            variant="determinate"
                            sx={progressStyle}
                            value={100}
                        />
                        <button>View Video</button>
                    </>
                )}
            </div>
        </div>
    );
}
