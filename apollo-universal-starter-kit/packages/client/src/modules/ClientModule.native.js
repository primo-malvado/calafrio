import { merge } from 'lodash';
import BaseModule /*, { BaseModuleShape }*/ from './BaseModule';

/*
export interface ClientModuleShape extends BaseModuleShape {
  drawerItem?: any[];
}
interface ClientModule extends ClientModuleShape {}
*/
class ClientModule extends BaseModule {
  constructor(...modules /*: ClientModuleShape[]*/) {
    super(...modules);
  }

  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }
}

export default ClientModule;
