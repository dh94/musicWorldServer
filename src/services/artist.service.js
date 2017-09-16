const Song = require('../db/models/Song');
const Artist = require('../db/models/Artist');

module.exports = class ArtistService {
	static createArtist({ firstName, lastName, country, lat, long }) {
		const artist = new Artist();
		artist.firstName = firstName;
		artist.lastName = lastName;
		artist.country = country;
		artist.lat = lat;
		artist.long = long;
		return artist.save();
	}

	static updateArtist({ id, input: { firstName, lastName, country, lat, long } }) {
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
				if (lat)
					artist.lat = lat;
				if (long)
					artist.long = long;
				return artist.save()
					.then(() => artist);
			});
	}

	static removeArtist({ id }) {
		return Song.remove({ artist: id})
			.then(() => {
				return Artist.findByIdAndRemove(id)
				.then(artist => {
					if (!artist)
						throw new Error('no such Artist');
					return artist;
				});
			});
	}

	static findById({ id }) {
		return Artist.findById(id).then(artist => artist);
	}

	static findAll() {
		return Artist.find({}).then(artists => artists);
	}

	static search({ firstName, lastName, country }) {
		const qry = {};

		if (firstName)
			qry.firstName = new RegExp(`.*${firstName}.*`, "i");
		if (lastName)
			qry.lastName = new RegExp(`.*${lastName}.*`, "i");
		if (country)
			qry.country = country;

		return Artist.find(qry).then(artists => artists);
	}

	static topArtists() {
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
