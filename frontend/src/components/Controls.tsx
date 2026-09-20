interface Props {
  onRunSolver: () => void;
  onReset: () => void;
}

export default function Controls({ onRunSolver, onReset }: Props) {
  return (
    <div className="mt-8 flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button 
          onClick={onRunSolver} 
          className="px-8 py-3 bg-red-600 rounded-lg hover:bg-red-500 font-bold shadow-lg transition-colors border border-red-400"
        >
          Run Logic Solver
        </button>
        <button 
          onClick={onReset} 
          className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 font-bold shadow-lg transition-colors border border-slate-500 text-slate-200"
        >
          Reset Board
        </button>
      </div>
      <p className="text-slate-400 text-sm">
        Finds all possible evil team combinations based on current claims.
      </p>
    </div>
  );
}