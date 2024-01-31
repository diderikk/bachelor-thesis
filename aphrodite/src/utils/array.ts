/**
 * Removes null and undefined values from an array
 * @param arr An array containing a objects of the type T or null or undefined
 * @returns A new array only containing objects of the type T
 */
export function removeNullOrUndefined<T> (arr: (T|null|undefined)[]): T[] {
    const newArr: T[] = []
    arr.forEach(element => {
        if(element !== null && element !== undefined) newArr.push(element)
    });
    return newArr
}