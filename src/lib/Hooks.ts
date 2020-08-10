import Koa from 'koa';

export interface Hooks {
  globalBeforeCallHooks: ((ctx: Koa.Context) => Promise<void>)[]
}
