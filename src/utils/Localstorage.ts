export const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
    if (typeof window !== "undefined") {
        let a = localStorage.getItem(key);
        if (a) return JSON?.parse(a)
    }
    else return null;
};

export const deleteItem = (key: string) => {
    localStorage.removeItem(key);
}