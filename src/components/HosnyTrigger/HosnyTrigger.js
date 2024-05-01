import { useEffect, useRef, useState } from "react";
// import { createVectorLayer } from "../spaghetti";
import { getFeature, queryParams } from "../query";
import React from "react";
import { LOCALIZATION_NAMESPACE } from "../../constants/constants";
import { connect } from "react-redux";
import { LineString } from "ol/geom";
import { calcArea, calcLength } from "../Utils";
import {
  selectorsRegistry, // what is it doing???????
  actionsRegistry,
  apiRegistry,
  geometryService,
  store,
  systemAddNotification,
} from "@penta-b/ma-lib";
import * as turf from "@turf/turf";

// we gotta active and deactive the side bar that show the result
let vectorLayer = null;
let overlayLine = null;
var idComponent;
let overlayArray = [];

export default function HosnyTrigger({ settings, deactivate, isActive }) {
  const layer = settings?.dataSettings?.Layer;
  // const radiusNum = Number(settings?.behaviorSettings?.radiusNum);
  let drawing;
  // const idRef = useRef(idComponent);

  function showComponent(features) {
    actionsRegistry.dispatch(
      "showComponent",
      LOCALIZATION_NAMESPACE,
      "HosnyContainer",
      { features, layer },
      (id) => {
        idComponent = id;
        // idRef.current = id;
      }
      // () => {
      //   // setIdComponent(null);
      //   deactivate();
      //   // vectorLayer.clear();
      // }
    );
  }

  const removeVL = () => {
    if (vectorLayer) {
      vectorLayer.clear();
      actionsRegistry.dispatch("removeInteraction", drawing);
      vectorLayer = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      createVectorLayer();
      drawPointnBuffer();
      console.log(layer.id);
      console.log(layer);
      console.log(layer.name);
    } else {
      // removeComponent(idRef.current);
      removeComponent();
      removeVL();
      removePreviousOverlays();
    }
    // console.log("hi", idRef.current);
    console.log("settings", isActive);
    // console.log("id", id);
  }, [isActive]);

  // component w id why?

  function removeComponent() {
    // const id = idRef.current;
    if (idComponent) {
      // console.log("qdqq");
      actionsRegistry.dispatch("removeComponent", idComponent);
      // idRef.current = null;
    }
  }
  const createVectorLayer = () => {
    if (!vectorLayer) {
      apiRegistry.getApis(["VectorLayer"]).then(([VectorLayer]) => {
        vectorLayer = new VectorLayer();
        actionsRegistry.dispatch("addVectorLayer", vectorLayer);
        console.log("always run");
      });
    } else {
      vectorLayer.clear();
      console.log("never run");
    }
  };
  const drawPointnBuffer = () => {
    apiRegistry.getApis(["Drawing", "Overlay"]).then(([Drawing, Overlay]) => {
      drawing = new Drawing({
        type: "polygon",
        vectorLayer: vectorLayer,
      });

      actionsRegistry.dispatch("addInteraction", drawing);

      drawing.setOnDrawStart((cord, feature) => {
        // removePreviousOverlays();
        console.log("trarararararararar");
        feature.olFeature.getGeometry().on("change", (e) => {
          let geom = e.target;
          let coordinates = geom.getCoordinates()[0];
          console.log(coordinates);
          removePreviousOverlays();

          for (let i = 0; i < coordinates.length - 1; i++) {
            const start = coordinates[i];
            const end = coordinates[i + 1];
            const length = calcLength(new LineString([start, end]));
            const lineLengthInKm = length / 1000;
            const midLine = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

            let el = document.createElement("div");
            el.innerHTML = `${lineLengthInKm.toFixed(1)} km`;
            el.style.color = "#800080";
            let ov = new Overlay({
              element: el,
              position: midLine,
            });
            overlayArray.push(ov);
            actionsRegistry.dispatch("addOverlay", ov);
          }
        });
      });

      drawing.setOnDrawFinish((feature) => {
        if (vectorLayer) {
          vectorLayer.clear();
          vectorLayer.addFeature(feature);
          // actionsRegistry.dispatch("removeOverlay", overlayLength);
        }
        const centerPoint = geometryService.center(feature.getFeatureGeoJson());
        const coordd = feature.olFeature.getGeometry().getCoordinates()[0];
        removePreviousOverlays();
        const area = calcArea(feature.olFeature.getGeometry());
        const areaInKm = area / (1000 * 1000);
        const areaEl = document.createElement("div");

        areaEl.innerHTML = `${areaInKm.toFixed(2)} km&sup2`;
        areaEl.style.color = "#000000";

        const overlayArea = new Overlay({
          element: areaEl,
          position: centerPoint.geometry.coordinates,
          positioning: "center-center",
        });
        overlayArray.push(overlayArea);
        actionsRegistry.dispatch("addOverlay", overlayArea);

        for (let i = 0; i < coordd.length - 1; i++) {
          const startLine = coordd[i];
          const endLine = coordd[i + 1];
          const line = new LineString([startLine, endLine]);
          const lineLength = calcLength(line);
          const lineLengthInKm = lineLength / 1000;

          const midLine = [
            (startLine[0] + endLine[0]) / 2,
            (startLine[1] + endLine[1]) / 2,
          ];
          const el = document.createElement("div");
          el.innerHTML = `${lineLengthInKm.toFixed(1)} km`;
          el.style.color = "#800080";
          overlayLine = new Overlay({
            element: el,
            position: midLine,
            // offset: [0, 10],
            positioning: "bottom-center",
          });
          overlayArray.push(overlayLine);
          actionsRegistry.dispatch("addOverlay", overlayLine);
        }
        // showComponent(data);

        // const geo = feature.getFeatureGeoJson();
        const geo = feature.getGeometry();
        console.log(`THIS IS THE POINT(GEO):`, geo);

        removeComponent(); // why
        getFeature(queryParams(geo, layer)).then((data) => {
          console.log(data);
          if (data.features?.length > 0) {
            console.log(data.features);
            showComponent(data);
          } else {
            store.dispatch(
              systemAddNotification("No features Found in this area.", "error")
            );
          }
        });
      });
      // vectorLayer = null;
    });
  };

  return null;
}

const removePreviousOverlays = () => {
  overlayArray.forEach((overlay) => {
    actionsRegistry.dispatch("removeOverlay", overlay);
  });
  overlayArray = [];
};
