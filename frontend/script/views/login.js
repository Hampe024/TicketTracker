import userModel from "../userModel.js";

export default class Login extends HTMLElement {
    constructor() {
        super();

        this.userInfo = {};
    }

    // connect component
    connectedCallback() {
        // location.hash = "login-form";
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
        newSubmit.setAttribute("value", "Logga in");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    makeError() {
        const errorBox = document.createElement("div");

        errorBox.id = "loginError";
        errorBox.innerHTML = `Could not find account`;
        return errorBox;
    }

    makeRegister() {
        const registerBox = document.createElement("div");
        const registerButton = document.createElement("button");

        registerBox.classList.add("register-box");
        registerButton.classList.add("button");
        registerButton.innerHTML = "Register an account";
        registerButton.addEventListener("click", () => {
            location.hash = "register-form";
        });
        registerBox.appendChild(registerButton);
        return registerBox;
    }

    async render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Email"));
        form.appendChild(this.makeInput("email", true, "email"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const result = await userModel.login(this.userInfo.email);
            if (result) {
                location.hash = "";
                localStorage.setItem("userId", result._id)
            } else {
                document.getElementById("loginError").style.opacity = "1";
            }
        });

        this.appendChild(this.makeError());
        this.appendChild(form);
        this.appendChild(this.makeRegister());
    }
}

