import path from 'node:path';

const authDirectory = path.resolve('test-results/.auth');

export const authStatePath = path.join(authDirectory, 'user.json');
export const authSessionStoragePath = path.join(authDirectory, 'session-storage.json');
