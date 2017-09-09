import { readFileSync } from 'fs';
export * from './song.service';

export const schema = [readFileSync(__dirname + '/song.gql', 'utf8')];

export const resolvers = {
};
