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

        const routes = {
            customer: {
                "": {
                    view: "<ticket-view></ticket-view>",
                    name: "My Tickets",
                    img: "icons8-ticket-100.png",
                },
                "newTicket": {
                    view: "<new-ticket></new-ticket>",
                    name: "New Ticket",
                    img: "icons8-plus-math-100.png",
                },
                "account": {
                    view: "<account-view></account-view>",
                    name: "My Account",
                    img: "icons8-male-user-100.png",
                }
            },
            agent: {
                "ticketRepository": {
                    view: "<agent-ticket-view></agent-ticket-view>",
                    name: "Ticket repository",
                    img: "icons8-file-cabinet-100.png",
                },
                "myTickets": {
                    view: "<my-tickets></my-tickets>",
                    name: "My Tickets",
                    img: "icons8-ticket-100.png",
                },
                "account": {
                    view: "<account-view></account-view>",
                    name: "My Account",
                    img: "icons8-male-user-100.png",
                }
            },
            admin: {
                "categories": {
                    view: "<categories-view></categories-view>",
                    name: "Category manager",
                    img: "icons8-diversity-100.png",
                },
                "account-manager": {
                    view: "<user-manager></user-manager>",
                    name: "User manager",
                    img: "icons8-add-user-male-100.png",
                },
                "account": {
                    view: "<account-view></account-view>",
                    name: "My Account",
                    img: "icons8-male-user-100.png",
                }
            }
        };
        
        // Get the user role
        const userRole = await userModel.getUserRole();
        
        // Use the appropriate routes based on the user role
        const availableRoutes = routes[userRole] || {};
        
        if (Object.keys(availableRoutes).length === 0) {
            this.innerHTML = "No routes available for your role.";
            return;
        }
        let navigationLinks = "";

        for (let path in availableRoutes) {
            if (availableRoutes[path].hidden) {
                continue;
            }
            navigationLinks += `
                <a class="vertical-line" href='#${path}'>
                    <div>
                        <img
                            src="img/${availableRoutes[path].img}"
                            title="${availableRoutes[path].name}"
                        >
                    </div>
                    <p>
                        ${availableRoutes[path].name}
                    </p>
                </a>
                `;
        }

        this.innerHTML = `<nav class="bottom-nav">${navigationLinks}</nav>`;
    }
}
