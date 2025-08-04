// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oggahglrzvvvvwwxqxzb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZ2FoZ2xyenZ2dnZ3d3hxeHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzA5ODUsImV4cCI6MjA2NDk0Njk4NX0.e2LYlCzm4aSB-osyOkjeo9FRKfCFXp8LiWz7n5fFInQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
