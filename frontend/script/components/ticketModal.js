import userModel from "../userModel.js";
import ticketModel from "../ticketModel.js";

export default class TicketModal extends HTMLElement {
    constructor() {
        super();
        this.ticketinfo = {};
        this.editable = false;
    }

    static get observedAttributes() {
        return ['ticket'];
    }

    get ticket() {
        return JSON.parse(this.getAttribute("ticket"));
    }

    connectedCallback() {
        this.render();
        const editableAttr = this.getAttribute('editable');
        this.editable = editableAttr === 'true'; // Convert the string to boolean
    }

    async makeAssignBtn(ticket) {
        const assignBtnElem = this.querySelector('.assign-btn');
        assignBtnElem.style.display = "none";
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        assignBtnElem.addEventListener('click', async () => {
            assignBtnElem.remove();
            await ticketModel.updateTicket(ticket._id, { status: "In progress", agent: { "id": user._id, "name": user.name } });
            document.getElementById("ticketStatus").innerHTML = "In progress";
            ticket.status = "In progress";
            document.getElementById("ticketAgent").innerHTML = user.name;
        });
        if (user.role === "agent" && (ticket.agent.id === null)) {
            assignBtnElem.style.display = "inline-block";
        }
    }

    async makeUpdateStatusBtn(ticket) {
        const statusBtnElem = this.querySelector('.status-btn');
        statusBtnElem.style.display = "none";
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        statusBtnElem.addEventListener('click', async () => {
            statusBtnElem.remove();
            if (ticket.status === "In progress") {
                await ticketModel.updateTicket(ticket._id, { status: "Closed"});
                document.getElementById("ticketStatus").innerHTML = "Closed";
            } else if (ticket.status === "Closed") {
                await ticketModel.updateTicket(ticket._id, { status: "In progress"});
                document.getElementById("ticketStatus").innerHTML = "In progress";
            }
            
        });
        if ((ticket.status === "In progress" || ticket.status === "Closed") && this.editable) {
            statusBtnElem.style.display = "inline-block";
        }
    }

    async makeAddCategoryBtn(ticket) {
        const categoryBox = this.querySelector('.category-btn');
        categoryBox.style.display = "none";

        const categorySelect = document.createElement("select");

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Category";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categorySelect.appendChild(defaultOption);

        const categories = await ticketModel.fetcher("categories");

        categories.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue.name;
            option.textContent = optionValue.name;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener("change", (event) => {
            this.ticketinfo["category"] = event.target.value;
        });

        const setCategoryBtn = document.createElement("button");

        setCategoryBtn.innerHTML = "Add";
        setCategoryBtn.style.marginLeft = "5px";
        setCategoryBtn.addEventListener('click', async () => {
            categoryBox.remove();

            await ticketModel.updateTicket(ticket._id, { category: this.ticketinfo["category"]});
        });
        if (!ticket.category && this.editable) {
            categoryBox.style.display = "inline-block";
        }

        categoryBox.appendChild(categorySelect);
        categoryBox.appendChild(setCategoryBtn);
    }

    makeCloseBtn() {
        this.querySelector('.modal-close').addEventListener('click', () => {
            this.remove();
            document.querySelector('.modal-background').remove();
        });
    }

    async render() {
        // console.log(this.editable)
        const user = await userModel.getUserById(localStorage.getItem("userId"));
        const ticket = this.ticket;
        const background = document.createElement('div');
        background.classList.add('modal-background');
        document.body.appendChild(background);

        // Construct the modal HTML
        this.innerHTML = `
            <button class="modal-close">X</button>
            <h2>${ticket.title}</h2>
            <p><strong>Description:</strong> ${ticket.description} </p>
            <p><strong>Status:</strong> <span id="ticketStatus">${ticket.status} </span> <span class="status-btn">${ticket.status === "In progress" ? "Close" : "Re-open"}</span> </p>
            <p><span><strong>Agent:</strong> <span id="ticketAgent">${ticket.agent.name || "Unassigned"}</span></span> <span class="assign-btn">Claim</span> </p>
            <p><span><strong>Customer:</strong> ${ticket.user.name}</span></p>
            <p><span><strong>Category:</strong> ${ticket.category || "Unassigned"} </span> <span class="category-btn"></span> </p>
            <p><strong>Created:</strong> ${ticket['time-created']} </p>
            <p><strong>Updated:</strong> ${ticket['time-updated'] === "" ? "N/A" : ticket['time-updated']} </p>
            <p><strong>Closed:</strong> ${ticket['time-closed'] === "" ? "N/A" : ticket['time-closed']} </p>
            <div class="attachments">
                <h3>Attachments:</h3>
                ${this.renderAttachments(ticket.attachments)}
            </div>
            <p>
                <h3>Comment:</h3>
                <div class="comment-box">
                    ${await this.renderComments(ticket.comment)}
                </div>
                ${(this.editable || user.role === "customer") ? `<add-comment ticket='${JSON.stringify(ticket)}'></add-comment>` : ""}
                
            </p>
        `;

        this.makeCloseBtn();
        await this.makeAddCategoryBtn(ticket);
        await this.makeAssignBtn(ticket);
        await this.makeUpdateStatusBtn(ticket);
    }

    renderAttachments(attachments) {
        if (!attachments || attachments.length === 0) {
            return '<p>No attachments found.</p>';
        }
    
        return attachments.map(attachment => {
            if (attachment.contentType.startsWith('image/')) {
                return `
                    <div>
                        <a href="data:${attachment.contentType};base64,${attachment.data}" target="_blank">
                            <img src="data:${attachment.contentType};base64,${attachment.data}" alt="Ticket Attachment""/>
                        </a>
                    </div>
                `;
            } else if (attachment.contentType === 'application/pdf') {
                return `
                    <div class="pdf-link">
                        <a href="data:${attachment.contentType};base64,${attachment.data}" target="_blank">${attachment.filename}</a>
                    </div>
                `;
            }
            return '';
        }).join('');
    }

    async renderComments(comments) {
        console.log(comments)
        if (!comments || comments.length === 0) {
            return '<p>No comments found.</p>';
        }

        return comments.map(comment => {
            if (comment.sender === "customer") {
                return `
                    <div class="box-me">
                        <div class="comment-msg comment-msg-me">
                            <div class="comment-msg-info">
                                ${comment.time}
                            </div>
                            <div class="comment-msg-msg">
                                ${comment.msg}
                            </div>
                        </div>
                    </div>
                `;
            }
            return `
                <div>
                    <div class="comment-msg comment-msg-other">
                        <div class="comment-msg-info">
                            ${comment.time}
                        </div>
                        <div class="comment-msg-msg">
                            ${comment.msg}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}
