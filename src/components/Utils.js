import { getLength, getArea } from "ol/sphere.js";

function calcLength(polygon, projectionCode) {
  const length = getLength(polygon, { projection: "EPSG:4326" });
  return length;
}

function calcArea(polygon, projectionCode) {
  const area = getArea(polygon, { projection: "EPSG:4326" });
  return area;
}

export { calcArea, calcLength };
