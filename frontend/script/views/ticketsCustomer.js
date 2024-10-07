import ticketModel from "../ticketModel.js";
import userModel from "../userModel.js";

export default class TicketsCustomer extends HTMLElement {
    constructor() {
        super();
        this.tickets = []
    }

    // connect component
    async connectedCallback() {
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        // console.log(user)
        this.tickets = await ticketModel.getTicketByUserId(user._id, user.email);
        this.render();
    }
    render() {
        const list = this.tickets.map((ticket) => {
            return `<single-ticket 
                    ticket='${JSON.stringify(ticket)}'
                    editable='false'>
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
