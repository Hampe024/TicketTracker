import ticketModel from "../ticketModel.js";

export default class TicketRepository extends HTMLElement {
    constructor() {
        super();
        this.tickets = [];
        this.filterOptions = {
            status: '',  // Can be 'open', 'closed', or ''
            category: '', // For filtering by category
            sort: 'asc'  // Can be 'asc' or 'desc' for sorting by time-created
        };
    }

    async connectedCallback() {
        this.tickets = await ticketModel.fetcher("tickets");
        this.render();

        // Attach event listeners after rendering
        this.attachEventListeners();
    }

    // Attach event listeners to the filter controls
    attachEventListeners() {
        // Filter by status
        this.querySelector('select[name="status"]').addEventListener('change', (event) => {
            this.handleFilterChange(event);
        });

        // Filter by category
        this.querySelector('select[name="category"]').addEventListener('change', (event) => {
            this.handleFilterChange(event);
        });

        // Sort by time-created
        this.querySelector('select[name="sort"]').addEventListener('change', (event) => {
            this.handleFilterChange(event);
        });
    }

    handleFilterChange(event) {
        const { name, value } = event.target;
        this.filterOptions[name] = value;
        this.render();  // Re-render after the filter or sort is updated
        this.attachEventListeners();  // Re-attach the listeners after the re-render
    }

    filterAndSortTickets() {
        let filteredTickets = [...this.tickets];
    
        // Filter by status
        if (this.filterOptions.status) {
            filteredTickets = filteredTickets.filter(ticket => {
                return this.filterOptions.status === ticket.status;
            });
        }
    
        // Filter by category
        if (this.filterOptions.category) {
            filteredTickets = filteredTickets.filter(ticket => ticket.category === this.filterOptions.category);
        }
    
        // Sort by time-created
        filteredTickets.sort((a, b) => {
            const dateA = this.parseDateString(a['time-created']);
            const dateB = this.parseDateString(b['time-created']);
            return this.filterOptions.sort === 'asc' ? dateA - dateB : dateB - dateA;
        });
    
        return filteredTickets;
    }
    
    // Helper function to parse the 'time-created' string into a Date object
    parseDateString(timeString) {
        // Assuming the format: "HH:mm:ss - DD - MM - YYYY"
        const [time, day, month, year] = timeString.split(' - ');
        const [hours, minutes, seconds] = time.split(':');
    
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    render() {
        const filteredTickets = this.filterAndSortTickets();
        const list = filteredTickets.map(ticket => {
            return `
                <single-ticket 
                    ticket='${JSON.stringify(ticket)}'>
                </single-ticket>`;
        }).join("");

        this.innerHTML = `
            <h2>All tickets</h2> 

            <div class="filter-sort-controls">
                <label>
                    Status:
                    <select name="status">
                        <option value="">All</option>
                        <option value="recieved">Recieved</option>
                        <option value="inProgress">In progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </label>
                <label>
                    Category:
                    <select name="category">
                        <option value="">All</option>
                        <option value="network">Network</option>
                        <option value="software">Software</option>
                    </select>
                </label>
                <label>
                    Sort by:
                    <select name="sort">
                        <option value="asc">Oldest First</option>
                        <option value="desc">Newest First</option>
                    </select>
                </label>
            </div>

            <div class="ticket-list">
                ${list}
            </div>
        `;

        // Reapply the selected filter and sort values
        this.querySelector('select[name="status"]').value = this.filterOptions.status;
        this.querySelector('select[name="category"]').value = this.filterOptions.category;
        this.querySelector('select[name="sort"]').value = this.filterOptions.sort;
    }
}
