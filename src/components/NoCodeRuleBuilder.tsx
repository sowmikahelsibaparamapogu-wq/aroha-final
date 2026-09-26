import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface NoCodeRuleBuilderProps {
  applications: Application[];
}

interface RuleCondition {
  id: string;
  field: 'qualifyingPercentage' | 'annualFamilyIncome' | 'gender' | 'stCommunity' | 'age';
  operator: '>=' | '<=' | '==' | '!=' | 'contains';
  value: string;
}

export const NoCodeRuleBuilder: React.FC<NoCodeRuleBuilderProps> = ({ applications }) => {
  const [ruleName, setRuleName] = useState('Special Affirmative Action Rule (PVTG / High Distinction)');
  const [operatorCombiner, setOperatorCombiner] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<RuleCondition[]>([
    { id: 'cond_1', field: 'qualifyingPercentage', operator: '>=', value: '60' },
    { id: 'cond_2', field: 'annualFamilyIncome', operator: '<=', value: '600000' },
  ]);
  const [testResult, setTestResult] = useState<{ evaluated: boolean; matchedCount: number }>({
    evaluated: false,
    matchedCount: 0,
  });

  // Add condition block
  const handleAddCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        id: `cond_${Date.now()}`,
        field: 'qualifyingPercentage',
        operator: '>=',
        value: '55',
      },
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, key: keyof RuleCondition, val: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: val } : c))
    );
  };

  // Run live evaluation on applications
  const handleEvaluate = () => {
    const matched = applications.filter((app) => {
      const results = conditions.map((cond) => {
        let appVal: any;
        if (cond.field === 'qualifyingPercentage') appVal = app.academic?.qualifyingPercentage || 0;
        if (cond.field === 'annualFamilyIncome') appVal = app.applicant?.annualFamilyIncome || 0;
        if (cond.field === 'gender') appVal = app.applicant?.gender || '';
        if (cond.field === 'stCommunity') appVal = app.applicant?.stCommunity || '';

        const targetVal = parseFloat(cond.value) || cond.value;

        switch (cond.operator) {
          case '>=':
            return Number(appVal) >= Number(targetVal);
          case '<=':
            return Number(appVal) <= Number(targetVal);
          case '==':
            return String(appVal).toLowerCase() === String(targetVal).toLowerCase();
          case '!=':
            return String(appVal).toLowerCase() !== String(targetVal).toLowerCase();
          case 'contains':
            return String(appVal).toLowerCase().includes(String(targetVal).toLowerCase());
          default:
            return true;
        }
      });

      if (operatorCombiner === 'AND') {
        return results.every(Boolean);
      } else {
        return results.some(Boolean);
      }
    });

    setTestResult({
      evaluated: true,
      matchedCount: matched.length,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Declarative Eligibility Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Eligibility Rules Architect
          </h2>
        </div>

        <button
          type="button"
          onClick={handleEvaluate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Execute Live Test Simulation</span>
        </button>
      </div>

      {/* Rule Definition Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Rule Policy Designation
          </label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="w-full max-w-xl p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-slate-700">Logical Match Operator:</span>
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setOperatorCombiner('AND')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                operatorCombiner === 'AND' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              AND (All Conditions Mandatory)
            </button>
            <button
              type="button"
              onClick={() => setOperatorCombiner('OR')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                operatorCombiner === 'OR' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              OR (Any Condition Sufficient)
            </button>
          </div>
        </div>

        {/* Condition Blocks List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Evaluation Conditions ({conditions.length})
          </div>

          {conditions.map((cond, idx) => (
            <div
              key={cond.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs"
            >
              <span className="font-bold text-slate-400 font-mono">#{idx + 1}</span>

              {/* Field Select */}
              <select
                value={cond.field}
                onChange={(e) => updateCondition(cond.id, 'field', e.target.value)}
                className="p-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold outline-none"
              >
                <option value="qualifyingPercentage">Qualifying Degree Marks (%)</option>
                <option value="annualFamilyIncome">Annual Family Income (INR)</option>
                <option value="gender">Applicant Gender</option>
                <option value="stCommunity">ST Community Tribe Name</option>
              </select>

              {/* Operator */}
              <select
                value={cond.operator}
                onChange={(e) => updateCondition(cond.id, 'operator', e.target.value)}
                className="p-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold outline-none"
              >
                <option value=">=">&gt;= (Greater or Equal)</option>
                <option value="<=">&lt;= (Less or Equal)</option>
                <option value="==">== (Exactly Equals)</option>
                <option value="!=">!= (Not Equals)</option>
                <option value="contains">contains (Sub-string)</option>
              </select>

              {/* Value Input */}
              <input
                type="text"
                value={cond.value}
                onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                placeholder="Value threshold"
                className="p-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold outline-none w-44"
              />

              <button
                type="button"
                onClick={() => handleRemoveCondition(cond.id)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-auto"
                title="Remove Condition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCondition}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Condition Block</span>
          </button>
        </div>

        {/* Live Simulation Preview Box */}
        {testResult.evaluated && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>
                Evaluation Complete: {testResult.matchedCount} of {applications.length} applications satisfy this active rule set.
              </span>
            </div>
            <span className="font-mono text-emerald-800 font-bold">
              {((testResult.matchedCount / Math.max(1, applications.length)) * 100).toFixed(1)}% Pass Rate
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
