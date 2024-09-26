import Router from "./components/router.js";
import Navigation from "./components/nav.js";
import NotFound from "./components/not-found.js";
import NewTicket from "./views/newTicket.js";
import Tickets from "./views/tickets.js";
import Login from "./views/login.js";
import SingleTicket from "./components/singleTicket.js";
import TicketModal from "./components/ticketModal.js";

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('not-found', NotFound);
customElements.define('new-ticket', NewTicket);
customElements.define('ticket-view', Tickets);
customElements.define('login-form', Login);
customElements.define('single-ticket', SingleTicket);
customElements.define('ticket-modal', TicketModal);