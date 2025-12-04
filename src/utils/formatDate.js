/**
 * Normalize numeric timestamp (seconds or milliseconds) to ms
 */
const toMs = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return NaN;
    // if looks like seconds (<= 10 digits), convert to ms
    return n < 1e12 ? n * 1000 : n;
};

const formatDate = (timestamp) => {
    if (timestamp == null) return "N/A";
    // supports seconds, milliseconds, or ISO string
    let date;
    if (typeof timestamp === "number" || /^\d+$/.test(String(timestamp))) {
        const ms = toMs(timestamp);
        date = new Date(ms);
    } else {
        date = new Date(timestamp);
    }
    if (Number.isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString();
};

// Converts a date value to a string formatted for HTML date input (YYYY-MM-DD)
const formatForInput = (value) => {
    if (!value) return "";
    let date;
    if (typeof value === "number" || /^\d+$/.test(String(value))) {
        const ms = toMs(value);
        date = new Date(ms);
    } else {
        date = new Date(value);
    }
    if (Number.isNaN(date.getTime())) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

// Converts a date string from an input field (YYYY-MM-DD) to an ISO string
// If your backend expects a Unix seconds timestamp, change to return Math.floor(date.getTime()/1000)
const formatForAPI = (inputDate, { returnSeconds = false } = {}) => {
    if (!inputDate) return null;
    const date = new Date(inputDate); // local midnight -> ISO
    if (Number.isNaN(date.getTime())) return null;
    return returnSeconds ? Math.floor(date.getTime() / 1000) : date.toISOString();
};

export { formatDate, formatForInput, formatForAPI };