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
        // console.log(this.ticket)
    }

    async render() {
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        this.innerHTML = `
            <button class="modal-close">X</button>
            <h2>${ticket.title}</h2>
            <p><strong>Description:</strong> ${ticket.description} </p>
            <p><strong>Status:</strong> <span id="ticketStatus">${ticket.status}</span> </p>
            <p><span><strong>Agent:</strong> <span id="ticketAgent">${ticket.agent.name || "Unassigned"}</span></span> <span class="assign-btn">Claim</span> </p>
            <p><span><strong>Customer:</strong> ${ticket.user.name}</span>
            <p><strong>Category:</strong> ${ticket.category || "Unassigned"} </p>
            <p><strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"} </p>
            <p><strong>Comment:</strong> ${ticket.comment} </p>
            <p><strong>Created:</strong> ${ticket['time-created']} </p>
            <p><strong>Updated:</strong> ${ticket['time-updated'] === "" ? "N/A" : ticket['time-updated']} </p>
            <p><strong>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']} </p>
        `;

        const assignBtnElem = this.querySelector('.assign-btn');
        assignBtnElem.style.display = "none";
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        assignBtnElem.addEventListener('click', async () => {
            assignBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "In progress", agent: { "id": user._id, "name": user.name } });
            document.getElementById("ticketStatus").innerHTML = "In progress";
            document.getElementById("ticketAgent").innerHTML = user.name;
        });
        if (user.role === "agent" && (ticket.agent.id === null)) {
            assignBtnElem.style.display = "inline-block";
        }

    }
}
