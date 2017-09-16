const User = require('../db/models/User');

module.exports = class UserService {

	static createUser({ userName, password, firstName, lastName }) {
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

	static verifyUser({ userName, password }) {
		return User.findOne({
			userName,
			password,
		}).then(user => {
			if (!user)
				throw new Error("incorrect parameters");
			return user;
		});
	}

	static findUsers({ ids }) {
		return User.find({
			_id: {
				$in: ids
			}
		})
	}
}
