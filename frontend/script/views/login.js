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
        newSubmit.setAttribute("value", "Login");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    makeError() {
        const errorBox = document.createElement("div");

        errorBox.id = "loginError";
        errorBox.innerHTML = `Could not find account`;
        return errorBox;
    }

    async render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Email"));
        form.appendChild(this.makeInput("email", true, "email"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const result = await userModel.login(this.userInfo.email);
            //TODO: add password
            if (result) {
                location.hash = "";
                //TODO: change depending on user type
                localStorage.setItem("userId", result._id)
                const accountEvent = new Event('accountUpdate');
                window.dispatchEvent(accountEvent);
            } else {
                document.getElementById("loginError").style.opacity = "1";
            }
        });

        this.appendChild(this.makeError());
        this.appendChild(form);
    }
}

