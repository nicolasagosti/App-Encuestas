export const formatDate = (d) => {
    if (!d) return '-';
    try {
        return new Date(d).toLocaleDateString('es-AR');
    } catch {
        return d;
    }
};
