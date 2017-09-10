import { readFileSync } from 'fs';
import { IGraphQLContext } from "context";
export * from './song.service';

export const schema = [readFileSync(__dirname + '/song.gql', 'utf8')];

export const resolvers = {
	SongMutations: {
		createSong: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.createSong(args);
		},
	},
	SongQueries: {
		topSongs: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.topSongs();
		},
	},
};
