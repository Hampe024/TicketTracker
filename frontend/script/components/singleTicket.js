import TicketModal from './ticketModal.js';

export default class SingleTicket extends HTMLElement {
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

    // connect component
    connectedCallback() {
        this.render()
        this.addEventListener('click', this.openModal.bind(this));
        const editableAttr = this.getAttribute('editable');
        this.editable = editableAttr === 'true'; // Convert the string to boolean
    }

    openModal() {
        const modal = document.createElement('ticket-modal');

        modal.setAttribute('ticket', JSON.stringify(this.ticket));
        modal.setAttribute('editable', this.editable);
        document.body.appendChild(modal);
    }

    render() {
        this.innerHTML = 
        `
            <span class="limited-text limited-text-title">${this.ticket.title}</span>
            <span><strong>Status:</strong><br> ${this.ticket.status}</span>
            <span class="limited-text limited-text-description">${this.ticket.description}</span>
            <span><strong>Updated:</strong><br> 
                ${
                    this.ticket['time-updated'] === "" ? 
                    this.ticket['time-created'].replace(/ - /g, ' ') : 
                    this.ticket['time-updated'].replace(/ - /g, ' ')
                }
            </span>
        `
    }
}
