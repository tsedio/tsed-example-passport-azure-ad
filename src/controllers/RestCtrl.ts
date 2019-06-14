import {Controller, Get} from "@tsed/common";
import {OAuthBearer} from "../decorators/OAuthBearer";

@Controller("/rest")
export class RestCtrl {

  @Get("/hello-world")
  @OAuthBearer()
  helloWorld() {
    return "Hello world";
  }
}
