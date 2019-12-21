import Mixpanel from 'mixpanel';

import { serverConfig } from '../constants/env';






export class MixpanelHelper {

  public static mixpanel;

  public static init() {
    MixpanelHelper.mixpanel = Mixpanel.init(serverConfig.tracking.mixpanelToken)


  }

}