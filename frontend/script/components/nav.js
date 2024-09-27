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

    render() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            this.innerHTML = "";
            return
        }

        const routes = this.router.routes;

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
