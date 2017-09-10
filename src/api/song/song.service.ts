import Song, { ISong } from '../../db/models/Song';

export class SongService {
	public createSong({ name,
		artist,
		album,
		publisher,
		publicationYear,
		genere,
		words }): Promise<ISong> {
		const song = new Song();
		song.album = album;
		song.publisher = publisher;
		song.publicationYear = publicationYear;
		song.genere = genere;
		song.words = words;
		return song.save();
	}

	public topSongs() {
		return Song.find({}).sort('views').limit(10);
	}
}
