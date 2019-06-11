import {Service} from "@tsed/di";
import {ITokenPayload} from "passport-azure-ad";
import {User} from "../models/User";

@Service()
export class AuthService {
  add(token: ITokenPayload) {
    return null;
  }

  authenticate(token: ITokenPayload, options: any): User {
    return null;
  }
}
