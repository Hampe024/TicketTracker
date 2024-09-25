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
                view: "My Account",
                name: "My Account",
                "img": "icons8-male-user-100.png"
            },
            "hidden": {
                view: "hiddenyay",
                hidden: true,
            }
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
        // if current # is in routes view it, otherwise 404
        if (this.routes[this.currentRoute]) {
            this.innerHTML = this.routes[this.currentRoute].view;
        } else {
            this.innerHTML = "<not-found></not-found>";
        }
    }
}
