import { useState, useRef, useCallback, useEffect, useMemo } from "react";

// ─── Translations ───
const T = {
  bg: {
    title: "Дизайнер на плетива",
    newProject: "Нов проект",
    gridMode: "Решетка",
    freeMode: "Свободно",
    symbolView: "Символи",
    colorView: "Цветове",
    stitches: "Бодове",
    colors: "Палитра",
    tools: "Инструменти",
    undo: "Назад",
    redo: "Напред",
    clear: "Изчисти",
    mirror: "Огледало",
    zoom: "Мащаб",
    gridW: "Колони",
    gridH: "Редове",
    export: "Експорт",
    exportPNG: "PNG",
    exportSVG: "SVG",
    exportPDF: "PDF",
    save: "Запази",
    load: "Зареди",
    preview: "Преглед",
    generate: "Инструкции",
    stitchCount: "Бодове",
    rowCount: "Редове",
    crochet: "Куки",
    knitting: "Игли",
    crossStitch: "Кръстат бод",
    eraser: "Гумичка",
    fill: "Запълни",
    select: "Избери",
    draw: "Рисувай",
    pen: "Молив",
    line: "Линия",
    rect: "Правоъгълник",
    ellipse: "Елипса",
    instructions: "Текстови инструкции",
    close: "Затвори",
    projectName: "Име на проекта",
    lang: "EN",
    rows: "р.",
    cols: "к.",
  },
  en: {
    title: "Knitting Pattern Designer",
    newProject: "New Project",
    gridMode: "Grid",
    freeMode: "Freeform",
    symbolView: "Symbols",
    colorView: "Colors",
    stitches: "Stitches",
    colors: "Palette",
    tools: "Tools",
    undo: "Undo",
    redo: "Redo",
    clear: "Clear",
    mirror: "Mirror",
    zoom: "Zoom",
    gridW: "Columns",
    gridH: "Rows",
    export: "Export",
    exportPNG: "PNG",
    exportSVG: "SVG",
    exportPDF: "PDF",
    save: "Save",
    load: "Load",
    preview: "Preview",
    generate: "Instructions",
    stitchCount: "Stitches",
    rowCount: "Rows",
    crochet: "Crochet",
    knitting: "Knitting",
    crossStitch: "Cross-stitch",
    eraser: "Eraser",
    fill: "Fill",
    select: "Select",
    draw: "Draw",
    pen: "Pen",
    line: "Line",
    rect: "Rectangle",
    ellipse: "Ellipse",
    instructions: "Text Instructions",
    close: "Close",
    projectName: "Project name",
    lang: "BG",
    rows: "r.",
    cols: "c.",
  },
};

// ─── Stitch Definitions ───
const STITCH_SETS = {
  crochet: [
    { id: "ch", label: "Chain", labelBg: "Верижка", sym: "○", color: "#888" },
    { id: "sl", label: "Slip st", labelBg: "Хлъзгащ", sym: "•", color: "#555" },
    { id: "sc", label: "Single cr.", labelBg: "Нисък бод", sym: "×", color: "#2a7fff" },
    { id: "hdc", label: "Half dbl", labelBg: "Полустълбче", sym: "T", color: "#1d9e75" },
    { id: "dc", label: "Double cr.", labelBg: "Стълбче", sym: "╤", color: "#d85a30" },
    { id: "tr", label: "Treble", labelBg: "Дв. стълбче", sym: "╦", color: "#993556" },
    { id: "dtr", label: "Dbl treble", labelBg: "Тр. стълбче", sym: "╬", color: "#7f77dd" },
    { id: "inc", label: "Increase", labelBg: "Увеличение", sym: "V", color: "#639922" },
    { id: "dec", label: "Decrease", labelBg: "Намаление", sym: "Λ", color: "#a32d2d" },
    { id: "bob", label: "Bobble", labelBg: "Бобъл", sym: "◎", color: "#ba7517" },
    { id: "pop", label: "Popcorn", labelBg: "Пуканка", sym: "✿", color: "#d4537e" },
    { id: "sh", label: "Shell", labelBg: "Мида", sym: "⌓", color: "#185fa5" },
    { id: "pic", label: "Picot", labelBg: "Пико", sym: "⌃", color: "#0f6e56" },
    { id: "fpdc", label: "FPdc", labelBg: "ЛП стълбче", sym: "⫰", color: "#534ab7" },
    { id: "bpdc", label: "BPdc", labelBg: "ЗП стълбче", sym: "⫯", color: "#3c3489" },
    { id: "puff", label: "Puff", labelBg: "Пуф", sym: "◉", color: "#854f0b" },
  ],
  knitting: [
    { id: "k", label: "Knit", labelBg: "Лицев", sym: "□", color: "#2a7fff" },
    { id: "p", label: "Purl", labelBg: "Обратен", sym: "■", color: "#d85a30" },
    { id: "yo", label: "Yarn over", labelBg: "Обвивка", sym: "○", color: "#1d9e75" },
    { id: "k2t", label: "K2tog", labelBg: "2 заедно", sym: "⟋", color: "#a32d2d" },
    { id: "ssk", label: "SSK", labelBg: "ССК", sym: "⟍", color: "#993556" },
    { id: "sl1", label: "Slip 1", labelBg: "Прехвърли 1", sym: "▽", color: "#888" },
    { id: "cab4f", label: "Cable 4F", labelBg: "Плитка 4Л", sym: "⟨⟩", color: "#534ab7" },
    { id: "cab4b", label: "Cable 4B", labelBg: "Плитка 4З", sym: "⟩⟨", color: "#3c3489" },
    { id: "m1l", label: "M1L", labelBg: "Д1Л", sym: "↗", color: "#639922" },
    { id: "m1r", label: "M1R", labelBg: "Д1Д", sym: "↖", color: "#0f6e56" },
    { id: "bo", label: "Bind off", labelBg: "Закриване", sym: "⌐", color: "#555" },
    { id: "co", label: "Cast on", labelBg: "Набиране", sym: "⌐", color: "#ba7517" },
  ],
  crossStitch: [
    { id: "full", label: "Full ×", labelBg: "Пълен ×", sym: "×", color: "#2a7fff" },
    { id: "half", label: "Half /", labelBg: "Половин /", sym: "/", color: "#d85a30" },
    { id: "quarter", label: "Quarter", labelBg: "Четвъртинка", sym: "⌟", color: "#1d9e75" },
    { id: "back", label: "Backstitch", labelBg: "Обратен бод", sym: "—", color: "#555" },
    { id: "french", label: "French knot", labelBg: "Фр. възел", sym: "●", color: "#993556" },
    { id: "long", label: "Long stitch", labelBg: "Дълъг бод", sym: "╱", color: "#7f77dd" },
  ],
};

const COLOR_PALETTE = [
  "#FFFFFF", "#000000", "#E24B4A", "#D85A30", "#EF9F27", "#F9CB42",
  "#639922", "#1D9E75", "#2a7fff", "#185FA5", "#7F77DD", "#534AB7",
  "#D4537E", "#993556", "#854F0B", "#888880", "#B4B2A9", "#F5DEB3",
  "#8B4513", "#DDA0DD", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA15E", "#606C38", "#264653", "#E76F51", "#2A9D8F",
];

const CELL = 24;
const DEFAULT_W = 30;
const DEFAULT_H = 30;

// ─── Flood fill ───
function floodFill(grid, w, h, sx, sy, target, replacement) {
  if (target === replacement) return grid;
  const ng = grid.map((r) => [...r]);
  const stack = [[sx, sy]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const cv = ng[y][x];
    if (typeof target === "object" ? cv?.id !== target?.id : cv !== target) continue;
    ng[y][x] = replacement;
    stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }
  return ng;
}

// ─── Main Component ───
export default function KnittingDesigner() {
  const [lang, setLang] = useState("bg");
  const t = T[lang];

  const [gridW, setGridW] = useState(DEFAULT_W);
  const [gridH, setGridH] = useState(DEFAULT_H);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState("grid"); // grid | free
  const [viewMode, setViewMode] = useState("symbol"); // symbol | color
  const [craftType, setCraftType] = useState("crochet");
  const [tool, setTool] = useState("draw"); // draw | eraser | fill
  const [mirrorH, setMirrorH] = useState(false);
  const [selectedStitch, setSelectedStitch] = useState(STITCH_SETS.crochet[2]);
  const [selectedColor, setSelectedColor] = useState("#2a7fff");
  const [grid, setGrid] = useState(() =>
    Array.from({ length: DEFAULT_H }, () => Array(DEFAULT_W).fill(null))
  );
  const [colorGrid, setColorGrid] = useState(() =>
    Array.from({ length: DEFAULT_H }, () => Array(DEFAULT_W).fill(null))
  );
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [projectName, setProjectName] = useState(lang === "bg" ? "Моят проект" : "My project");
  const [freeLines, setFreeLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [panel, setPanel] = useState("stitches"); // stitches | colors | tools
  const canvasRef = useRef(null);
  const gridRef = useRef(null);

  const stitches = STITCH_SETS[craftType] || STITCH_SETS.crochet;

  useEffect(() => {
    if (!stitches.find((s) => s.id === selectedStitch?.id)) {
      setSelectedStitch(stitches[0]);
    }
  }, [craftType]);

  const pushHistory = useCallback(() => {
    const snap = { grid: grid.map((r) => [...r]), colorGrid: colorGrid.map((r) => [...r]), freeLines: [...freeLines] };
    const newH = history.slice(0, historyIdx + 1);
    newH.push(snap);
    if (newH.length > 50) newH.shift();
    setHistory(newH);
    setHistoryIdx(newH.length - 1);
  }, [grid, colorGrid, freeLines, history, historyIdx]);

  const undo = () => {
    if (historyIdx > 0) {
      const s = history[historyIdx - 1];
      setGrid(s.grid.map((r) => [...r]));
      setColorGrid(s.colorGrid.map((r) => [...r]));
      setFreeLines([...s.freeLines]);
      setHistoryIdx(historyIdx - 1);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      const s = history[historyIdx + 1];
      setGrid(s.grid.map((r) => [...r]));
      setColorGrid(s.colorGrid.map((r) => [...r]));
      setFreeLines([...s.freeLines]);
      setHistoryIdx(historyIdx + 1);
    }
  };

  const clearAll = () => {
    pushHistory();
    setGrid(Array.from({ length: gridH }, () => Array(gridW).fill(null)));
    setColorGrid(Array.from({ length: gridH }, () => Array(gridW).fill(null)));
    setFreeLines([]);
  };

  const resizeGrid = (nw, nh) => {
    pushHistory();
    const ng = Array.from({ length: nh }, (_, y) =>
      Array.from({ length: nw }, (_, x) => (y < gridH && x < gridW ? grid[y][x] : null))
    );
    const nc = Array.from({ length: nh }, (_, y) =>
      Array.from({ length: nw }, (_, x) => (y < gridH && x < gridW ? colorGrid[y][x] : null))
    );
    setGrid(ng);
    setColorGrid(nc);
    setGridW(nw);
    setGridH(nh);
  };

  const handleCellAction = (x, y) => {
    if (viewMode === "symbol") {
      if (tool === "eraser") {
        const ng = grid.map((r) => [...r]);
        ng[y][x] = null;
        if (mirrorH) { const mx = gridW - 1 - x; if (mx >= 0 && mx < gridW) ng[y][mx] = null; }
        setGrid(ng);
      } else if (tool === "fill") {
        const target = grid[y][x];
        setGrid(floodFill(grid, gridW, gridH, x, y, target, selectedStitch));
      } else {
        const ng = grid.map((r) => [...r]);
        ng[y][x] = selectedStitch;
        if (mirrorH) { const mx = gridW - 1 - x; if (mx >= 0 && mx < gridW) ng[y][mx] = selectedStitch; }
        setGrid(ng);
      }
    } else {
      if (tool === "eraser") {
        const nc = colorGrid.map((r) => [...r]);
        nc[y][x] = null;
        if (mirrorH) { const mx = gridW - 1 - x; if (mx >= 0 && mx < gridW) nc[y][mx] = null; }
        setColorGrid(nc);
      } else if (tool === "fill") {
        const target = colorGrid[y][x];
        setColorGrid(floodFill(colorGrid, gridW, gridH, x, y, target, selectedColor));
      } else {
        const nc = colorGrid.map((r) => [...r]);
        nc[y][x] = selectedColor;
        if (mirrorH) { const mx = gridW - 1 - x; if (mx >= 0 && mx < gridW) nc[y][mx] = selectedColor; }
        setColorGrid(nc);
      }
    }
  };

  const onGridMouseDown = (e) => {
    if (mode === "free") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      setCurrentLine({ points: [{ x, y }], color: selectedColor, width: 2 });
      setIsDrawing(true);
      pushHistory();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (CELL * zoom));
    const y = Math.floor((e.clientY - rect.top) / (CELL * zoom));
    if (x >= 0 && x < gridW && y >= 0 && y < gridH) {
      pushHistory();
      handleCellAction(x, y);
      setIsDrawing(true);
    }
  };

  const onGridMouseMove = (e) => {
    if (!isDrawing) return;
    if (mode === "free" && currentLine) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      setCurrentLine((l) => ({ ...l, points: [...l.points, { x, y }] }));
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (CELL * zoom));
    const y = Math.floor((e.clientY - rect.top) / (CELL * zoom));
    if (x >= 0 && x < gridW && y >= 0 && y < gridH) {
      handleCellAction(x, y);
    }
  };

  const onGridMouseUp = () => {
    if (mode === "free" && currentLine && currentLine.points.length > 1) {
      setFreeLines((ls) => [...ls, currentLine]);
    }
    setCurrentLine(null);
    setIsDrawing(false);
  };

  // ─── Generate text instructions ───
  const generateInstructions = () => {
    const lines = [];
    for (let y = 0; y < gridH; y++) {
      const row = grid[y];
      const parts = [];
      let i = 0;
      while (i < gridW) {
        const st = row[i];
        if (!st) { i++; continue; }
        let cnt = 0;
        while (i < gridW && row[i]?.id === st.id) { cnt++; i++; }
        const lbl = lang === "bg" ? st.labelBg : st.label;
        parts.push(cnt > 1 ? `${cnt} ${lbl}` : lbl);
      }
      if (parts.length) lines.push(`${lang === "bg" ? "Ред" : "Row"} ${y + 1}: ${parts.join(", ")}`);
    }
    return lines.length ? lines.join("\n") : (lang === "bg" ? "Празна схема" : "Empty pattern");
  };

  // ─── Count stitches ───
  const stitchCount = useMemo(() => {
    let c = 0;
    grid.forEach((r) => r.forEach((s) => { if (s) c++; }));
    return c;
  }, [grid]);

  // ─── Export as PNG ───
  const exportPNG = () => {
    const c = document.createElement("canvas");
    const sz = CELL;
    c.width = gridW * sz;
    c.height = gridH * sz;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        if (viewMode === "color" && colorGrid[y][x]) {
          ctx.fillStyle = colorGrid[y][x];
          ctx.fillRect(x * sz, y * sz, sz, sz);
        } else if (grid[y][x]) {
          ctx.fillStyle = grid[y][x].color || "#333";
          ctx.font = `${sz * 0.7}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(grid[y][x].sym, x * sz + sz / 2, y * sz + sz / 2);
        }
        ctx.strokeStyle = "#ddd";
        ctx.strokeRect(x * sz, y * sz, sz, sz);
      }
    }
    const a = document.createElement("a");
    a.download = `${projectName}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  // ─── Export SVG ───
  const exportSVG = () => {
    const sz = CELL;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridW * sz}" height="${gridH * sz}">`;
    svg += `<rect width="100%" height="100%" fill="#fff"/>`;
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        if (viewMode === "color" && colorGrid[y][x]) {
          svg += `<rect x="${x * sz}" y="${y * sz}" width="${sz}" height="${sz}" fill="${colorGrid[y][x]}" stroke="#ddd" stroke-width="0.5"/>`;
        } else if (grid[y][x]) {
          svg += `<rect x="${x * sz}" y="${y * sz}" width="${sz}" height="${sz}" fill="none" stroke="#ddd" stroke-width="0.5"/>`;
          svg += `<text x="${x * sz + sz / 2}" y="${y * sz + sz / 2}" text-anchor="middle" dominant-baseline="central" fill="${grid[y][x].color}" font-size="${sz * 0.65}">${grid[y][x].sym}</text>`;
        } else {
          svg += `<rect x="${x * sz}" y="${y * sz}" width="${sz}" height="${sz}" fill="none" stroke="#ddd" stroke-width="0.5"/>`;
        }
      }
    }
    svg += `</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = `${projectName}.svg`;
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  // ─── Save / Load project ───
  const saveProject = () => {
    const data = JSON.stringify({ projectName, gridW, gridH, grid, colorGrid, freeLines, craftType, viewMode });
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.download = `${projectName}.kpd.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const loadProject = () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".json";
    inp.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result);
          pushHistory();
          setProjectName(d.projectName || "Project");
          setGridW(d.gridW);
          setGridH(d.gridH);
          setGrid(d.grid);
          setColorGrid(d.colorGrid);
          setFreeLines(d.freeLines || []);
          if (d.craftType) setCraftType(d.craftType);
          if (d.viewMode) setViewMode(d.viewMode);
        } catch (err) {
          alert("Invalid file");
        }
      };
      r.readAsText(f);
    };
    inp.click();
  };

  // ─── Styles ───
  const s = {
    app: { fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--color-background-tertiary)", color: "var(--color-text-primary)" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--color-background-primary)", borderBottom: "1px solid var(--color-border-tertiary)", flexWrap: "wrap", gap: "6px" },
    logo: { display: "flex", alignItems: "center", gap: "8px" },
    logoIcon: { width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #7F77DD, #D4537E)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 },
    headerTitle: { fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px" },
    headerActions: { display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    sidebar: { width: 220, background: "var(--color-background-primary)", borderRight: "1px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", overflow: "auto", flexShrink: 0 },
    main: { flex: 1, overflow: "auto", display: "flex", flexDirection: "column" },
    toolbar: { display: "flex", gap: "4px", padding: "6px 8px", background: "var(--color-background-secondary)", borderBottom: "1px solid var(--color-border-tertiary)", flexWrap: "wrap", alignItems: "center" },
    canvasWrap: { flex: 1, overflow: "auto", padding: 12, display: "flex", justifyContent: "center", alignItems: "flex-start" },
    btn: (active) => ({
      padding: "4px 10px", borderRadius: 6, border: "1px solid",
      borderColor: active ? "var(--color-text-info)" : "var(--color-border-tertiary)",
      background: active ? "var(--color-background-info)" : "var(--color-background-primary)",
      color: active ? "var(--color-text-info)" : "var(--color-text-primary)",
      cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all .15s", whiteSpace: "nowrap",
    }),
    smallBtn: (active) => ({
      padding: "3px 7px", borderRadius: 5, border: "1px solid",
      borderColor: active ? "var(--color-text-info)" : "var(--color-border-tertiary)",
      background: active ? "var(--color-background-info)" : "transparent",
      color: active ? "var(--color-text-info)" : "var(--color-text-secondary)",
      cursor: "pointer", fontSize: 11, fontWeight: 500,
    }),
    sideSection: { padding: "8px 10px", borderBottom: "1px solid var(--color-border-tertiary)" },
    sideTitle: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--color-text-tertiary)", marginBottom: 6 },
    stitchGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 },
    stitchBtn: (active) => ({
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "4px 2px", borderRadius: 6, border: "2px solid",
      borderColor: active ? "var(--color-text-info)" : "transparent",
      background: active ? "var(--color-background-info)" : "var(--color-background-secondary)",
      cursor: "pointer", transition: "all .1s", minHeight: 40,
    }),
    stitchSym: (color) => ({ fontSize: 16, lineHeight: 1, color }),
    stitchLabel: { fontSize: 8, color: "var(--color-text-tertiary)", marginTop: 2, textAlign: "center", lineHeight: 1.1 },
    colorSwatch: (c, active) => ({
      width: 22, height: 22, borderRadius: 4, background: c, cursor: "pointer",
      border: active ? "2px solid var(--color-text-info)" : c === "#FFFFFF" ? "1px solid var(--color-border-secondary)" : "1px solid transparent",
      transition: "transform .1s", transform: active ? "scale(1.15)" : "scale(1)",
    }),
    paletteGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 3 },
    statusBar: { display: "flex", gap: "12px", padding: "4px 10px", fontSize: 11, color: "var(--color-text-tertiary)", background: "var(--color-background-primary)", borderTop: "1px solid var(--color-border-tertiary)" },
    input: { padding: "3px 6px", borderRadius: 5, border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 12, width: "100%" },
    numInput: { width: 52, padding: "3px 5px", borderRadius: 5, border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 12, textAlign: "center" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalContent: { background: "var(--color-background-primary)", borderRadius: 12, padding: 20, maxWidth: 600, width: "90%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" },
    tabBar: { display: "flex", gap: 0, borderBottom: "1px solid var(--color-border-tertiary)", marginBottom: 6 },
    tab: (active) => ({
      padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer",
      borderBottom: active ? "2px solid var(--color-text-info)" : "2px solid transparent",
      color: active ? "var(--color-text-info)" : "var(--color-text-secondary)",
      background: "transparent", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid",
    }),
  };

  const cellSize = CELL * zoom;

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>K</div>
          <span style={s.headerTitle}>{t.title}</span>
        </div>
        <div style={s.headerActions}>
          <input style={{ ...s.input, width: 140 }} value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder={t.projectName} />
          {[["crochet", t.crochet], ["knitting", t.knitting], ["crossStitch", t.crossStitch]].map(([k, l]) => (
            <button key={k} style={s.btn(craftType === k)} onClick={() => setCraftType(k)}>{l}</button>
          ))}
          <span style={{ width: 1, height: 20, background: "var(--color-border-tertiary)" }} />
          <button style={s.btn(mode === "grid")} onClick={() => setMode("grid")}>{t.gridMode}</button>
          <button style={s.btn(mode === "free")} onClick={() => setMode("free")}>{t.freeMode}</button>
          <span style={{ width: 1, height: 20, background: "var(--color-border-tertiary)" }} />
          <button style={s.btn(false)} onClick={() => setLang(lang === "bg" ? "en" : "bg")}>{t.lang}</button>
        </div>
      </div>

      <div style={s.body}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          {/* Tabs */}
          <div style={s.tabBar}>
            <button style={s.tab(panel === "stitches")} onClick={() => setPanel("stitches")}>{t.stitches}</button>
            <button style={s.tab(panel === "colors")} onClick={() => setPanel("colors")}>{t.colors}</button>
            <button style={s.tab(panel === "tools")} onClick={() => setPanel("tools")}>{t.tools}</button>
          </div>

          {panel === "stitches" && (
            <div style={s.sideSection}>
              <div style={s.stitchGrid}>
                {stitches.map((st) => (
                  <button key={st.id} style={s.stitchBtn(selectedStitch?.id === st.id)} onClick={() => { setSelectedStitch(st); setTool("draw"); }}>
                    <span style={s.stitchSym(st.color)}>{st.sym}</span>
                    <span style={s.stitchLabel}>{lang === "bg" ? st.labelBg : st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "colors" && (
            <div style={s.sideSection}>
              <div style={s.sideTitle}>{t.colors}</div>
              <div style={s.paletteGrid}>
                {COLOR_PALETTE.map((c) => (
                  <div key={c} style={s.colorSwatch(c, selectedColor === c)} onClick={() => { setSelectedColor(c); setTool("draw"); }} />
                ))}
              </div>
            </div>
          )}

          {panel === "tools" && (
            <div style={s.sideSection}>
              <div style={s.sideTitle}>{t.tools}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button style={s.btn(tool === "draw")} onClick={() => setTool("draw")}>{t.draw}</button>
                <button style={s.btn(tool === "eraser")} onClick={() => setTool("eraser")}>{t.eraser}</button>
                <button style={s.btn(tool === "fill")} onClick={() => setTool("fill")}>{t.fill}</button>
                <div style={{ height: 8 }} />
                <button style={s.btn(mirrorH)} onClick={() => setMirrorH(!mirrorH)}>{t.mirror} {mirrorH ? "ON" : "OFF"}</button>
                <button style={s.btn(false)} onClick={undo}>{t.undo}</button>
                <button style={s.btn(false)} onClick={redo}>{t.redo}</button>
                <button style={s.btn(false)} onClick={clearAll}>{t.clear}</button>
                <div style={{ height: 8 }} />
                <div style={s.sideTitle}>{t.gridW}</div>
                <input type="number" style={s.numInput} value={gridW} min={5} max={100} onChange={(e) => resizeGrid(+e.target.value || 5, gridH)} />
                <div style={s.sideTitle}>{t.gridH}</div>
                <input type="number" style={s.numInput} value={gridH} min={5} max={100} onChange={(e) => resizeGrid(gridW, +e.target.value || 5)} />
                <div style={{ height: 8 }} />
                <div style={s.sideTitle}>{t.zoom}</div>
                <input type="range" min={0.5} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(+e.target.value)} style={{ width: "100%" }} />
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ ...s.sideSection, marginTop: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button style={s.btn(false)} onClick={() => setShowPreview(true)}>{t.preview}</button>
              <button style={s.btn(false)} onClick={() => setShowInstructions(true)}>{t.generate}</button>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={{ ...s.btn(false), flex: 1 }} onClick={exportPNG}>{t.exportPNG}</button>
                <button style={{ ...s.btn(false), flex: 1 }} onClick={exportSVG}>{t.exportSVG}</button>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={{ ...s.btn(false), flex: 1 }} onClick={saveProject}>{t.save}</button>
                <button style={{ ...s.btn(false), flex: 1 }} onClick={loadProject}>{t.load}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main canvas area */}
        <div style={s.main}>
          <div style={s.toolbar}>
            <button style={s.smallBtn(viewMode === "symbol")} onClick={() => setViewMode("symbol")}>{t.symbolView}</button>
            <button style={s.smallBtn(viewMode === "color")} onClick={() => setViewMode("color")}>{t.colorView}</button>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{t.stitchCount}: {stitchCount} | {gridW}{t.cols} × {gridH}{t.rows}</span>
          </div>

          <div style={s.canvasWrap}>
            <div
              ref={gridRef}
              style={{ position: "relative", cursor: tool === "eraser" ? "crosshair" : tool === "fill" ? "cell" : "crosshair", userSelect: "none", touchAction: "none" }}
              onMouseDown={onGridMouseDown}
              onMouseMove={onGridMouseMove}
              onMouseUp={onGridMouseUp}
              onMouseLeave={onGridMouseUp}
            >
              {/* SVG Grid */}
              <svg
                ref={canvasRef}
                width={gridW * cellSize}
                height={gridH * cellSize}
                style={{ display: "block", background: "var(--color-background-primary)", borderRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}
              >
                {/* Grid lines */}
                {Array.from({ length: gridH + 1 }, (_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * cellSize} x2={gridW * cellSize} y2={i * cellSize} stroke="var(--color-border-tertiary)" strokeWidth={i % 5 === 0 ? 0.8 : 0.3} />
                ))}
                {Array.from({ length: gridW + 1 }, (_, i) => (
                  <line key={`v${i}`} x1={i * cellSize} y1={0} x2={i * cellSize} y2={gridH * cellSize} stroke="var(--color-border-tertiary)" strokeWidth={i % 5 === 0 ? 0.8 : 0.3} />
                ))}

                {/* Mirror line */}
                {mirrorH && (
                  <line x1={gridW * cellSize / 2} y1={0} x2={gridW * cellSize / 2} y2={gridH * cellSize} stroke="var(--color-text-danger)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
                )}

                {/* Cells */}
                {grid.map((row, y) =>
                  row.map((cell, x) => {
                    if (viewMode === "color") {
                      const c = colorGrid[y]?.[x];
                      if (c) return <rect key={`${x}-${y}`} x={x * cellSize + 0.5} y={y * cellSize + 0.5} width={cellSize - 1} height={cellSize - 1} fill={c} />;
                      return null;
                    }
                    if (!cell) return null;
                    return (
                      <text
                        key={`${x}-${y}`}
                        x={x * cellSize + cellSize / 2}
                        y={y * cellSize + cellSize / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={cell.color}
                        fontSize={cellSize * 0.65}
                        fontWeight={500}
                        style={{ pointerEvents: "none" }}
                      >
                        {cell.sym}
                      </text>
                    );
                  })
                )}

                {/* Row numbers */}
                {Array.from({ length: gridH }, (_, i) => (
                  <text key={`rn${i}`} x={-4} y={i * cellSize + cellSize / 2} textAnchor="end" dominantBaseline="central" fontSize={9} fill="var(--color-text-tertiary)">{i + 1}</text>
                ))}

                {/* Freeform lines */}
                {freeLines.map((line, i) => (
                  <polyline key={`fl${i}`} points={line.points.map((p) => `${p.x * zoom},${p.y * zoom}`).join(" ")} fill="none" stroke={line.color} strokeWidth={line.width * zoom} strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {currentLine && (
                  <polyline points={currentLine.points.map((p) => `${p.x * zoom},${p.y * zoom}`).join(" ")} fill="none" stroke={currentLine.color} strokeWidth={currentLine.width * zoom} strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={s.statusBar}>
        <span>{projectName}</span>
        <span>{craftType === "crochet" ? t.crochet : craftType === "knitting" ? t.knitting : t.crossStitch}</span>
        <span>{gridW}×{gridH}</span>
        <span>{t.zoom}: {Math.round(zoom * 100)}%</span>
        <span style={{ marginLeft: "auto" }}>{t.stitchCount}: {stitchCount}</span>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={s.modal} onClick={() => setShowPreview(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{t.preview}: {projectName}</h3>
              <button style={s.btn(false)} onClick={() => setShowPreview(false)}>{t.close}</button>
            </div>
            <div style={{ textAlign: "center", overflow: "auto" }}>
              <svg width={Math.min(gridW * 12, 560)} height={Math.min(gridH * 12, 400)} viewBox={`0 0 ${gridW * CELL} ${gridH * CELL}`} style={{ background: "#fff", borderRadius: 8, border: "1px solid var(--color-border-tertiary)" }}>
                {grid.map((row, y) =>
                  row.map((cell, x) => {
                    const c = colorGrid[y]?.[x];
                    if (c) return <rect key={`p${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill={c} />;
                    if (cell) return <rect key={`p${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill={cell.color} opacity={0.3} />;
                    return null;
                  })
                )}
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8 }}>
              {lang === "bg" ? "Опростен преглед на плетката. Цветовете показват приблизителен вид на готовото изделие." : "Simplified preview. Colors approximate the finished piece."}
            </p>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div style={s.modal} onClick={() => setShowInstructions(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{t.instructions}</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={s.btn(false)} onClick={() => {
                  const txt = generateInstructions();
                  navigator.clipboard.writeText(txt);
                }}>Copy</button>
                <button style={s.btn(false)} onClick={() => setShowInstructions(false)}>{t.close}</button>
              </div>
            </div>
            <pre style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", background: "var(--color-background-secondary)", padding: 12, borderRadius: 8, maxHeight: 400, overflow: "auto", fontFamily: "var(--font-mono, monospace)" }}>
              {generateInstructions()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
