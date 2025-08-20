// supabaseClient.js - Updated version
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://dkrnpejvnasbnrggzdfy.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcm5wZWp2bmFzYm5yZ2d6ZGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDUyMDcsImV4cCI6MjA3MDk4MTIwN30.kQP2XmWXczwxXaYYIyTqmfAnzmcjzMFMMlNcif0VBKo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Important for magic links
    flowType: 'pkce' // More secure flow
  }
});