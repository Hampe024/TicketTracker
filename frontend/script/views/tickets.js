import ticketModel from "../ticketModel.js";

export default class Tickets extends HTMLElement {
    constructor() {
        super();
        this.tickets = []
    }

    // connect component
    async connectedCallback() {
        const userId = localStorage.getItem("userId");
        this.tickets = await ticketModel.getTicketByUserId(userId);
        this.render();
    }
    render() {
        
    }
}
