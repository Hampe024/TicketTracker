import userModel from "../userModel.js";

export default class Register extends HTMLElement {
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
        // if (type === "email") {
        //     newInput.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
        // }
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
        newSubmit.setAttribute("value", "Create account");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("First name", true));
        form.appendChild(this.makeInput("text", true, "fName"));
        form.appendChild(this.makeInputLabel("Last name", true));
        form.appendChild(this.makeInput("text", true, "lName"));
        form.appendChild(this.makeInputLabel("Email", true));
        form.appendChild(this.makeInput("email", true, "email"));
        form.appendChild(this.makeInputLabel("Password", true));
        form.appendChild(this.makeInput("password", true, "password"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await userModel.makeUser(`${this.userInfo.fName} ${this.userInfo.lName}`, this.userInfo.email, "customer", this.userInfo.password, false);
            location.hash = "login-form";
        });

        this.appendChild(form);
    }
}

