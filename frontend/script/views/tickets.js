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
        const list = this.tickets.map((ticket) => {
            return `<single-ticket 
                    ticket='${JSON.stringify(ticket)}'>
                </single-ticket>`;
        }).join("");

        this.innerHTML = `
            <h2>Your current ticket(s)</h2> 
            <div class="ticket-list">
                ${list}
            </div>
        `;
    }
}
