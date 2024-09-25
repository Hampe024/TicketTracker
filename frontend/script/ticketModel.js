const ticketModel = {
    APIURL: "http://localhost:3000/",  

    fetcher: async (dataPoint) => {
        const response = await fetch(`${ticketModel.APIURL}${dataPoint}`);
        const result = await response.json();

        return result.result;
    },

    newTicket: async (description) => {
        const response = await fetch(`${ticketModel.APIURL}ticket`, {
            body: JSON.stringify({"description": description}),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const result = await response.json();

        return result.success;
    }

}

export default ticketModel;