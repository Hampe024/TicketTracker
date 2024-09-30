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
            <p><strong>Description:</strong> ${ticket.description} </p>
            <p><strong>Status:</strong> <span id="ticketStatus">${ticket.status}</span> </p>
            <p><span><strong>Agent:</strong> <span id="ticketAgent">${ticket.agent || "Unassigned"}</span></span> <span class="assign-btn">Claim</span> </p>
            <p><strong>Category:</strong> ${ticket.category || "Unassigned"} </p>
            <p><strong>Department:</strong> ${ticket.department || "Unassigned"} </p>
            <p><strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"} </p>
            <p><strong>Comment:</strong> ${ticket.comment} </p>
            <p><strong>Created:</strong> ${ticket['time-created']} </p>
            <p>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']} </p>
        `;

        const assignBtnElem = this.querySelector('.assign-btn');
        assignBtnElem.style.display = "none";
        const userId = localStorage.getItem("userId")
        const userRole = await userModel.getUserRole(userId)
        assignBtnElem.addEventListener('click', async () => {
            assignBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "In progress", agent: userId });
            document.getElementById("ticketStatus").innerHTML = "In progress";
            document.getElementById("ticketAgent").innerHTML = userId;
        });
        console.log(!userRole === "agent")
        console.log(!ticket.agent === null)
        if (userRole === "agent" && (ticket.agent === null)) {
            assignBtnElem.style.display = "inline-block";
        }

    }
}
