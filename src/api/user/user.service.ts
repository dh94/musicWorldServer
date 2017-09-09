import { IUser } from '../../db';
import User from '../../db/models/User';
import * as Dataloader from 'dataloader';

export class UserService {
	private userLoader: Dataloader<string, IUser>;
	constructor() {
		this.userLoader = new Dataloader<string, IUser>(userIds => this.loadUsers(userIds));
	}

	public createUser({ userName, password, firstName, lastName }): Promise<IUser> {
		const usr = new User();
		usr.userName = userName;
		usr.password = password;
		usr.firstName = firstName;
		usr.lastName = lastName;

		return User.findOne({ userName })
			.then(user => {
				if (user)
					throw new Error('user allready exists');
				return usr.save();
			});
	}

	public verifyUser({ userName, password }): Promise<IUser> {
		return User.findOne({
			userName,
			password,
		}).then(user => {
			if (!user)
				throw new Error("incorrect parameters");
			return user;
		});
	}

	public findUsers({ ids }): Promise<IUser[]> {
		return this.userLoader.loadMany(ids);
	}

	private loadUsers(ids): Promise<IUser[]> {
		return User.find({
			_id: {
				$in: ids,
			},
		}).then(results => {
			return ids.map(id => {
				return results.filter(result => `${result.id}` === id)[0];
			});
		});
	}
}
