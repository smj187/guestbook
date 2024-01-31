import { ApiResponse, GuestbookEntry } from "../types";

export class EntryService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async fetchEntries(pageSize: number, page: number): Promise<ApiResponse> {
        const response = await fetch(`${this.apiUrl}?pageSize=${pageSize}&page=${page}`);
        if (!response.ok) {
            // TODO: handle error handling (show toast)
            throw new Error();
        }
        return response.json();
    }

    async deleteEntry(id: number): Promise<void> {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            // TODO: handle error handling (show toast)
            throw new Error();
        }
    }

    async createEntry(name: string, message: string): Promise<GuestbookEntry> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message }),
        });

        if (!response.ok) {
            // TODO: handle error handling (show toast)
            throw new Error();
        }

        return response.json()
    }

}

const entryService = new EntryService('http://localhost:8000');
export default entryService;
