const convertToCSV = (data, filename = "data.csv") => {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data: Must be a non-empty array.");
        return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);

    // Function to escape special characters (commas, quotes, newlines)
    const escapeCSVValue = (value) => {
        if (typeof value === "string") {
            return value.replace(/"/g, '""'); // Escape double quotes
        }
        return value ?? ""; // Return value or empty string if null/undefined
    };

    // Convert array to CSV format
    const csvRows = data.map(row =>
        headers.map(field => escapeCSVValue(row[field])).join(',')
    );

    // Combine headers and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default convertToCSV;