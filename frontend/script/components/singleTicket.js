import TicketModal from './ticketModal.js';

export default class SingleTicket extends HTMLElement {
    constructor() {
        super();
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
    }

    openModal() {
        const modal = document.createElement('ticket-modal');
        
        modal.setAttribute('ticket', JSON.stringify(this.ticket));
        
        document.body.appendChild(modal);
    }

    render() {
        this.innerHTML = 
        `
            <strong>${this.ticket.title}</strong> 
            <br><br><br><br><br><br>
            <strong>Status:</strong> ${this.ticket.status}
        `
    }
}
