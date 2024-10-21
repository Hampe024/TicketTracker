import userModel from "../userModel.js";

export default class SetPassword extends HTMLElement {
    constructor() {
        super();

        this.userInfo = {};
    }

    // connect component
    connectedCallback() {
        this.render();
    }

    makeInput(type, required, name) {
        const newInput = document.createElement("input");

        newInput.setAttribute("type", type);
        newInput.required = required;
        newInput.classList.add("input");

        newInput.addEventListener("input", (event) => {
            this.userInfo[name] = event.target.value;
        });

        return newInput;
    }

    makeInputLabel(text) {
        const newInputLabel = document.createElement("p");

        newInputLabel.classList.add("input-label");
        newInputLabel.innerHTML = text;
        return newInputLabel;
    }

    makeSubmit() {
        const newSubmit = document.createElement("input");

        newSubmit.setAttribute("type", "submit");
        newSubmit.setAttribute("value", "Save password");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("New password", true));
        form.appendChild(this.makeInput("password", true, "password"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const userId = localStorage.getItem("userId");
            const result = await userModel.ChangePassword(userId, this.userInfo.password);

            if (result) {
                alert("Password changed");
                location.hash = "login-form";
            }
        });

        this.appendChild(form);
    }
}

