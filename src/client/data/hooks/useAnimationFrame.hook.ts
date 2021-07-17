import { useEffect, useRef } from 'react';

export default function useAnimationFrame(
    isActive: boolean,
    callback: () => void,
    deps: any[]
) {
    const frame = useRef<number>(0);

    const animate = () => {
        callback();
        if (isActive) {
            frame.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        frame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame.current);
    }, [...deps, isActive]);
}
