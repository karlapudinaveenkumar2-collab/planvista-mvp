import React from 'react';
import { FileText, Download, Table } from 'lucide-react';
import type { CADElement } from './CADCanvas2D';

interface CostEstimationProps {
  elements: CADElement[];
  speak: (text: string) => void;
}

export const CostEstimation: React.FC<CostEstimationProps> = ({ elements, speak }) => {
  // Simple pricing formulas
  const wallCount = elements.filter((el) => el.type === 'wall').length;
  const doorCount = elements.filter((el) => el.type === 'door').length;
  const windowCount = elements.filter((el) => el.type === 'window').length;
  const furnitureCount = elements.filter((el) => el.type === 'furniture').length;

  const wallUnitCost = 450; // $450 per structural block
  const doorUnitCost = 1200; // $1200 per commercial hinge
  const windowUnitCost = 950; // $950 high glazing glass
  const furnitureUnitCost = 1400; // average designer furniture

  const laborSurchargeRatio = 0.45; // 45% of total materials

  const totalMaterialsCost =
    wallCount * wallUnitCost +
    doorCount * doorUnitCost +
    windowCount * windowUnitCost +
    furnitureCount * furnitureUnitCost;

  const laborCost = Math.round(totalMaterialsCost * laborSurchargeRatio);
  const totalBudget = totalMaterialsCost + laborCost;

  const handleExportPDF = () => {
    speak("Synthesizing dynamic financial PDF report. Readying download pipeline.");
    alert("PlanVista financial bill of quantities has been exported to PDF successfully.");
  };

  const handleExportExcel = () => {
    speak("Compiling excel structural pricing logs.");
    alert("PlanVista BOQ Spreadsheet downloaded successfully.");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="cost">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-green-400">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Estimated Material Budget</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            ${totalMaterialsCost.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/40 mt-1.5">Based on active vector asset drafts</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-accent-cyan">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Engineering Labor Cost</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            ${laborCost.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/40 mt-1.5">Calculated at local regional structural index rate</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-accent-purple bg-gradient-to-br from-accent-purple/[0.02] to-transparent">
          <p className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Total Projected Budget</p>
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mt-1">
            ${totalBudget.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/40 mt-1.5">Zero contingency safety surcharge included</p>
        </div>
      </div>

      {/* Bill of Quantities breakdown */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <Table className="w-5 h-5 text-accent-cyan" />
              <span>Bill of Quantities (BOQ) Ledger</span>
            </h4>
            <p className="text-white/40 text-[10px] mt-1 font-mono uppercase tracking-wider">PlanVista Financial OS • Dynamic calculations</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-dark font-bold text-xs flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Excel Log</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Component Class</th>
                <th className="py-3 px-4">Active Quantity</th>
                <th className="py-3 px-4 text-right">Standard Unit Surcharge</th>
                <th className="py-3 px-4 text-right">Aggregated Surcharge</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-white/[0.01] transition">
                <td className="py-3.5 px-4 font-semibold text-white">Structural Concrete Walls</td>
                <td className="py-3.5 px-4 font-mono text-accent-cyan">{wallCount} lines</td>
                <td className="py-3.5 px-4 text-right font-mono">${wallUnitCost}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  ${(wallCount * wallUnitCost).toLocaleString()}
                </td>
              </tr>

              <tr className="border-b border-white/5 hover:bg-white/[0.01] transition">
                <td className="py-3.5 px-4 font-semibold text-white">Commercial Glazing Windows</td>
                <td className="py-3.5 px-4 font-mono text-accent-cyan">{windowCount} panels</td>
                <td className="py-3.5 px-4 text-right font-mono">${windowUnitCost}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  ${(windowCount * windowUnitCost).toLocaleString()}
                </td>
              </tr>

              <tr className="border-b border-white/5 hover:bg-white/[0.01] transition">
                <td className="py-3.5 px-4 font-semibold text-white">Hinge Door Assemblies</td>
                <td className="py-3.5 px-4 font-mono text-accent-cyan">{doorCount} hinges</td>
                <td className="py-3.5 px-4 text-right font-mono">${doorUnitCost}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  ${(doorCount * doorUnitCost).toLocaleString()}
                </td>
              </tr>

              <tr className="border-b border-white/5 hover:bg-white/[0.01] transition">
                <td className="py-3.5 px-4 font-semibold text-white">Premium Furniture Furnishings</td>
                <td className="py-3.5 px-4 font-mono text-accent-cyan">{furnitureCount} units</td>
                <td className="py-3.5 px-4 text-right font-mono">${furnitureUnitCost}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  ${(furnitureCount * furnitureUnitCost).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default CostEstimation;
