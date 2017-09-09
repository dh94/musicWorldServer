import * as mongoose from 'mongoose';

export interface IArtist extends mongoose.Document {
	firstName: string;
	lastName: string;
	country: string;
	views?: number;
}

export const ArtistSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	country: String,
	views: Number,
});

const Artist = mongoose.model<IArtist>('Artist', ArtistSchema);
export default Artist;
