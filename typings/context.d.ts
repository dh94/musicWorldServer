import { Request } from 'Express';
import { UserService } from '../src/api/user/user.service';
import { SongService } from "../src/api/song/song.service";

export interface IConnectors {
	user: UserService;
	song: SongService;
}

export interface IGraphQLContext {
	connectors: IConnectors;
	req: Request;
}
