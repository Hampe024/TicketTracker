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

    render() {
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        this.innerHTML = `
            <button class="modal-close">X</button>
            <h2>${ticket.title}</h2>
            <br><strong>Description:</strong> ${ticket.description}
            <br><strong>Status:</strong> ${ticket.status}
            <br><strong>Agent:</strong> ${ticket.agent || "Unassigned"}
            <br><strong>Category:</strong> ${ticket.category || "Unassigned"}
            <br><strong>Department:</strong> ${ticket.department || "Unassigned"}
            <br><strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"}
            <br><strong>Comment:</strong> ${ticket.comment}
            <br><strong>Created:</strong> ${ticket['time-created']}
            <br><strong>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']}
        `;
    }
}
