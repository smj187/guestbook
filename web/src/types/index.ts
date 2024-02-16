export type GuestbookEntry = {
    id: number;
    name: string;
    message: string;
    created_at: string;
    updated_at: string;
    is_placeholder?: true // optional field required by the home view grid layout
};

type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ApiResponse = {
    data: GuestbookEntry[];
    pagination: Pagination;
};
