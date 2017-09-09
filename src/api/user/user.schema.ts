import * as bluebird from 'Bluebird';
import { readFileSync } from 'fs';
import { pubsub } from '../subscriptions/pubsub';
import { USER_CREATED } from '../subscriptions/topics';
import { IGraphQLContext } from 'context';

export * from './user.service';

export const schema = [readFileSync(__dirname + '/user.gql', 'utf8')];

export const resolvers = {
	UserQueries: {
		me: (root, args, { req, connectors }: IGraphQLContext) => {
			if (req.session.userId)
				return connectors.user.findUsers({ ids: [req.session.userId] })
					.then(users => users && users.length === 1 ? users[0] : null);
		},
		users: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.user.findUsers(args);
		},
		user: (root, args, { connectors }: IGraphQLContext) => {
			return connectors.user.findUsers({ ids: [args.id] })
				.then(foundUsers => {
					return foundUsers[0];
				});
		},
	},
	UserMutations: {
		createUser: (root, args, { connectors, req }: IGraphQLContext) => {
			return connectors.user.createUser(args)
				.then(user => {
					req.session.userId = user.id;
					pubsub.publish(USER_CREATED, user);
					return user;
				});
		},
		loginUser: (root, args, { connectors, req }: IGraphQLContext) => {
			if (req.session.userId)
				throw new Error('user allready logged in');
			else
				return connectors.user.verifyUser(args)
					.then(user => {
						req.session.userId = user.id;
						return user;
					});
		},
		disconnect: (root, args, { req }: IGraphQLContext) => {
			return new bluebird((res, rej) => {
				req.session.destroy((err) => {
					if (err)
						rej(err);
					res(true);
				});
			});
		},
	},
	User: {
		isAdmin: (root) => root.userName === 'admin',
	},
};
