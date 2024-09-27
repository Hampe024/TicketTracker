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
    }

    render() {
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        this.innerHTML = `
            <div class="ticket-modal-content">
                <button class="modal-close">X</button>
                <h2>Ticket Information</h2>
                    <strong>Description:</strong> ${ticket.description}                     <br>
                    <strong>Status:</strong> ${ticket.status}                               <br>
                    <strong>Actions taken:</strong> ${ticket.actions || "Nothing so far!"}  <br>
                    <strong>Comment:</strong> ${ticket.comment}                             <br>
                    <strong>Agent:</strong> ${ticket.agent || "Unassigned"}                 <br>
                    <strong>Created:</strong> ${ticket['time-created']}                     <br>
            </div>
        `;
    }
}
