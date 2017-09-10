import Song from '../../db/models/Song';
import Artist, { IArtist } from '../../db/models/Artist';
export class ArtistService {
	public createArtist({ firstName, lastName, country }): Promise<IArtist> {
		const artist = new Artist();
		artist.firstName = firstName;
		artist.lastName = lastName;
		artist.country = country;
		return artist.save();
	}

	public updateArtist({ id, input: { firstName, lastName, country } }): Promise<IArtist> {
		return Artist.findById(id)
			.then(artist => {
				if (!artist)
					throw new Error('no such Artist');
				if (firstName)
					artist.firstName = firstName;
				if (lastName)
					artist.lastName = lastName;
				if (country)
					artist.country = country;
				return artist.save()
					.then(() => artist);
			});
	}

	public removeArtist({ id }): Promise<IArtist> {
		return Artist.findByIdAndRemove(id)
			.then(artist => {
				if (!artist)
					throw new Error('no such Artist');
				return artist;
			});
	}

	public findById({ id }): Promise<IArtist> {
		return Artist.findById(id).then(artist => artist);
	}

	public search({ firstName, lastName, country }): Promise<IArtist[]> {
		const qry: any = {};

		if (firstName)
			qry.firstName = new RegExp(`.*${firstName}.*`, "i");
		if (lastName)
			qry.lastName = new RegExp(`.*${lastName}.*`, "i");
		if (country)
			qry.country = country;

		return Artist.find(qry).then(artists => artists);
	}

	public topArtists() {
		return Song.aggregate(
			[
				{
					$group: {
						_id: { artist: '$artist' },
						totalViews: { $sum: '$views' },
					},
				},
				{
					$sort: {
						totalViews: -1,
					},
				},
				{ $limit: 10 },
			],
		).then(result => {
			return Artist.find({
				_id: {
					// tslint:disable-next-line:no-string-literal
					$in: result.map(res => res['_id'].artist),
				},
			}).then(artists => {
				const artistsWithViews = artists.map(artist => {
					// tslint:disable-next-line:no-string-literal
					artist.views = result.find(res => res['_id'].artist.toString() === artist.id)['totalViews'];
					return artist;
				});

				return artistsWithViews.sort((a, b) => b.views - a.views);
			});
		});
	}
}
