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
            const accountEvent = new Event('accountUpdate');
            window.dispatchEvent(accountEvent);
        });

        return btn;
    }

    render() {
        this.innerHTML = `
            <h1>Your account</h1>
            <h3>${this.user.name}</h3>
            <h4>${this.user.email}</h4>
        `;
        this.appendChild(this.makeLogoutBtn());
    }
}
