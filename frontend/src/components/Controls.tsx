interface Props {
  onRunSolver: () => void;
}

export default function Controls({ onRunSolver }: Props) {
  return (
    <div className="mt-8 flex flex-col items-center space-y-4">
      <button 
        onClick={onRunSolver} 
        className="px-8 py-3 bg-red-600 rounded-lg hover:bg-red-500 font-bold shadow-lg transition-colors border border-red-400"
      >
        Run Logic Solver
      </button>
      <p className="text-slate-400 text-sm">
        Finds all possible evil team combinations based on current claims.
      </p>
    </div>
  );
}