import userModel from "../userModel.js";
import ticketModel from "../ticketModel.js";

export default class TicketModal extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['ticket'];
    }

    get ticket() {
        return JSON.parse(this.getAttribute("ticket"));
    }

    connectedCallback() {
        this.render();
        
        // Add close functionality
        this.querySelector('.modal-close').addEventListener('click', () => {
            this.remove();
            document.querySelector('.modal-background').remove();
        });
        console.log(this.ticket)
    }

    async render() {
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        this.innerHTML = `
            <button class="modal-close">X</button>
            <h2>${ticket.title}</h2>
            <br><strong>Description:</strong> ${ticket.description}
            <br><strong>Status:</strong> ${ticket.status}
            <br><strong>Agent:</strong> ${ticket.agent || "Unassigned"} <div class="assign-btn">Claim</div>
            <br><strong>Category:</strong> ${ticket.category || "Unassigned"}
            <br><strong>Department:</strong> ${ticket.department || "Unassigned"}
            <br><strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"}
            <br><strong>Comment:</strong> ${ticket.comment}
            <br><strong>Created:</strong> ${ticket['time-created']}
            <br><strong>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']}
        `;

        const assignBtnElem = this.querySelector('.assign-btn');
        assignBtnElem.addEventListener('click', async () => {
            assignBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "inProgress", agent: userId });
        });
        const userId = localStorage.getItem("userId")
        const userRole = await userModel.getUserRole(userId)
        console.log(!userRole === "agent")
        console.log(!ticket.agent === null)
        if (!userRole === "agent" || !(ticket.agent === null)) {
            assignBtnElem.style.display = "none";
        }

    }
}
