import { components as GridComponents } from "@penta-b/grid";
import React from "react";
import { useEffect, useState } from "react";

// import { feature } from "@turf/turf";

export default function HosnyContainer({ features, layer }) {
  const Grid = GridComponents.Grid;
  const parsedData = features.features.map((feature) => feature.properties);

  useEffect(() => {
    console.log("hello from hosny container");
    console.log("hosnyContainer", layer);
    console.log(parsedData);
  }, []);

  const colmunsData = layer.hosnyField.map((field) => {
    return {
      id: field.fieldName,
      name: field.alias,
      type: field.dataType,
      display: "basic",
      filterable: false,
      sortable: false,
    };
  });
  // [
  //   { id: "id", name: "ID", type: "INT", display: "basic" },
  //   { id: "name", name: "Name", type: "string", display: "basic" },
  // ],
  return (
    <div>
      <Grid
        settings={{
          name: "FEATURES",
          id: layer.id,
          sortable: false,
          filterable: false,
          pageSizeOptions: [10, 20, 40],
          pageSize: 10,
          columns: colmunsData,
          data: parsedData,
        }}
      />
    </div>
  );
}
