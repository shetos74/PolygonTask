/**
 * Author: Amr Samir
 *
 * Description:
 *  - This index file exports plugin's components and/or reducers and/or actions.
 */

import HosnyTrigger from "./components/HosnyTrigger/HosnyTrigger";
import HosnyContainer from "./components/HosnyContainer/HosnyContainer.jsx";
import defaultLocalization from "./messages";
import { LOCALIZATION_NAMESPACE } from "./constants/constants";

HosnyTrigger.Title = LOCALIZATION_NAMESPACE + ":title";
HosnyTrigger.Icon = LOCALIZATION_NAMESPACE + ":icon";

const components = {
  HosnyTrigger,
  HosnyContainer,
};

const localization = {
  namespace: LOCALIZATION_NAMESPACE,
  defaultLocalization,
};

export { components, localization };
