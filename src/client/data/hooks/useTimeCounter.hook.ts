import { useState, useRef } from 'react';

export default function useTimeCounter(interval = 500) {
    const [totalTime, setTotalTime] = useState(0),
        timeStamp = useRef<number>(0),
        timerRef = useRef<NodeJS.Timeout>();

    function resetTimer() {
        setTotalTime(0);
    }

    function startTimer() {
        pauseTimer();
        timeStamp.current = Date.now();
        timerRef.current = setInterval(() => {
            const seconds = Math.floor((Date.now() - timeStamp.current) / 1000);
            setTotalTime(seconds);
        }, interval);
    }

    function pauseTimer() {
        timerRef.current && clearInterval(timerRef.current);
    }

    function stopTimer(onStop?: (totalTime: number) => void) {
        pauseTimer();
        onStop?.(totalTime);
        resetTimer();
    }

    function resumeTimer() {
        pauseTimer();
        timeStamp.current = Date.now() - totalTime * 1000;
        timerRef.current = setInterval(() => {
            const seconds = Math.floor((Date.now() - timeStamp.current) / 1000);
            setTotalTime(seconds);
        }, interval);
    }

    return {
        totalTime,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
    };
}
