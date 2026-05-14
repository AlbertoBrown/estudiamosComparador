import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs";
const outputPath = `${outputDir}/comisiones_y_tarifas_2_0.xlsx`;

const commissionRows = [
  ["Agente 1", "Repsol", 50, 80, 15],
  ["Agente 1", "Endesa", 40, 70, 15],
  ["Agente 1", "Naturgy", 35, 60, 15],
  ["Agente 1", "Iberdrola", 45, 90, 15],
  ["Agente 2", "Repsol", 50, 80, 15],
  ["Agente 2", "Endesa", 40, 70, 15],
  ["Agente 2", "Naturgy", 35, 60, 15],
  ["Agente 2", "Iberdrola", 45, 90, 15]
];

const tariffRows = [
  ["Repsol", "Ahorro Plus 2.0TD", "Fijo 24h", 0.1199, 0.1199, 0.1199, 0.0819, 0.0819, 80, "Nuevo cliente; 12 meses; Waylet"],
  ["Repsol", "Discriminacion Horaria 2.0TD", "3 periodos", 0.1689, 0.1189, 0.0999, 0.0901, 0.0901, 80, "Nuevo cliente; sin permanencia; Waylet"],
  ["LoGOs", "Precio Unico 2.0TD", "Fijo 24h", 0.175131, 0.175131, 0.175131, 0.086861, 0.012946, 65, "-25% primer ano; precio 24h"],
  ["LoGOs", "Precio Variable 2.0TD", "3 periodos", 0.246112, 0.177698, 0.146046, 0.086861, 0.012946, 65, "-25% primer ano; 3 periodos"],
  ["Endesa", "Luz Fija 24h Online", "Fijo 24h", 0.099999, 0.099999, 0.099999, 0.094967, 0.094967, 70, "Nuevo cliente; online; sin permanencia"],
  ["Endesa", "Conecta Luz", "Fijo 24h", 0.1135, 0.1135, 0.1135, 0.094967, 0.094967, 70, "Nuevo cliente; 20% dto.; precio 2 anos"],
  ["Endesa", "Conecta 3 Periodos", "3 periodos", 0.18621, 0.11781, 0.09441, 0.074012, 0.074012, 70, "Nuevo cliente; 10% dto.; valle barato"],
  ["Iberdrola", "Plan Online 3 Periodos", "3 periodos", 0.194, 0.136, 0.09999, 0.091074, 0.013483, 90, "Online; 3 periodos; sin permanencia"],
  ["Iberdrola", "Plan Estable", "Fijo 24h", 0.168625, 0.168625, 0.168625, 0.109562, 0.060247, 90, "Precio 24h; sin permanencia"],
  ["Naturgy", "Tarifa Por Uso Luz", "Fijo 24h", 0.1099, 0.1099, 0.1099, 0.12303, 0.037337, 60, "Nuevo cliente; 12 meses; sin permanencia"],
  ["Naturgy", "Tarifa Noche Luz", "3 periodos", 0.1802, 0.1072, 0.0718, 0.12303, 0.037337, 60, "Nuevo cliente; 3 periodos; valle barato"]
];

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Resumen");
const commissions = workbook.worksheets.add("Comisiones agentes");
const tariffs = workbook.worksheets.add("Tarifas 2.0TD");

for (const sheet of [summary, commissions, tariffs]) {
  sheet.showGridLines = false;
}

summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["Resumen comercial 2.0TD"]];
summary.getRange("A1").format = {
  fill: "#09257D",
  font: { color: "#FFFFFF", bold: true, size: 18 },
  horizontalAlignment: "center"
};

summary.getRange("A3:B7").values = [
  ["Concepto", "Valor"],
  ["Contratos simulados", null],
  ["Pago agentes total", null],
  ["Comision Estudiamos total", null],
  ["Comision total generada", null]
];
summary.getRange("B4:B7").formulas = [
  ["=SUM('Comisiones agentes'!C2:C9)"],
  ["=SUM('Comisiones agentes'!F2:F9)"],
  ["=SUM('Comisiones agentes'!G2:G9)"],
  ["=SUM('Comisiones agentes'!H2:H9)"]
];
summary.getRange("A3:B3").format = headerFormat();
summary.getRange("A4:A7").format = labelFormat();
summary.getRange("B4:B7").format = { font: { bold: true }, numberFormat: [["0"], ["#,##0.00 €"], ["#,##0.00 €"], ["#,##0.00 €"]] };

summary.getRange("D3:F8").values = [
  ["Comercializadora", "Comision base", "Contratos"],
  ["Repsol", 80, null],
  ["Endesa", 70, null],
  ["Naturgy", 60, null],
  ["Iberdrola", 90, null],
  ["LoGOs", 65, null]
];
summary.getRange("F4:F8").formulas = [
  ["=SUMIF('Comisiones agentes'!B:B,D4,'Comisiones agentes'!C:C)"],
  ["=SUMIF('Comisiones agentes'!B:B,D5,'Comisiones agentes'!C:C)"],
  ["=SUMIF('Comisiones agentes'!B:B,D6,'Comisiones agentes'!C:C)"],
  ["=SUMIF('Comisiones agentes'!B:B,D7,'Comisiones agentes'!C:C)"],
  ["=SUMIF('Comisiones agentes'!B:B,D8,'Comisiones agentes'!C:C)"]
];
summary.getRange("D3:F3").format = headerFormat();
summary.getRange("E4:E8").format.numberFormat = "#,##0.00 €";

commissions.getRange("A1:H1").values = [[
  "Agente", "Comercializadora", "Contratos", "Comision agente", "Comision Estudiamos", "Pago agentes", "Comision Estudiamos total", "Comision total"
]];
commissions.getRange("A2:E9").values = commissionRows;
commissions.getRange("F2:H2").formulas = [["=C2*D2", "=C2*E2", "=F2+G2"]];
commissions.getRange("F2:H9").fillDown();
commissions.getRange("A1:H1").format = headerFormat();
commissions.getRange("C2:C9").format.numberFormat = "0";
commissions.getRange("D2:H9").format.numberFormat = "#,##0.00 €";
commissions.tables.add("A1:H9", true, "TablaComisiones");
commissions.freezePanes.freezeRows(1);

tariffs.getRange("A1:J1").values = [[
  "Comercializadora", "Tarifa", "Tipo", "Energia P1 punta", "Energia P2 llano", "Energia P3 valle", "Potencia P1", "Potencia P2", "Comision base", "Claves"
]];
tariffs.getRange("A2:J12").values = tariffRows;
tariffs.getRange("A1:J1").format = headerFormat();
tariffs.getRange("D2:H12").format.numberFormat = "0.000000";
tariffs.getRange("I2:I12").format.numberFormat = "#,##0.00 €";
tariffs.tables.add("A1:J12", true, "TablaTarifas20TD");
tariffs.freezePanes.freezeRows(1);

setWidths(summary, [170, 150, 30, 160, 130, 100, 20, 20]);
setWidths(commissions, [120, 140, 90, 120, 120, 130, 120, 120]);
setWidths(tariffs, [130, 220, 110, 120, 120, 120, 105, 105, 110, 260]);

summary.getRange("A10:H10").merge();
summary.getRange("A10").values = [["Nota: precios orientativos segun la tabla del prototipo. Actualizar tarifas y comisiones antes de cerrar contratos."]];
summary.getRange("A10").format = { fill: "#EEF5FF", font: { color: "#143779", italic: true }, wrapText: true };

const inspectSummary = await workbook.inspect({
  kind: "table",
  range: "Resumen!A1:F10",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 8
});
console.log(inspectSummary.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan"
});
console.log(errors.ndjson);

await workbook.render({ sheetName: "Resumen", autoCrop: "all", scale: 1, format: "png" });
await workbook.render({ sheetName: "Comisiones agentes", autoCrop: "all", scale: 1, format: "png" });
await workbook.render({ sheetName: "Tarifas 2.0TD", autoCrop: "all", scale: 1, format: "png" });

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(outputPath);

function headerFormat() {
  return {
    fill: "#09257D",
    font: { color: "#FFFFFF", bold: true },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true
  };
}

function labelFormat() {
  return {
    fill: "#F4F6F9",
    font: { bold: true },
    wrapText: true
  };
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}
