import ticketModel from "../ticketModel.js";

export default class TicketRepository extends HTMLElement {
    constructor() {
        super();
        this.tickets = [];
        this.filterOptions = {
            status: '',  // Can be 'recieved', 'inProgress', or 'closed'
            category: '', // For filtering by category
            sort: 'asc',  // Can be 'asc' or 'desc' for sorting by time-created
            search: "" // search title, description, category, agent or user
        };
    }

    async connectedCallback() {
        this.tickets = await ticketModel.fetcher("tickets");
        this.render();

        this.attachEventListeners();
    }

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

        this.querySelector('input[type="search"]').addEventListener('input', (event) => {
            this.handleFilterChange(event);
        });
    }

    handleFilterChange(event) {
        const { name, value } = event.target;
        this.filterOptions[name] = value;
    
        this.renderTicketList();
    }
    
    filterAndSortTickets() {
        let filteredTickets = [...this.tickets];

        // Filter by search
        if (this.filterOptions.search) {
            const searchTerm = this.filterOptions.search.toLowerCase();
            filteredTickets = filteredTickets.filter(ticket => {
                return  ticket.title.toLowerCase().includes(searchTerm) ||
                        ticket.description.toLowerCase().includes(searchTerm) ||
                        ticket.category.toLowerCase().includes(searchTerm) ||
                        (ticket.agent?.name?.toLowerCase() || '').includes(searchTerm) ||
                        (ticket.agent?.id?.toLowerCase() || '').includes(searchTerm) ||
                        (ticket.user?.name?.toLowerCase() || '').includes(searchTerm) ||
                        (ticket.user?.id?.toLowerCase() || '').includes(searchTerm);
            });
        }

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
    
        // Sort by time-updated if available, otherwise by time-created
        filteredTickets.sort((a, b) => {
            // Check if 'time-updated' exists and is not an empty string
            const dateA = this.parseDateString(a['time-updated'] || a['time-created']);
            const dateB = this.parseDateString(b['time-updated'] || b['time-created']);
            
            return this.filterOptions.sort === 'asc' ? dateA - dateB : dateB - dateA;
        });
    
        return filteredTickets;
    }
    
    parseDateString(timeString) {
        // Assuming the format: "HH:mm:ss - DD - MM - YYYY"
        const [time, day, month, year] = timeString.split(' - ');
        const [hours, minutes, seconds] = time.split(':');
    
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    async render() {
        if (!this.hasRenderedFilters) {
            const categories = await ticketModel.fetcher("categories");
            let categoryList = ``;

            categories.forEach(category => {
                categoryList += `<option value="${category.name}">${category.name}</option>`;
            });

            this.innerHTML = `
                <h2>All tickets</h2> 
    
                <div class="filter-sort-controls">
                    <label>
                        Status:
                        <select name="status">
                            <option value="">All</option>
                            <option value="recieved">Recieved</option>
                            <option value="In progress">In progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </label>
                    <label>
                        Category:
                        <select name="category">
                            <option value="">All</option>
                            ${categoryList}
                        </select>
                    </label>
                    <label>
                        Sort by updates:
                        <select name="sort">
                            <option value="asc">Oldest First</option>
                            <option value="desc">Newest First</option>
                        </select>
                    </label>
                    <label>
                        Search through tickets:
                        <input type="search" class="input input-search" name="search" placeholder="e.g. 'can't log in' or 'John Smith'">
                    </label>
                </div>
    
                <div class="ticket-list"></div>
            `;
    
            this.querySelector('select[name="status"]').value = this.filterOptions.status;
            this.querySelector('select[name="category"]').value = this.filterOptions.category;
            this.querySelector('select[name="sort"]').value = this.filterOptions.sort;
    
            this.hasRenderedFilters = true;
        }

        this.renderTicketList();
        this.attachEventListeners();
    }
    
    renderTicketList() {
        const filteredTickets = this.filterAndSortTickets();
        const list = filteredTickets.map(ticket => {
            return `
                <single-ticket 
                    ticket='${JSON.stringify(ticket)}'
                    editable='false'>
                </single-ticket>`;
        }).join("");
    
        this.querySelector('.ticket-list').innerHTML = list;
    }
    
}
