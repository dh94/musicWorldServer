import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	userName: string;
	firstName: string;
	lastName: string;
	password: string;
}

export const UserSchema = new mongoose.Schema({
	userName:  { type: String, required: true },
	firstName: { type: String, required: true },
	lastName:  { type: String, required: true },
	password:  { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
