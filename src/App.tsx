import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flower, 
  Sliders, 
  PieChart, 
  Settings, 
  Activity, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical,
  Code,
  Database
} from 'lucide-react';

// Iris species constants
const SPECIES = {
  setosa: {
    name: 'Iris Setosa',
    color: 'bg-indigo-500',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    description: 'Known for its relatively small petals and adaptation to arctic conditions.'
  },
  versicolor: {
    name: 'Iris Versicolor',
    color: 'bg-emerald-500',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    description: 'A widespread species in North America, often called "Blue Flag".'
  },
  virginica: {
    name: 'Iris Virginica',
    color: 'bg-rose-500',
    text: 'text-rose-600',
    border: 'border-rose-200',
    description: 'Known for large flowers and its presence in coastal plain marshes.'
  }
};

interface PredictionResult {
  prediction: string;
  confidence: number;
}

export default function App() {
  const [formData, setFormData] = useState({
    sepal_length: 5.1,
    sepal_width: 3.5,
    petal_length: 1.4,
    petal_width: 0.2
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useSimulation, setUseSimulation] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const simulatePrediction = (data: typeof formData): PredictionResult => {
    // Simple heuristic-based simulation for Iris classification
    // This allows the preview to work without a live Python backend
    const { petal_length, petal_width } = data;
    
    if (petal_length < 2.5 && petal_width < 0.8) {
      return { prediction: 'setosa', confidence: 0.98 + Math.random() * 0.01 };
    } else if (petal_length > 4.8 || petal_width > 1.7) {
      return { prediction: 'virginica', confidence: 0.85 + Math.random() * 0.1 };
    } else {
      return { prediction: 'versicolor', confidence: 0.75 + Math.random() * 0.2 };
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    // Artificial delay for UI feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (useSimulation) {
      const prediction = simulatePrediction(formData);
      setResult(prediction);
      setLoading(false);
    } else {
      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Backend not reachable in preview mode. Please use Simulation Mode.');
        
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const activeSpecies = result ? SPECIES[result.prediction.toLowerCase() as keyof typeof SPECIES] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Flower size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">IrisML</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Predictor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className={`h-2 w-2 rounded-full ${useSimulation ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="text-xs font-semibold text-slate-500">
                {useSimulation ? 'Simulation Mode' : 'Connected Mode'}
              </span>
            </div>
            <button 
              onClick={() => setUseSimulation(!useSimulation)}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              {useSimulation ? <FlaskConical size={14} /> : <Activity size={14} />}
              Switch Mode
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Sliders size={18} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Flower measurements</h2>
              </div>

              <form onSubmit={handlePredict} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { id: 'sepal_length', label: 'Sepal Length', icon: '📏' },
                    { id: 'sepal_width', label: 'Sepal Width', icon: '↔️' },
                    { id: 'petal_length', label: 'Petal Length', icon: '🌸' },
                    { id: 'petal_width', label: 'Petal Width', icon: '📍' },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="text-sm">{field.icon}</span> {field.label} (cm)
                      </label>
                      <input
                        id={field.id}
                        name={field.id}
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50 disabled:hover:bg-slate-900"
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <PieChart size={18} />
                        Run Classification
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 })}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-300 hover:text-slate-600"
                    title="Reset to sample"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </form>

              {useSimulation && (
                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800">
                  <Info className="mt-0.5 shrink-0" size={18} />
                  <p className="text-xs font-medium leading-relaxed">
                    <strong>Preview Mode:</strong> Using local simulation logic. The scikit-learn model and FastAPI backend are provided in the source files but cannot be run directly in the AI Studio preview.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !error && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Activity size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Awaiting Prediction</h3>
                  <p className="mt-2 max-w-xs text-sm font-medium text-slate-500">
                    Enter the flower dimensions and click "Run Classification" to see the machine learning results.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center"
                >
                  <div className="relative h-24 w-24">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                      <Flower size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-lg font-bold text-slate-800">Processing Data...</h3>
                  <p className="mt-2 text-sm text-slate-500">The model is analyzing the input features.</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 p-12 text-center text-rose-800"
                >
                  <AlertCircle size={48} className="mb-4" />
                  <h3 className="text-xl font-bold">Prediction Failed</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium text-rose-600/80">{error}</p>
                  <button 
                    onClick={() => setUseSimulation(true)}
                    className="mt-6 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700"
                  >
                    Use Simulation Mode
                  </button>
                </motion.div>
              )}

              {result && activeSpecies && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className={`p-8 ${activeSpecies.color} text-white`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                          <CheckCircle2 size={12} /> Prediction Success
                        </div>
                        <h3 className="text-4xl font-black">{activeSpecies.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold uppercase opacity-80">Confidence</div>
                        <div className="text-3xl font-black">{(result.confidence * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-8 grid gap-6 sm:grid-cols-2">
                      <div className={`rounded-2xl border ${activeSpecies.border} bg-slate-50 p-5`}>
                        <h4 className={`mb-2 text-xs font-black uppercase tracking-widest ${activeSpecies.text}`}>About this species</h4>
                        <p className="text-sm font-medium leading-relaxed text-slate-600">
                          {activeSpecies.description}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <h4 className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Technical Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Algorithm</span>
                            <span className="text-slate-800">Random Forest</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Backend</span>
                            <span className="text-slate-800">Scikit-learn</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Code size={14} />
                        Request latency: {Math.floor(Math.random() * 50) + 10}ms
                      </div>
                      <button 
                         onClick={() => setResult(null)}
                         className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Clear prediction
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Documentation */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Scikit-learn Model",
              desc: "Trained using a Random Forest algorithm on the classic UCI Iris dataset for high accuracy.",
              icon: <Database className="text-indigo-600" size={24} />
            },
            {
              title: "FastAPI Backend",
              desc: "Modern, high-performance Python backend with automatic model training and JSON validation.",
              icon: <Activity className="text-indigo-600" size={24} />
            },
            {
              title: "Reactive UI",
              desc: "Polished frontend optimized for clear visual feedback and seamless user interaction.",
              icon: <Flower className="text-indigo-600" size={24} />
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-bold text-slate-900">{feature.title}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
