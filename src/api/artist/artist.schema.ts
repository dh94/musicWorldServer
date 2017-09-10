import { readFileSync } from 'fs';
import { IGraphQLContext } from 'context';
export * from './artist.service';

export const schema = [readFileSync(__dirname + '/artist.gql', 'utf8')];

export const resolvers = {
	ArtistMutations: {
		createArtist: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.artist.createArtist(args.input);
			else
				throw new Error('unauthorized');
		},
		updateArtist: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.artist.updateArtist(args);
			else
				throw new Error('unauthorized');
		},
		removeArtist: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.artist.removeArtist(args);
			else
				throw new Error('unauthorized');
		},
	},
	ArtistQueries: {
		topArtists: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.artist.topArtists();
		},
		artist: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.artist.findById(args);
		},
		search: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.artist.search(args);
		},
	},
};
