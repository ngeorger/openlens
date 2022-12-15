/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import type { CatalogEntity, CatalogEntityData, CatalogEntityKindData } from "../../../../common/catalog";
import entityPreferencesStoreInjectable from "../../../../common/entity-preferences/store.injectable";
import { toJS } from "../../../../common/utils";
import catalogEntityRegistryInjectable from "../../../../main/catalog/entity-registry.injectable";

const catalogEntityChangeSetInjectable = getInjectable({
  id: "catalog-entity-change-set",
  instantiate: (di) => {
    const entityPreferencesStore = di.inject(entityPreferencesStoreInjectable);
    const catalogEntityRegistry = di.inject(catalogEntityRegistryInjectable);

    const changesDueToPreferences = ({ metadata, spec, status, kind, apiVersion }: CatalogEntity): CatalogEntityData & CatalogEntityKindData => {
      const preferences = entityPreferencesStore.preferences.get(metadata.uid) ?? {};

      if (preferences.shortName) {
        metadata.shortName = preferences.shortName;
      }

      return { metadata, spec, status, kind, apiVersion };
    };

    return computed(() => toJS(catalogEntityRegistry.items.map(changesDueToPreferences)));
  },
});

export default catalogEntityChangeSetInjectable;
