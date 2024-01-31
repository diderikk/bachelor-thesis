export default interface EnvironmentVariables {
    readonly PROTOCOL: string;
    readonly SERVER_URL: string;
    readonly BACKEND_URL: string;
    readonly SUPABASE_URL: string;
    readonly SUPABASE_ANON_KEY: string;
    readonly SUPABASE_USER_TABLE: string;
    readonly PBKDF2_ITERATIONS: number;
    readonly PBKDF2_KEY_SIZE: number;
}