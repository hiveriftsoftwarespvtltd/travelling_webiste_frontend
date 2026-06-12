import React, { useEffect, useState } from "react";

function ScrollToTop() {
    const [progress, setProgress] = useState(307.919);
    const [visible, setVisible] = useState(false);
    const pathLength = 307.919;

    useEffect(() => {
        const updateProgress = () => {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progressValue = pathLength - (scroll * pathLength) / height;
            setProgress(progressValue);
            setVisible(scroll > 50);
        };

        window.addEventListener("scroll", updateProgress);
        return () => {
            window.removeEventListener("scroll", updateProgress);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`scroll-top ${visible ? "show" : ""}`}
            onClick={scrollToTop}
            style={{ cursor: "pointer" }}
        >
            <svg
                className="progress-circle svg-content"
                width="100%"
                height="100%"
                viewBox="-1 -1 102 102"
            >
                <path
                    d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    style={{
                        transition: "stroke-dashoffset 10ms linear",
                        strokeDasharray: `${pathLength}, ${pathLength}`,
                        strokeDashoffset: progress,
                    }}
                ></path>
            </svg>
        </div>
    );
}

export default ScrollToTop;
