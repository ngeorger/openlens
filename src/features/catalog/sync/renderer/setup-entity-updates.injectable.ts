/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { beforeFrameStartsInjectionToken } from "../../../../renderer/before-frame-starts/tokens";
import requestCatalogEntityUpdatesInjectable from "./request-entity-updates.injectable";

const setupCatalogEntityUpdatesInjectable = getInjectable({
  id: "setup-catalog-entity-updates",
  instantiate: (di) => ({
    id: "setup-catalog-entity-updates",
    run: () => {
      const requestCatalogEntityUpdates = di.inject(requestCatalogEntityUpdatesInjectable);

      requestCatalogEntityUpdates();
    },
  }),
  injectionToken: beforeFrameStartsInjectionToken,
});

export default setupCatalogEntityUpdatesInjectable;
