const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function locationWord(count) {
    return WORDS[count] ?? count.toString();
}

export function formatDate(val) {
    if (!val) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    return new Date(val + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
