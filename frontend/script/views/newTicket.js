import ticketModel from "../ticketModel.js";
import userModel from "../userModel.js";

export default class NewTicket extends HTMLElement {
    constructor() {
        super();
        this.ticketinfo = {};
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
            this.ticketinfo[name] = event.target.value;
        });

        return newInput;
    }

    makeSelect(options, required, name) {
        const newSelect = document.createElement("select");
    
        newSelect.required = required;
        newSelect.classList.add("select");

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Category";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        newSelect.appendChild(defaultOption);

        options.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue.name;
            option.textContent = optionValue.name;
            newSelect.appendChild(option);
        });
    
        newSelect.addEventListener("change", (event) => {
            this.ticketinfo[name] = event.target.value;
        });
    
        return newSelect;
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
        newSubmit.setAttribute("value", "Submit");
        newSubmit.classList.add("button");
        return newSubmit;
    }

    makeFileInput(name) {
        const fileInput = document.createElement("input");
    
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("multiple", true);
        fileInput.setAttribute("accept", "image/png, image/jpeg, application/pdf");
        fileInput.classList.add("file-input");
    
        fileInput.addEventListener("change", (event) => {
            const selectedFiles = event.target.files;
    
            if (selectedFiles.length > 4) {
                alert("You can only upload up to 4 files.");
                fileInput.value = "";
            } else {
                this.ticketinfo[name] = selectedFiles;
            }
        });
    
        return fileInput;
    }
    

    async render() {
        const categories = await ticketModel.fetcher("categories");
        const form = document.createElement("form");
    
        form.setAttribute("enctype", "multipart/form-data");
    
        form.appendChild(this.makeInputLabel("Title"));
        form.appendChild(this.makeInput("text", true, "title"));
    
        form.appendChild(this.makeInputLabel("Describe the problem you are facing"));
        form.appendChild(this.makeInput("textarea", true, "description"));
    
        form.appendChild(this.makeInputLabel("Category"));
        form.appendChild(this.makeSelect(categories, false, "category"));
    
        form.appendChild(this.makeInputLabel("Attachments (up to 4 images/PDFs)"));
        form.appendChild(this.makeFileInput("attachments"));
    
        form.appendChild(this.makeSubmit());
    
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const formData = new FormData();
            formData.append("title", this.ticketinfo.title);
            formData.append("description", this.ticketinfo.description);
            formData.append("category", this.ticketinfo.category || "");

            // console.log(this.ticketinfo)
            if (this.ticketinfo.attachments) {
                Array.from(this.ticketinfo.attachments).forEach((file, index) => {
                    // console.log(file)
                    formData.append(`attachments`, file);
                });
            }
            
            // console.log(formData)
            const success = await ticketModel.newTicket(formData);
            if (success) {
                location.hash = "";
            }
        });
    
        this.appendChild(form);
    }
    
}
