import userModel from "../userModel.js";

export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";

        this.allRoutes = {
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
            },
            "login-form": {
                view: "<login-form></login-form>",
                hidden: true,
            },
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
            "categories": {
                view: "<categories-view></categories-view>",
                name: "Category manager",
                img: "icons8-diversity-100.png",
            },
            "account-manager": {
                view: "<user-manager></user-manager>",
                name: "User manager",
                "img": "icons8-add-user-100.png"
            },
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        this.currentRoute = location.hash.replace("#", "").split('?')[0];
        for (const route in this.routes) {
            this.routes[route].active = this.currentRoute === route;
        }

        this.render();
    }

    render() {
        const userId = localStorage.getItem("userId");

        // if not logged in
        if (!userId) {
            location.hash = "login-form";
        } 
        // if current # is in routes view it, otherwise 404
        if (this.routes[this.currentRoute]) {
            this.innerHTML = this.routes[this.currentRoute].view;
        } else {
            this.innerHTML = "<not-found></not-found>";
        }
    }
}
