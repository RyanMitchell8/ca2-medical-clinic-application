

export const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(Number(timestamp));

    return date.toLocaleDateString("en-IE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
