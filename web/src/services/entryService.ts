import { ApiResponse, GuestbookEntry } from "../types";

export class EntryService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async listEntriesAsync(pageSize: number, page: number): Promise<ApiResponse> {
        console.log("a")
        const response = await fetch(`${this.apiUrl}?pageSize=${pageSize}&page=${page}`);
        console.log("b")
        return response.json();


    }

    async deleteEntryAsync(id: number): Promise<void> {
        await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE'
        });

    }

    async createEntryAsync(name: string, message: string): Promise<GuestbookEntry> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message }),
        });



        return response.json()
    }

}

const entryService = new EntryService(import.meta.env.VITE_API_URL);
export default entryService;
