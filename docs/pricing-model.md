# Contractor pricing model development

Status: DRAFT. This first model is for workflow development with three fictitious examples. It contains no supplier rates, contractor confidential data or approved quotation.

Edit the **Import** worksheet. Keep its first row unchanged and export that worksheet as UTF-8 CSV for the portal. The import columns are exactly: `item_code,description,category,unit,quantity,unit_cost_ex_gst,markup_percent`. Enter numeric quantities, costs and markup percentages without currency symbols. A markup of 20 means 20% added to cost, not a 20% profit margin. Use unique item codes and non-negative numbers.

The **Estimate** worksheet calculates extended costs, selling prices, GST and totals in NZD. Its GST assumption is editable and initially 15%. Amounts round to cents. In this development template the estimate covers the three example rows; when adding rows, extend the linked detail formulas and SUM ranges. Export only the seven raw Import columns, never the Estimate worksheet.

The example CSV is an import demonstration. The workbook and CSV do not automatically synchronise with the portal or any cloud spreadsheet. Review the imported total against the workbook before using an estimate. The portal currently assumes 15% GST, so keep the workbook assumption at 15% when reconciling this preview.

Next development needs: actual contractor cost inputs, scope-to-item mapping, validation and row expansion, labour productivity, rates versioning, review/approval and secure contractor access. Agree those inputs before replacing fictitious rates.

Verification: artifact-tool formula recalculation, a zero-quantity input change, total reconciliation and formula-error scan passed. Saved XLSX cached totals were independently checked. Native Excel was not tested. Visual rendering could not complete because the bundled renderer failed to resolve Vulkan `vkEnumerateInstanceVersion`; review workbook appearance in Excel before external distribution.
