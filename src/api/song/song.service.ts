import Artist from '../../db/models/Artist';
import Song, { ISong } from '../../db/models/Song';

export class SongService {
	public createSong({ name, artist, album, publisher, publicationYear, genere, words }): Promise<ISong> {
		const song = new Song();
		song.name = name;
		song.album = album;
		song.publisher = publisher;
		song.publicationYear = publicationYear;
		song.genere = genere;
		song.words = words;

		return Artist.findById(artist)
			.then(foundArtist => {
				if (!foundArtist)
					throw new Error("no such artist");
				song.artist = foundArtist;
				return song.save();
			});
	}

	public updateSong({ id, input: { name, album, publisher, publicationYear, genere, words } }): Promise<ISong> {
		return Song.findById(id)
			.then(song => {
				if (!song)
					throw new Error('no such song');
				if (name)
					song.name = name;
				if (album)
					song.album = album;
				if (publisher)
					song.publisher = publisher;
				if (publicationYear)
					song.publicationYear = publicationYear;
				if (genere)
					song.genere = genere;
				if (words)
					song.words = words;

				return song.save();
			});
	}

	public removeSong({ id }): Promise<ISong> {
		return Song.findByIdAndRemove(id)
			.then(song => {
				if (!song)
					throw new Error('no such song');
				return song;
			});
	}

	public songViewed({ id }): Promise<ISong> {
		return Song.findById(id)
			.then(song => {
				song.views += 1;
				return song.save()
					.then(() => song);
			});
	}

	public topSongs() {
		return Song.find({}).sort('-views').limit(10);
	}
}
