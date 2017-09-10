import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { IConnectors } from 'context';

import { schema as rootSchema, resolvers as rootResolvers } from './root/root.schema';
import { schema as subscriptionSchema, resolvers as subscriptionsResolvers } from './subscriptions/subscriptions.schema';
import { schema as userSchema, resolvers as userResolvers, UserService as UserConnector } from './user/user.schema';
import { schema as songSchema, resolvers as songResolvers, SongService as SongConnector } from './song/song.schema';

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const schema = [...rootSchema, ...userSchema, ...songSchema, ...subscriptionSchema];
const resolvers = merge(rootResolvers, userResolvers, subscriptionsResolvers, songResolvers);
export function attachConnectors(context) {
	context.connectors = {
		user : new UserConnector(),
		song : new SongConnector(),
	} as IConnectors;
}

const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers,
});

export default executableSchema;
