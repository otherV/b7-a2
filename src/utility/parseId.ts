export const parseId = (id: string): number | null => {
    const parsed = parseInt(id);
    return isNaN(parsed) ? null : parsed;
};