const helpers = {
    getCurrentDate: async () => {
        const currentDate = new Date();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        return `${hours}:${minutes}:${seconds} - ${day} - ${month} - ${year}`;
    },

    parseFormAsync: async (req, form) => {
        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });
    },

    extractTicketId(text) {
        const ticketStart = "Hello! Ticket '";
        const ticketEnd = "' has had an update";
    
        const startIndex = text.indexOf(ticketStart);
        if (startIndex === -1) return null; // Ticket string not found
    
        const endIndex = text.indexOf(ticketEnd, startIndex);
        if (endIndex === -1) return null; // End string not found
    
        const ticketId = text.substring(startIndex + ticketStart.length, endIndex);
        return ticketId;
    }
}

module.exports = helpers;