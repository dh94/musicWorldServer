import { readFileSync } from 'fs';
export * from './artist.service';

export const schema = [readFileSync(__dirname + '/artist.gql', 'utf8')];

export const resolvers = {
};
