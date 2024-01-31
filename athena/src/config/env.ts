import EnvironmentVariables from "../interfaces/config/EnvironmentVariables.interface"

const DEV: EnvironmentVariables = {
    PROTOCOL: process.env.DEV_PROTOCOL ?? "",
    SERVER_URL: process.env.DEV_SERVER_URL ?? "",
    BACKEND_URL: process.env.DEV_BACKEND_URL ?? "",
    SUPABASE_URL: process.env.DEV_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.DEV_SUPABASE_ANON_KEY ?? "",
    SUPABASE_USER_TABLE: process.env.DEV_SUPABASE_USER_TABLE ?? "",
    PBKDF2_ITERATIONS: +(process.env.DEV_PBKDF2_ITERATIONS ?? "0"),
    PBKDF2_KEY_SIZE: +(process.env.DEV_PBKDF2_KEY_SIZE ?? "0")
}

const PROD: EnvironmentVariables = {
    PROTOCOL: process.env.PROD_PROTOCOL ?? "",
    SERVER_URL: process.env.PROD_SERVER_URL ?? "",
    BACKEND_URL: process.env.PROD_BACKEND_URL ?? "",
    SUPABASE_URL: process.env.PROD_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.PROD_SUPABASE_ANON_KEY ?? "",
    SUPABASE_USER_TABLE: process.env.PROD_SUPABASE_USER_TABLE ?? "",
    PBKDF2_ITERATIONS: +(process.env.PROD_PBKDF2_ITERATIONS ?? "0"),
    PBKDF2_KEY_SIZE: +(process.env.PROD_PBKDF2_KEY_SIZE ?? "0")
}

//Choosing the environment variables based the selected environment.
const ENV = process.env.IS_DEV === "true" ? DEV : PROD
Object.freeze(ENV)

// Better to give explicit error immediately then to have another error occur later.
for(const key in ENV) {
    if(ENV[key as keyof EnvironmentVariables] === ""){
        throw new Error(`${key} environment variable for current environment is not defined.`)
    } 
    if(ENV[key as keyof EnvironmentVariables] === 0) throw new Error(`${key} environment variable for current environment is not defined.`)
}

export default ENV