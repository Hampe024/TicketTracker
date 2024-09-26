const ticketModel = {
    APIURL: "http://localhost:3000/",  

    fetcher: async (dataPoint) => {
        const response = await fetch(`${ticketModel.APIURL}${dataPoint}`);
        const result = await response.json();

        return result.result;
    },

    getTicketByUserId: async (userId) => {
        const dataPoint = `tickets/?userId=${userId}`;
        const result = await ticketModel.fetcher(dataPoint)
        return result;
    },

    newTicket: async (description) => {
        //console.log(localStorage.getItem("userId"))
        const body = {
            "description": description,
            "userId": localStorage.getItem("userId"),
        }
        const response = await fetch(`${ticketModel.APIURL}ticket`, {
            body: JSON.stringify(body),
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