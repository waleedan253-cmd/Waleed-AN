// types/database.types.ts
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string;
          image_url: string;
          live_url: string | null;
          github_url: string | null;
          tech_stack: string[];
          category: string;
          published: boolean;
          featured: boolean;
          published_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description: string;
          image_url?: string;
          live_url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          category?: string;
          published?: boolean;
          featured?: boolean;
          published_date?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          image_url?: string;
          live_url?: string | null;
          github_url?: string | null;
          tech_stack?: string[];
          category?: string;
          published?: boolean;
          featured?: boolean;
          published_date?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          budget: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          budget?: string | null;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
};
