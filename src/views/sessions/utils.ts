export const isOwnerOrGm = (
    userId: string,
    ownerId: string,
    mode: string,
    gmId?: string
) => {
    if (mode === 'session') {
        return gmId === userId;
    } else {
        return ownerId === userId;
    }
};
