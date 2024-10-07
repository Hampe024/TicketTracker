import Router from "./components/router.js";
import Navigation from "./components/nav.js";
import NotFound from "./components/not-found.js";
import NewTicket from "./views/newTicket.js";
import TicketsCustomer from "./views/ticketsCustomer.js";
import Login from "./views/login.js";
import SingleTicket from "./components/singleTicket.js";
import TicketModal from "./components/ticketModal.js";
import Account from "./views/account.js";
import TicketRepository from "./views/ticketRepository.js";
import TicketsAgent from "./views/ticketsAgent.js";

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('not-found', NotFound);
customElements.define('new-ticket', NewTicket);
customElements.define('ticket-view', TicketsCustomer);
customElements.define('login-form', Login);
customElements.define('single-ticket', SingleTicket);
customElements.define('ticket-modal', TicketModal);
customElements.define('account-view', Account);
customElements.define('agent-ticket-view', TicketRepository);
customElements.define('my-tickets', TicketsAgent);