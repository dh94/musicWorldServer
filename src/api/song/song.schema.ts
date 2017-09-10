import { readFileSync } from 'fs';
import { IGraphQLContext } from "context";
export * from './song.service';

export const schema = [readFileSync(__dirname + '/song.gql', 'utf8')];

export const resolvers = {
	SongMutations: {
		createSong: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.createSong(args.input);
		},
		updateSong: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.updateSong(args);
		},
		removeSong: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.removeSong(args);
		},
		songViewed: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.songViewed(args);
		},
	},
	SongQueries: {
		topSongs: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.song.topSongs();
		},
	},
};
