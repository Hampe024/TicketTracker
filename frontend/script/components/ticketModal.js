import userModel from "../userModel.js";
import ticketModel from "../ticketModel.js";

export default class TicketModal extends HTMLElement {
    constructor() {
        super();
        this.editable = false;
    }

    static get observedAttributes() {
        return ['ticket'];
    }

    get ticket() {
        return JSON.parse(this.getAttribute("ticket"));
    }

    connectedCallback() {
        this.render();
        const editableAttr = this.getAttribute('editable');
        this.editable = editableAttr === 'true'; // Convert the string to boolean

        // Add close functionality
        this.querySelector('.modal-close').addEventListener('click', () => {
            this.remove();
            document.querySelector('.modal-background').remove();
        });
    }

    async makeAssignBtn(ticket) {
        const assignBtnElem = this.querySelector('.assign-btn');
        assignBtnElem.style.display = "none";
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        assignBtnElem.addEventListener('click', async () => {
            assignBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "In progress", agent: { "id": user._id, "name": user.name } });
            document.getElementById("ticketStatus").innerHTML = "In progress";
            ticket.status = "In progress";
            document.getElementById("ticketAgent").innerHTML = user.name;
        });
        if (user.role === "agent" && (ticket.agent.id === null)) {
            assignBtnElem.style.display = "inline-block";
        }
    }

    async makeUpdateStatusBtn(ticket) {
        const statusBtnElem = this.querySelector('.status-btn');
        statusBtnElem.style.display = "none";
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        statusBtnElem.addEventListener('click', async () => {
            statusBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "Closed"});
            document.getElementById("ticketStatus").innerHTML = "Closed";
        });
        if (ticket.status === "In progress" && this.editable) {
            statusBtnElem.style.display = "inline-block";
        }
    }

    async render() {
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        // Construct the modal HTML
        this.innerHTML = `
            <button class="modal-close">X</button>
            <h2>${ticket.title}</h2>
            <p><strong>Description:</strong> ${ticket.description} </p>
            <p><strong>Status:</strong> <span id="ticketStatus">${ticket.status}</span> <span class="status-btn">Close</span> </p>
            <p><span><strong>Agent:</strong> <span id="ticketAgent">${ticket.agent.name || "Unassigned"}</span></span> <span class="assign-btn">Claim</span> </p>
            <p><span><strong>Customer:</strong> ${ticket.user.name}</span></p>
            <p><strong>Category:</strong> ${ticket.category || "Unassigned"} </p>
            <p><strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"} </p>
            <p><strong>Comment:</strong> ${ticket.comment} </p>
            <p><strong>Created:</strong> ${ticket['time-created']} </p>
            <p><strong>Updated:</strong> ${ticket['time-updated'] === "" ? "N/A" : ticket['time-updated']} </p>
            <p><strong>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']} </p>
            <div class="attachments">
                <h3>Attachments:</h3>
                ${this.renderAttachments(ticket.attachments)}
            </div>
        `;

        await this.makeAssignBtn(ticket);
        await this.makeUpdateStatusBtn(ticket);
    }

    renderAttachments(attachments) {
        if (!attachments || attachments.length === 0) {
            return '<p>No attachments found.</p>';
        }
    
        return attachments.map(attachment => {
            if (attachment.contentType.startsWith('image/')) {
                return `
                    <div>
                        <a href="data:${attachment.contentType};base64,${attachment.data}" target="_blank">
                            <img src="data:${attachment.contentType};base64,${attachment.data}" alt="Ticket Attachment" style="max-width: 200px;"/>
                        </a>
                    </div>
                `;
            } else if (attachment.contentType === 'application/pdf') {
                return `
                    <div class="pdf-link">
                        <a href="data:${attachment.contentType};base64,${attachment.data}" target="_blank">${attachment.filename}</a>
                    </div>
                `;
            }
            return '';
        }).join('');
    }
}
