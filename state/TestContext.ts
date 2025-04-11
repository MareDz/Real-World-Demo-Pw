import { userDataConst } from "./UserConstants";
import { UserData } from "./UserModel";

export class TestContext {
  public userdata: UserData = userDataConst;
}

// TODO: How to declate UserData array here  with some different const name so that i can store 5 different users for and example
