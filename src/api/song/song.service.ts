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

	public updateSong({ id, input: { name, artist, album, publisher, publicationYear, genere, words } }): Promise<ISong> {
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

				if (artist)
					return Artist.findById(artist)
						.then(foundArtist => {
							if (!foundArtist)
								throw new Error("no such artist");
							song.artist = foundArtist;
							return song.save();
						});
				else
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

	public allSongs() {
		return Song.find({});
	}

	public search({ name, album, publicationYear }): Promise<ISong[]> {
		const qry: any = {};

		if (name)
			qry.name = new RegExp(`.*${name}.*`, "i");
		if (album)
			qry.album = new RegExp(`.*${album}.*`, "i");
		if (publicationYear)
			qry.publicationYear = publicationYear;

		return Song.find(qry).then(songs => songs);
	}
}
