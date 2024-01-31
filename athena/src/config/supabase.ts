import { createClient } from "@supabase/supabase-js"
import ENV from "./env"
//Creates a client that talks to supabase, based on the environment variables.
export const supabase = createClient(ENV.SUPABASE_URL , ENV.SUPABASE_ANON_KEY)