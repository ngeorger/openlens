/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { computeDefaultShortName } from "../../../common/catalog/helpers";
import { getInjectable } from "@ogre-tools/injectable";
import { hotbarStoreMigrationInjectionToken } from "../../../common/hotbars/migrations-token";

interface V630Alpha1HotbarItem {
  entity: {
    uid: string;
    name: string;
    shortName?: string;
    source?: string;
  };
  params?: Partial<Record<string, string>>;
}

interface V630Alpha1Hotbar {
  id: string;
  name: string;
  items: (null | V630Alpha1HotbarItem)[];
}

const v630Alpha1HotbarStoreMigrationInjectable = getInjectable({
  id: "v630-alpha1-hotbar-store-migration",
  instantiate: () => ({
    version: "5.6.0-alpha.7",
    run(store) {
      const hotbars = (store.get("hotbars") ?? []) as V630Alpha1Hotbar[];

      for (const hotbar of hotbars) {
        for (const item of hotbar.items) {
          if (item) {
            item.entity.shortName ??= computeDefaultShortName(item.entity.name);
          }
        }
      }

      store.set("hotbars", hotbars);
    },
  }),
  injectionToken: hotbarStoreMigrationInjectionToken,
});

export default v630Alpha1HotbarStoreMigrationInjectable;

