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

    makeRegister() {
        const registerBox = document.createElement("div");

        registerBox.classList.add("register-box");

        const registerText = document.createElement("p");

        registerText.innerHTML = "Dont have an account?";

        const registerButton = document.createElement("button");

        registerButton.classList.add("button");
        registerButton.innerHTML = "Create account";
        registerButton.addEventListener("click", () => {
            location.hash = "register-form";
        });
        registerBox.appendChild(registerText);
        registerBox.appendChild(registerButton);
        return registerBox;
    }

    async render() {
        const form = document.createElement("form");

        form.appendChild(this.makeInputLabel("Email"));
        form.appendChild(this.makeInput("email", true, "email"));
        form.appendChild(this.makeInputLabel("Password"));
        form.appendChild(this.makeInput("password", true, "password"));
        form.appendChild(this.makeSubmit());

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const result = await userModel.login(this.userInfo.email, this.userInfo.password);

            if (result) {
                localStorage.setItem("userId", result._id)
                const accountEvent = new Event('accountUpdate');
                window.dispatchEvent(accountEvent);
                console.log("HEJE")
                if (result.firstTimeLogin) {
                    location.hash = "ChangePassword";
                } else {
                    location.hash = "";
                    //TODO: change depending on user type
                }
            } else {
                document.getElementById("loginError").style.opacity = "1";
            }
        });

        this.appendChild(this.makeError());
        this.appendChild(form);
        this.appendChild(this.makeRegister());
    }
}

