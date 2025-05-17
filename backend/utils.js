export function convertDecimalObjects(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalObjects);
  } else if (obj !== null && typeof obj === "object") {
    // Handle actual Decimal128 object
    if (typeof obj.toString === "function" && obj._bsontype === "Decimal128") {
      return parseFloat(obj.toString());
    }

    // Handle Extended JSON format: { "$numberDecimal": "..." }
    if (Object.keys(obj).length === 1 && obj.$numberDecimal !== undefined) {
      return parseFloat(obj.$numberDecimal);
    }

    // Recursively process nested objects
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertDecimalObjects(obj[key]);
    }
    return newObj;
  }
  return obj;
}
