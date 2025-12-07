import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // 1. Prevent the client from hooking into the URL automatically. 
    // This often causes hangs in Next.js/React when the router is also trying to read the URL.
    detectSessionInUrl: false,
    
    // 2. (Optional) If you are still hanging, uncomment the line below.
    // It forces the client to use memory storage, bypassing LocalStorage locks entirely.
    // persistSession: false, 
  },
});