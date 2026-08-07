import React, { useRef, useEffect, useState } from 'react';
import { Square, Hammer, RefreshCw, Undo2, Layers, Compass, Plus, Sparkles, HelpCircle } from 'lucide-react';

interface CADCanvas2DProps {
  onUpdateElements: (elements: CADElement[]) => void;
  elements: CADElement[];
  onGenerateAIPlan?: (prompt: string) => void;
  speak: (text: string) => void;
}

export interface CADElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'room' | 'furniture';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name?: string;
}

export const CADCanvas2D: React.FC<CADCanvas2DProps> = ({
  onUpdateElements,
  elements,
  onGenerateAIPlan,
  speak,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'wall' | 'door' | 'window' | 'room' | 'furniture' | 'select'>('wall');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currPos, setCurrPos] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(true);
  const gridSize = 25;
  const [furnitureType, setFurnitureType] = useState<'chair' | 'table' | 'bed' | 'sofa'>('chair');
  const [aiPrompt, setAiPrompt] = useState('');

  // Snap function helper
  const snap = (val: number) => {
    if (!snapToGrid) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  // Redraw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0a0b10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw active elements
    elements.forEach((el) => {
      ctx.lineWidth = 3;
      if (el.type === 'wall') {
        ctx.strokeStyle = '#f5f5f7';
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();

        // Draw dimensions
        const dist = Math.sqrt(Math.pow(el.x2 - el.x1, 2) + Math.pow(el.y2 - el.y1, 2));
        const lenMeters = (dist / 15).toFixed(1); // 15px = 1 meter approximation
        ctx.fillStyle = '#00f0ff';
        ctx.font = '9px monospace';
        ctx.fillText(`${lenMeters}m`, (el.x1 + el.x2) / 2 + 5, (el.y1 + el.y2) / 2 - 5);
      } else if (el.type === 'door') {
        ctx.strokeStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
        // Door arc representation
        ctx.beginPath();
        ctx.arc(el.x1, el.y1, 15, 0, Math.PI / 2);
        ctx.stroke();
      } else if (el.type === 'window') {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
      } else if (el.type === 'room') {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.fillRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
        ctx.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px sans-serif';
        ctx.fillText(el.name || 'Room Space', el.x1 + 10, el.y1 + 18);
      } else if (el.type === 'furniture') {
        ctx.fillStyle = 'rgba(255, 165, 0, 0.15)';
        ctx.strokeStyle = '#ffa500';
        ctx.fillRect(el.x1 - 10, el.y1 - 10, 20, 20);
        ctx.strokeRect(el.x1 - 10, el.y1 - 10, 20, 20);
        ctx.fillStyle = '#ffa500';
        ctx.font = '8px monospace';
        ctx.fillText(el.name || 'furn', el.x1 - 10, el.y1 - 12);
      }
    });

    // Draw preview if actively drawing
    if (isDrawing) {
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      if (tool === 'wall') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(currPos.x, currPos.y);
        ctx.stroke();
      } else if (tool === 'room') {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.fillRect(startPos.x, startPos.y, currPos.x - startPos.x, currPos.y - startPos.y);
      }
      ctx.setLineDash([]);
    }
  }, [elements, isDrawing, startPos, currPos, tool, snapToGrid]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'select') return;
    const coords = getCoordinates(e);
    const snapped = { x: snap(coords.x), y: snap(coords.y) };
    setStartPos(snapped);
    setCurrPos(snapped);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const snapped = { x: snap(coords.x), y: snap(coords.y) };
    setCurrPos(snapped);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (tool === 'select') return;

    const coords = getCoordinates(e);
    const endSnapped = { x: snap(coords.x), y: snap(coords.y) };

    // Prevent zero-length elements
    if (Math.abs(startPos.x - endSnapped.x) < 5 && Math.abs(startPos.y - endSnapped.y) < 5 && tool !== 'furniture') {
      return;
    }

    const newElement: CADElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: tool,
      x1: startPos.x,
      y1: startPos.y,
      x2: tool === 'furniture' ? startPos.x : endSnapped.x,
      y2: tool === 'furniture' ? startPos.y : endSnapped.y,
    };

    if (tool === 'room') {
      newElement.name = prompt('Enter Room Label (e.g. Master Suite, Kitchen, Living Area):') || 'Living Room';
    } else if (tool === 'furniture') {
      newElement.name = furnitureType;
    }

    onUpdateElements([...elements, newElement]);
  };

  const clearCanvas = () => {
    speak("Clearing CAD Canvas and resetting blueprint buffers.");
    onUpdateElements([]);
  };

  const undoLast = () => {
    if (elements.length > 0) {
      speak("Undoing last drafted architectural segment.");
      onUpdateElements(elements.slice(0, -1));
    }
  };

  const handleAIGenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    if (onGenerateAIPlan) {
      onGenerateAIPlan(aiPrompt);
      setAiPrompt('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="cad">
      {/* Drafting Canvas Column */}
      <div className="lg:col-span-3 space-y-4">
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setTool('wall'); speak("Draft wall tool selected."); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                tool === 'wall' ? 'bg-accent-cyan text-dark' : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>Wall</span>
            </button>

            <button
              onClick={() => { setTool('door'); speak("Door installer tool selected."); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                tool === 'door' ? 'bg-accent-cyan text-dark' : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Door</span>
            </button>

            <button
              onClick={() => { setTool('window'); speak("Smart window tool selected."); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                tool === 'window' ? 'bg-accent-cyan text-dark' : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Window</span>
            </button>

            <button
              onClick={() => { setTool('room'); speak("Modular room boundary tool selected."); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                tool === 'room' ? 'bg-accent-cyan text-dark' : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Room</span>
            </button>

            <button
              onClick={() => { setTool('furniture'); speak("Furniture placement placement mode."); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                tool === 'furniture' ? 'bg-accent-cyan text-dark' : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Furniture ({furnitureType})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={undoLast}
              disabled={elements.length === 0}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition"
              title="Undo last element"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={clearCanvas}
              disabled={elements.length === 0}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 disabled:opacity-30 disabled:pointer-events-none transition"
              title="Clear Canvas"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-white/10 mx-1"></div>

            <label className="flex items-center gap-1.5 text-xs text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={() => setSnapToGrid(!snapToGrid)}
                className="rounded border-white/10 text-accent-cyan focus:ring-accent-cyan"
              />
              <span>Snap grid</span>
            </label>
          </div>
        </div>

        {/* The drawing Canvas area */}
        <div className="glass-card rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            className="w-full h-auto cursor-crosshair block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          <div className="absolute bottom-4 right-4 bg-dark/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[9px] text-accent-cyan font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>GRID SCALE: 1 UNIT = 15PX = 1.0M</span>
          </div>
        </div>
      </div>

      {/* Control panel column */}
      <div className="space-y-6">
        {/* Generative AI Floor Plan */}
        <div className="glass-card rounded-2xl p-5 border border-accent-cyan/20 bg-gradient-to-br from-accent-cyan/[0.02] to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
            <h4 className="text-white font-bold text-sm">Generative Floor Plan</h4>
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            Type an instruction or speak aloud to generate walls and furniture layouts automatically.
          </p>

          <form onSubmit={handleAIGenSubmit} className="space-y-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Create a modern master villa'..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent-cyan"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-accent-cyan text-dark font-bold text-xs transition duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instantly Generate Layout</span>
            </button>
          </form>
        </div>

        {/* Furniture Selector (only displayed when furniture tool active) */}
        {tool === 'furniture' && (
          <div className="glass-card rounded-2xl p-5 animate-fade-in">
            <h4 className="text-white font-bold text-sm mb-3">Furniture Type Selection</h4>
            <div className="grid grid-cols-2 gap-2">
              {(['chair', 'table', 'bed', 'sofa'] as const).map((furn) => (
                <button
                  key={furn}
                  onClick={() => { setFurnitureType(furn); speak(`Furniture item changed to ${furn}.`); }}
                  className={`py-2 rounded-lg text-xs capitalize transition ${
                    furnitureType === furn ? 'bg-orange-500/20 border border-orange-500 text-orange-400' : 'bg-white/5 border border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  {furn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Drafting Hints & Legends */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-white/50" />
            <span>Drafting Legend</span>
          </h4>
          <div className="space-y-2.5 font-mono text-[10px] text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#f5f5f7] inline-block rounded"></span>
              <span>Solid Wall (Volumetric Extrusion)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#8b5cf6] inline-block rounded"></span>
              <span>Hinge Swing Door Assembly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#00f0ff] inline-block rounded"></span>
              <span>Structural Insulated Glazing Window</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-accent-cyan/10 border border-accent-cyan/30 inline-block rounded"></span>
              <span>Room Volume Zone Identifier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500/15 border border-orange-500 inline-block rounded"></span>
              <span>Furniture placement asset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CADCanvas2D;
