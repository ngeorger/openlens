/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./vpa-details.scss";

import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { DrawerItem } from "../drawer";
import { Badge } from "../badge";
import type { KubeObjectDetailsProps } from "../kube-object-details";
import { cssNames } from "../../utils";
import { VerticalPodAutoscaler } from "../../../common/k8s-api/endpoints/vertical-pod-autoscaler.api";
import type { ApiManager } from "../../../common/k8s-api/api-manager";
import logger from "../../../common/logger";
import type { GetDetailsUrl } from "../kube-detail-params/get-details-url.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import apiManagerInjectable from "../../../common/k8s-api/api-manager/manager.injectable";
import getDetailsUrlInjectable from "../kube-detail-params/get-details-url.injectable";

export interface VpaDetailsProps extends KubeObjectDetailsProps<VerticalPodAutoscaler> {
}

interface Dependencies {
  apiManager: ApiManager;
  getDetailsUrl: GetDetailsUrl;
}

@observer
class NonInjectedVpaDetails extends React.Component<VpaDetailsProps & Dependencies> {
  render() {
    const { object: vpa, apiManager, getDetailsUrl } = this.props;

    if (!vpa) {
      return null;
    }

    if (!(vpa instanceof VerticalPodAutoscaler)) {
      logger.error("[VpaDetails]: passed object that is not an instanceof VerticalPodAutoscaler", vpa);

      return null;
    }

    const { targetRef } = vpa.spec;

    return (
      <div className="VpaDetails">
        <DrawerItem name="Reference">
          {targetRef && (
            <Link to={getDetailsUrl(apiManager.lookupApiLink(targetRef, vpa))}>
              {targetRef.kind}
              /
              {targetRef.name}
            </Link>
          )}
        </DrawerItem>

        <DrawerItem
          name="Status"
          className="status"
          labelsOnly
        >
          {vpa.getReadyConditions()
            .map(({ type, tooltip, isReady }) => (
              <Badge
                key={type}
                label={type}
                tooltip={tooltip}
                className={cssNames({ [type.toLowerCase()]: isReady })}
              />
            ))}
        </DrawerItem>
      </div>
    );
  }
}

export const VpaDetails = withInjectables<Dependencies, VpaDetailsProps>(NonInjectedVpaDetails, {
  getProps: (di, props) => ({
    ...props,
    apiManager: di.inject(apiManagerInjectable),
    getDetailsUrl: di.inject(getDetailsUrlInjectable),
  }),
});
