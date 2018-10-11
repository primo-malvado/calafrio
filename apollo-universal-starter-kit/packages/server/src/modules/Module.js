import { unfoldTo } from 'fractal-objects';

export default class Module {
  constructor(...modules) {
    unfoldTo(this, modules);
  }
}
