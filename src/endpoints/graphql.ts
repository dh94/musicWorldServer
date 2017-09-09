import { graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import schema from '../api/schema';
import { attachConnectors } from '../api/schema';

const router = Router();
router.use('/graphql', graphqlExpress((req) => {
	const context = {};
	attachConnectors(context);
	return { 
		schema,
		context,
	};
}));

export default router;
