import userModel from "../userModel.js";

export default class Account extends HTMLElement {
    constructor() {
        super();
        this.user = {};
    }

    // connect component
    async connectedCallback() {
        
        const userId = localStorage.getItem("userId")
        this.user = await userModel.getUserById(userId);
        this.render();
    }

    makeLogoutBtn() {
        const btn = document.createElement("div");

        btn.classList.add("button");
        btn.innerHTML = "Logout";
        btn.addEventListener("click", () => {
            localStorage.removeItem("userId");
            location.hash = "login-form";
        });

        return btn;
    }

    render() {
        this.innerHTML = `
            <h2>Your account</h2>
            ${this.user.name} <br>
            ${this.user.email}
        `;
        this.appendChild(this.makeLogoutBtn());
    }
}
