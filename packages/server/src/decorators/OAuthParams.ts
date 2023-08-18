import {Context, UsePipe} from "@tsed/common";
import {StoreSet, useDecorators} from "@tsed/core";
import {OAuthParamsPipe} from "../pipes/OAuthParamsPipe";

export function OAuthParams(expression: string) {
  return useDecorators(
    Context,
    StoreSet(OAuthParamsPipe, expression),
    UsePipe(OAuthParamsPipe)
  );
}
