import Config from "react-native-config"

//The environment variables that depend on the selected environment
interface EnvironmentVariables {
    BACKEND_URL: string;
    PBKDF2_ITERATIONS: number;
    PBKDF2_KEY_SIZE: number;
}

const DEV: EnvironmentVariables = {
    BACKEND_URL: Config.DEV_BACKEND_URL ?? "",
    PBKDF2_ITERATIONS: +(Config.DEV_PBKDF2_ITERATIONS ?? "0"),
    PBKDF2_KEY_SIZE: +(Config.DEV_PBKDF2_KEY_SIZE ?? "0")
}

const PROD: EnvironmentVariables = {
    BACKEND_URL: Config.PROD_BACKEND_URL ?? "",
    PBKDF2_ITERATIONS: +(Config.PROD_PBKDF2_ITERATIONS ?? "0"),
    PBKDF2_KEY_SIZE: +(Config.PROD_PBKDF2_KEY_SIZE ?? "0")
}

//The environment variables that should be the same regardless of selected environment
interface CommonEnvironmentVariables {
    RESET_APPLICATION_ON_STARTUP: boolean;
    IS_DEV: boolean;
    SECURE_STORE_USER_KEY: string;
    SECURE_STORE_ID_CARD_LIST_KEY: string;
}

const COMMON_ENV: CommonEnvironmentVariables = {
    RESET_APPLICATION_ON_STARTUP: Config.RESET_APPLICATION_ON_STARTUP === "true",
    IS_DEV: Config.IS_DEV === "true",
    SECURE_STORE_USER_KEY: Config.SECURE_STORE_USER_KEY ?? "",
    SECURE_STORE_ID_CARD_LIST_KEY: Config.SECURE_STORE_ID_CARD_LIST_KEY ?? ""
}

const SELECTED_ENV = Config.IS_DEV === "true" ? DEV : PROD
//Combining the two differen types of environment variables
const ENV : EnvironmentVariables & CommonEnvironmentVariables  = {
    ...COMMON_ENV,
    ...SELECTED_ENV
}

// Freezing to make object immutable
Object.freeze(ENV)
// Better to give explicit error immediately then to have another error occur later.
for(const key in ENV) {
    if(ENV[key as keyof (EnvironmentVariables & CommonEnvironmentVariables)] === "") throw new Error(`${key} environment variable for current environment is not defined.`)
    if(ENV[key as keyof (EnvironmentVariables & CommonEnvironmentVariables)] === 0) throw new Error(`${key} environment variable for current environment is not defined.`)
}

export default ENV