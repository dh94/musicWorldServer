import * as mongoose from 'mongoose';

export interface IArtist extends mongoose.Document {
	firstName: string;
	lastName: string;
	country: string;
	views?: number;
	lat: number;
	long: number;
}

export const ArtistSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	country: String,
	lat: Number,
	long: Number,
});

const Artist = mongoose.model<IArtist>('Artist', ArtistSchema);
export default Artist;
