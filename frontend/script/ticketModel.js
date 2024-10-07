import userModel from "./userModel.js";

const ticketModel = {
    APIURL: "http://localhost:3000/",  

    fetcher: async (dataPoint) => {
        const response = await fetch(`${ticketModel.APIURL}${dataPoint}`);
        const result = await response.json();

        return result.result;
    },

    getTicketByUserId: async (userId, email=null) => {
        const dataPoint = `tickets/?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}`;
        const result = await ticketModel.fetcher(dataPoint)
        return result;
    },

    getTicketByAgentId: async (userId) => {
        const dataPoint = `tickets/agent/?agentId=${encodeURIComponent(userId)}&ticketStatus=In progress`;
        const result = await ticketModel.fetcher(dataPoint)
        return result;
    },

    newTicket: async (body) => {
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        body["user"] = {
            "id": user._id,
            "name": user.name,
            "email": user.email
        };
        // console.log(body)
        const response = await fetch(`${ticketModel.APIURL}ticket`, {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const result = await response.json();

        return result.success;
    },

    updateTicket: async (ticketId, body) => {
        const response = await fetch(`${ticketModel.APIURL}ticket/${ticketId}`, {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PATCH'
        });
        const result = await response.json();

        return result.success;
    }

}

export default ticketModel;