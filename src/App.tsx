import { useState } from 'react';
import Canvas from './canvas/Canvas';
import DetailPanel from './components/DetailPanel';
import Timeline from './components/Timeline';
import StreamSelector from './components/StreamSelector';
import ImportDialog from './components/ImportDialog';
import CognitiveMapView from './components/CognitiveMapView';
import { Map } from 'lucide-react';

export default function App() {
  const [showCogMap, setShowCogMap] = useState(false);

  return (
    <div className="w-screen h-screen bg-slate-950 relative overflow-hidden">
      <Canvas />
      <StreamSelector />
      <DetailPanel />
      <Timeline />
      <ImportDialog />

      {/* Cognitive Map toggle */}
      <button
        onClick={() => setShowCogMap(true)}
        className="absolute top-4 left-[420px] z-50 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:border-purple-500 transition-colors shadow-lg flex items-center gap-2"
      >
        <Map size={16} />
        Cognitive Map
      </button>

      <CognitiveMapView open={showCogMap} onClose={() => setShowCogMap(false)} />
    </div>
  );
}
