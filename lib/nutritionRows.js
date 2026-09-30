export function nutritionRowsFromProduct(nutrition) {
  if (Array.isArray(nutrition)) {
    return nutrition
      .map((row) => ({
        label: String(row?.label || "").trim(),
        value: String(row?.value || "").trim(),
      }))
      .filter((row) => row.label || row.value);
  }

  if (nutrition && typeof nutrition === "object") {
    const legacy = [
      ["Energy", nutrition.energy],
      ["Protein", nutrition.protein],
      ["Carbohydrates", nutrition.carbohydrates],
      ["of which sugars", nutrition.sugars],
      ["Fat", nutrition.fat],
      ["Salt", nutrition.salt],
    ];
    return legacy
      .map(([label, value]) => ({ label, value: String(value || "").trim() }))
      .filter((row) => row.value);
  }

  return [];
}

export function cleanNutritionRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => ({
      label: String(row?.label || "").trim(),
      value: String(row?.value || "").trim(),
    }))
    .filter((row) => row.label || row.value);
}
