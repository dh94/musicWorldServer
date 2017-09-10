import { readFileSync } from 'fs';
import { IGraphQLContext } from "context";
export * from './song.service';

export const schema = [readFileSync(__dirname + '/song.gql', 'utf8')];

export const resolvers = {
	SongMutations: {
		createSong: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.song.createSong(args.input);
			else
				throw new Error('unauthorized');
		},
		updateSong: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.song.updateSong(args);
			else
				throw new Error('unauthorized');
		},
		removeSong: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.song.removeSong(args);
			else
				throw new Error('unauthorized');
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
	Song: {
		artist: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.artist.findById({ id: root.artist });
		},
	},
};
