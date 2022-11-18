/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { RenderResult } from "@testing-library/react";
import type { ApplicationBuilder } from "../test-utils/application-builder";
import { setupInitializingApplicationBuilder } from "../test-utils/application-builder";
import type { Discover } from "../../renderer/components/test-utils/discovery-of-html-elements";
import { discoverFor } from "../../renderer/components/test-utils/discovery-of-html-elements";

describe("show-about-using-tray", () => {
  let builder: ApplicationBuilder;
  let rendered: RenderResult;
  let discover: Discover;

  setupInitializingApplicationBuilder(b => builder = b);

  beforeEach(async () => {
    rendered = await builder.render();
    discover = discoverFor(() => rendered);
  });

  it("renders", () => {
    expect(rendered.baseElement).toMatchSnapshot();
  });

  it("does not show application preferences yet", () => {
    const { discovered } = discover.querySingleElement(
      "preference-page",
      "application-page",
    );

    expect(discovered).toBeNull();
  });

  describe("when navigating using tray", () => {
    beforeEach(async () => {
      await builder.tray.click("open-preferences");
    });

    it("renders", () => {
      expect(rendered.baseElement).toMatchSnapshot();
    });

    it("shows application preferences", () => {
      const { discovered } = discover.getSingleElement(
        "preference-page",
        "application-page",
      );

      expect(discovered).not.toBeNull();
    });
  });
});
