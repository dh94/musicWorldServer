import * as mongoose from 'mongoose';
import { IArtist } from './Artist';

export interface ISong extends mongoose.Document {
	name: string;
	artist: string | IArtist;
	album?: string;
	publisher: string;
	publicationYear: number;
	genere: string;
	views?: number;
	words: string;
}

export const SongSchema = new mongoose.Schema({
	name: String,
	artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
	album: String,
	publisher: String,
	publicationYear: Number,
	genere: String,
	views: Number,
	words: String,
});

const Song = mongoose.model<ISong>('Song', SongSchema);
export default Song;
