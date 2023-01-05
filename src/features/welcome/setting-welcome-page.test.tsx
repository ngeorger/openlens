/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { RenderResult } from "@testing-library/react";
import React from "react";
import type { ApplicationBuilder } from "../../renderer/components/test-utils/get-application-builder";
import { getApplicationBuilder } from "../../renderer/components/test-utils/get-application-builder";
import type { FakeExtensionOptions } from "../../renderer/components/test-utils/get-extension-fake";
import welcomeRouteConfigInjectable from "../../common/front-end-routing/routes/welcome/welcome-route-config.injectable";
import welcomeRouteInjectable from "../../common/front-end-routing/routes/welcome/welcome-route.injectable";
import type { Route } from "../../common/front-end-routing/front-end-route-injection-token";


describe("setting-welcome-page", () => {
  let builder: ApplicationBuilder;
  let rendered : RenderResult;
  let welcomeRoute: Route;

  beforeEach(() => {
    builder = getApplicationBuilder();
  });

  afterEach(() => {
    builder.quit();
  });

  describe("given configuration of welcome page route is the default", () => {
    beforeEach(async () => {
      builder.beforeApplicationStart((mainDi) => {
        mainDi.override(welcomeRouteConfigInjectable, () => "/welcome");
      });

      builder.beforeWindowStart((windowDi) => {
        windowDi.override(welcomeRouteConfigInjectable, () => "/welcome");
      });

      // enable the extension even though the welcomeRoute is not overriden
      builder.extensions.enable(extensionWithWelcomePage);
      rendered = await builder.render();

      const windowDi = builder.applicationWindow.only.di;

      welcomeRoute = windowDi.inject(welcomeRouteInjectable);
    });

    it("sets the default welcome page", () => {
      expect(welcomeRoute.path).toEqual("/welcome");
    });

    it("launches to the default welcome page", () => {
      const welcomePage = rendered.getByTestId("welcome-page");  // from the Welcome component (welcome.tsx)

      expect(welcomePage).toBeInTheDocument();
    });
  });

  describe("given configuration of welcome page route is set to a custom page", () => {
    beforeEach(async () => {
      builder.beforeApplicationStart((mainDi) => {
        mainDi.override(welcomeRouteConfigInjectable, () => "/extension/some-extension-name/some-welcome-page");
      });

      builder.beforeWindowStart((windowDi) => {
        windowDi.override(welcomeRouteConfigInjectable, () => "/extension/some-extension-name/some-welcome-page");
      });

      builder.extensions.enable(extensionWithWelcomePage);
      rendered = await builder.render();

      const windowDi = builder.applicationWindow.only.di;

      welcomeRoute = windowDi.inject(welcomeRouteInjectable);
    });

    it("sets the custom welcome page", () => {
      expect(welcomeRoute.path).toEqual("/extension/some-extension-name/some-welcome-page");
    });

    it("launches to the custom welcome page ", () => {
      const welcomePage = rendered.getByTestId("some-welcome-test-id");

      expect(welcomePage).toBeInTheDocument();
    });
  });
});

const extensionWithWelcomePage: FakeExtensionOptions = {
  id: "some-extension-id",
  name: "some-extension-name",

  rendererOptions: {
    globalPages: [
      {
        id: "some-welcome-page",
        components: {
          Page: () => <div data-testid="some-welcome-test-id">Welcome page</div>,
        },
      },
    ],
  },
};
