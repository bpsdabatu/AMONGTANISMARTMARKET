// Placeholder type. Setelah menjalankan migrasi di Supabase, generate ulang
// dengan Supabase CLI:
//
//   supabase gen types typescript --project-id <PROJECT_ID> --schema public > types/database.types.ts
//
// File ini sengaja dibiarkan longgar (Record<string, any>) agar project
// tetap type-check sebelum tipe asli di-generate dari database.

export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, any>; Insert: Record<string, any>; Update: Record<string, any> }>;
    Views: Record<string, { Row: Record<string, any> }>;
    Functions: Record<string, unknown>;
    Enums: Record<string, string>;
  };
};
