import { UserDTO } from "../models/userDTO";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
const URL_MS_USER = process.env.URL + "/api/users";

export default class UserService {
  // update user on ms-user
  public static updateUser(user: UserDTO) {
    axios
      .put(URL_MS_USER, { ...user, cards: [] })
      .then((res) => {
        console.log("user updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
