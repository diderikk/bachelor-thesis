import KeyValues from "../interfaces/KeyValues.interface";

/**
 * Converts an object containing key values to a string
 * @param keyValues Object with key and values
 * @returns string
 */
export const toString = (keyValues: KeyValues) => {
    let result = '';

    Object.keys(keyValues).forEach(key => {
      result += `${key}: ${keyValues[key]}\n`;
    });

    return result;
}