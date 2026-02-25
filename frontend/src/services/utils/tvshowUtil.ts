export function getStatusLabel(status: number) {
    switch (status) {
        case 0: return "Ongoing";
        case 1: return "Ended";
        case 2: return "Hiatus";
        case 3: return "Cancelled";
        default: return "Unknown";
    }
}
