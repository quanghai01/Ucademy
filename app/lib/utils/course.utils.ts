
interface LevelConfig {
    bg: string;
    text: string;
    label: string;
}


export function getLevelConfig(level: string): LevelConfig {
    switch (level.toLowerCase()) {
        case "beginner":
            return {
                bg: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90",
                text: "text-white",
                label: "Cơ bản",
            };
        case "intermediate":
            return {
                bg: "bg-gradient-to-r from-amber-500/90 to-orange-500/90",
                text: "text-white",
                label: "Trung bình",
            };
        case "advanced":
            return {
                bg: "bg-gradient-to-r from-rose-500/90 to-pink-500/90",
                text: "text-white",
                label: "Nâng cao",
            };
        default:
            return {
                bg: "bg-gradient-to-r from-gray-500/90 to-slate-500/90",
                text: "text-white",
                label: level,
            };
    }
}
export function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return "0 phút";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ""}`.trim();
    }

    return `${minutes} phút`;
}
