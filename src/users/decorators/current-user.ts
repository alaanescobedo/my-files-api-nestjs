import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: string | never, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (!data) return request.user
    return request.user[data]
  }
)