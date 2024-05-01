import {
  query,
  actionsRegistry,
  systemHideLoading,
  systemShowLoading,
  systemAddNotification,
  store,
} from "@penta-b/ma-lib";

const getFeature = async (data) => {
  try {
    store.dispatch(systemShowLoading());
    const res = await query.queryFeatures(data);
    const parsedRes = await JSON.parse(res.data[0].features);
    console.log("THIS IS RESPONSE", parsedRes);
    return parsedRes;
  } catch (err) {
    console.log("ERROR Fetching!!", err);
    store.dispatch(
      systemAddNotification(
        "Something Went Wrong!, Please Try Again Later.",
        "error"
      )
    );
  } finally {
    store.dispatch(systemHideLoading());
  }
};

// returns
const queryParams = (buffer, layer) => {
  //idk
  const returns = layer?.hosnyField.slice();
  // layer.geometryField && returns.push(layer.geometryField);

  return [
    {
      dataSource: {
        id: layer.id,
        // layerName: layer.name,
      },
      returns,
      filter: {
        // logicalOperation: "OR",
        conditionList: [
          {
            spatialCondition: {
              key: layer.geometryField.fieldName,
              geometry: JSON.stringify(buffer),
              spatialRelation: "INTERSECT",
            },
          },
        ],
      },
      crs: layer.crs,
    },
  ];
};

export { getFeature, queryParams };
