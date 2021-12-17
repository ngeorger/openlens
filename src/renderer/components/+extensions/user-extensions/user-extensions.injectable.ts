/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { Injectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed, IComputedValue } from "mobx";
import type { InstalledExtension } from "../../../../extensions/extension-discovery";
import type { ExtensionLoader } from "../../../../extensions/extension-loader";
import extensionLoaderInjectable from "../../../../extensions/extension-loader/extension-loader.injectable";

const userExtensionsInjectable: Injectable<
  IComputedValue<InstalledExtension[]>,
  { extensionLoader: ExtensionLoader }
> = {
  getDependencies: di => ({
    extensionLoader: di.inject(extensionLoaderInjectable),
  }),

  lifecycle: lifecycleEnum.singleton,

  instantiate: ({ extensionLoader }) =>
    computed(() => [...extensionLoader.userExtensions.values()]),
};

export default userExtensionsInjectable;