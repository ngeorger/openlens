/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observable } from "mobx";
import { getGlobalOverride } from "../test-utils/get-global-override";
import type { EntityPreferencesStore } from "./store";
import entityPreferencesStoreInjectable from "./store.injectable";

export default getGlobalOverride(entityPreferencesStoreInjectable, () => ({
  preferences: observable.map(),
} as Partial<EntityPreferencesStore> as EntityPreferencesStore));
