export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export type Database = {
    public: {
        Tables: {
            conversations: {
                Row: {
                    id: string;
                    customer_email: string;
                    customer_name: string;
                    subject: string;
                    status: 'open' | 'pending' | 'resolved' | 'closed';
                    priority: 'low' | 'medium' | 'high' | 'urgent';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    customer_email: string;
                    customer_name: string;
                    subject: string;
                    status?: 'open' | 'pending' | 'resolved' | 'closed';
                    priority?: 'low' | 'medium' | 'high' | 'urgent';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    customer_email?: string;
                    customer_name?: string;
                    subject?: string;
                    status?: 'open' | 'pending' | 'resolved' | 'closed';
                    priority?: 'low' | 'medium' | 'high' | 'urgent';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    role?: 'user' | 'assistant' | 'system';
                    content?: string;
                    created_at?: string;
                };
            };
        };
    };
};
//# sourceMappingURL=supabase.d.ts.map