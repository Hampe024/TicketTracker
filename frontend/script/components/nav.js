import userModel from "../userModel.js";
import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();

        this.router = new Router();
        this.render = this.render.bind(this);
    }

    // connect component
    connectedCallback() {
        this.render();
        window.addEventListener('accountUpdate', this.render);
    }

    async render() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            this.innerHTML = "";
            return
        }

        const customerRoutes = {
            "": {
                view: "<ticket-view></ticket-view>",
                name: "My Tickets",
                img: "icons8-ticket-100.png",
            },
            "newTicket": {
                view: "<new-ticket></new-ticket>",
                name: "New Ticket",
                "img": "icons8-plus-math-100.png"
            },
            "account": {
                view: "<account-view></account-view>",
                name: "My Account",
                "img": "icons8-male-user-100.png"
            }
        };

        const agentRoutes = {
            "ticketRepository": {
                view: "<agent-ticket-view></agent-ticket-view>",
                name: "Ticket repository",
                img: "icons8-file-cabinet-100.png",
            },
            "myTickets": {
                view: "<my-tickets></my-tickets>",
                name: "My Tickets",
                "img": "icons8-ticket-100.png"
            },
            "account": {
                view: "<account-view></account-view>",
                name: "My Account",
                "img": "icons8-male-user-100.png"
            }
        };

        const userRole = await userModel.getUserRole();

        const routes = userRole === 'agent' ? agentRoutes : customerRoutes;

        let navigationLinks = "";

        for (let path in routes) {
            if (routes[path].hidden) {
                continue;
            }
            navigationLinks += `
                <a class="vertical-line" href='#${path}'>
                    <div>
                        <img
                            src="img/${routes[path].img}"
                            title="${routes[path].name}"
                        >
                    </div>
                    <p>
                        ${routes[path].name}
                    </p>
                </a>
                `;
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}
