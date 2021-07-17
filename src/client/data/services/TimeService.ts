export const TimeService = {
    formatTime(totalSeconds: number): string {
        let hours = Math.floor(totalSeconds / 3600),
            minutes = Math.floor((totalSeconds - hours * 3600) / 60),
            seconds = totalSeconds - (hours * 3600 + minutes * 60);

        return `${hours}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
};
