"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NutritionRows = ({ rows, setRows }) => {
  const updateRow = (index, key, value) => {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row))
    );
  };

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Nutritional information</p>
          <p className="text-xs text-muted-foreground">
            Add any rows you need. Leave this empty to hide the tab on the product page.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setRows((current) => [...current, { label: "", value: "" }])}
        >
          Add row
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="Name, for example Energy"
              value={row.label}
              onChange={(event) => updateRow(index, "label", event.target.value)}
            />
            <Input
              placeholder="Value, for example 486 kcal"
              value={row.value}
              onChange={(event) => updateRow(index, "value", event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}
            >
              Remove
            </Button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No nutrition rows yet.</p>
        )}
      </div>
    </div>
  );
};

export default NutritionRows;
