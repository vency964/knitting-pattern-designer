import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const T = {
  bg: {
    title: "Дизайнер на плетива", gridMode: "Решетка", freeMode: "Свободно",
    symbolView: "Символи", colorView: "Цветове", stitches: "Бодове", colors: "Палитра",
    tools: "Инструменти", undo: "Назад", redo: "Напред", clear: "Изчисти",
    mirror: "Огледало", zoom: "Мащаб", gridW: "Колони", gridH: "Редове",
    exportPNG: "PNG", exportSVG: "SVG", save: "Запази", load: "Зареди",
    preview: "Преглед", generate: "Инструкции", stitchCount: "Бодове",
    crochet: "Куки", knitting: "Игли", crossStitch: "Кръстат бод",
    eraser: "Гумичка", fill: "Запълни", draw: "Рисувай",
    instructions: "Текстови инструкции", close: "Затвори",
    projectName: "Име на проекта", lang: "EN", rows: "р.", cols: "к.",
    importImage: "Импорт снимка", importTitle: "Импорт на изображение",
    colorMode: "Режим цветове", originalColors: "Оригинални",
    yarnColors: "Палитра конци", numColors: "Брой цветове",
    applyImport: "Приложи към решетката", cancelImport: "Откажи",
    dropImage: "Пусни снимка тук или кликни за избор",
    processing: "Обработка...", imagePreview: "Оригинал", resultPreview: "Резултат",
    widthCells: "Ширина (клетки)", keepRatio: "Пропорции",
    generateSymbols: "Символна схема", symbolsNote: "Присвоява бодове по яркост",
    otherImage: "Друга снимка",
  },
  en: {
    title: "Knitting Pattern Designer", gridMode: "Grid", freeMode: "Freeform",
    symbolView: "Symbols", colorView: "Colors", stitches: "Stitches", colors: "Palette",
    tools: "Tools", undo: "Undo", redo: "Redo", clear: "Clear",
    mirror: "Mirror", zoom: "Zoom", gridW: "Columns", gridH: "Rows",
    exportPNG: "PNG", exportSVG: "SVG", save: "Save", load: "Load",
    preview: "Preview", generate: "Instructions", stitchCount: "Stitches",
    crochet: "Crochet", knitting: "Knitting", crossStitch: "Cross-stitch",
    eraser: "Eraser", fill: "Fill", draw: "Draw",
    instructions: "Text Instructions", close: "Close",
    projectName: "Project name", lang: "BG", rows: "r.", cols: "c.",
    importImage: "Import image", importTitle: "Import image",
    colorMode: "Color mode", originalColors: "Original",
    yarnColors: "Yarn palette", numColors: "Num colors",
    applyImport: "Apply to grid", cancelImport: "Cancel",
    dropImage: "Drop image here or click to select",
    processing: "Processing...", imagePreview: "Original", resultPreview: "Result",
    widthCells: "Width (cells)", keepRatio: "Ratio",
    generateSymbols: "Stitch chart", symbolsNote: "Assigns stitches by brightness",
    otherImage: "Different image",
  },
};

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
  "#FFFFFF","#000000","#E24B4A","#D85A30","#EF9F27","#F9CB42",
  "#639922","#1D9E75","#2a7fff","#185FA5","#7F77DD","#534AB7",
  "#D4537E","#993556","#854F0B","#888880","#B4B2A9","#F5DEB3",
  "#8B4513","#DDA0DD","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4",
  "#FFEAA7","#DDA15E","#606C38","#264653","#E76F51","#2A9D8F",
];

const YARN_PALETTE = [
  {n:"White",h:"#F5F5F0"},{n:"Cream",h:"#F5DEB3"},{n:"Beige",h:"#D2B48C"},
  {n:"Sand",h:"#DDA15E"},{n:"Light Pink",h:"#FFB6C1"},{n:"Rose",h:"#E8828A"},
  {n:"Red",h:"#CC3333"},{n:"Burgundy",h:"#722F37"},{n:"Coral",h:"#E76F51"},
  {n:"Orange",h:"#E8781A"},{n:"Mustard",h:"#D4A017"},{n:"Yellow",h:"#F0C050"},
  {n:"Lime",h:"#9CB648"},{n:"Green",h:"#4A7C2F"},{n:"Forest",h:"#2D5A1E"},
  {n:"Teal",h:"#2A9D8F"},{n:"Sky Blue",h:"#87CEEB"},{n:"Blue",h:"#4169E1"},
  {n:"Navy",h:"#1B2A5B"},{n:"Lavender",h:"#9B8EC0"},{n:"Purple",h:"#6A3D9A"},
  {n:"Plum",h:"#5B2C54"},{n:"Brown",h:"#8B4513"},{n:"Chocolate",h:"#5C3317"},
  {n:"Tan",h:"#B8976B"},{n:"Light Gray",h:"#C0C0BE"},{n:"Gray",h:"#808080"},
  {n:"Charcoal",h:"#3D3D3D"},{n:"Black",h:"#1A1A1A"},{n:"Dusty Rose",h:"#C9A0A0"},
];

const CELL = 24, DEFAULT_W = 30, DEFAULT_H = 30;

function colorDist(a, b) {
  const r1=parseInt(a.slice(1,3),16),g1=parseInt(a.slice(3,5),16),b1=parseInt(a.slice(5,7),16);
  const r2=parseInt(b.slice(1,3),16),g2=parseInt(b.slice(3,5),16),b2=parseInt(b.slice(5,7),16);
  return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
}
function nearestColor(hex, pal) {
  let best=pal[0],bestD=Infinity;
  for(const c of pal){const h=typeof c==="string"?c:c.h;const d=colorDist(hex,h);if(d<bestD){bestD=d;best=c;}}
  return typeof best==="string"?best:best.h;
}
function quantizeColors(pixels,num){
  if(!pixels.length)return[];
  const buckets=[pixels.slice()];
  while(buckets.length<num){
    let wi=0,wr=-1;
    for(let i=0;i<buckets.length;i++){const b=buckets[i];if(b.length<2)continue;
      let mnR=255,mxR=0,mnG=255,mxG=0,mnB=255,mxB=0;
      for(const[r,g,bl]of b){if(r<mnR)mnR=r;if(r>mxR)mxR=r;if(g<mnG)mnG=g;if(g>mxG)mxG=g;if(bl<mnB)mnB=bl;if(bl>mxB)mxB=bl;}
      const range=Math.max(mxR-mnR,mxG-mnG,mxB-mnB);if(range>wr){wr=range;wi=i;}}
    const b=buckets[wi];if(b.length<2)break;
    let mnR=255,mxR=0,mnG=255,mxG=0,mnB=255,mxB=0;
    for(const[r,g,bl]of b){if(r<mnR)mnR=r;if(r>mxR)mxR=r;if(g<mnG)mnG=g;if(g>mxG)mxG=g;if(bl<mnB)mnB=bl;if(bl>mxB)mxB=bl;}
    const rR=mxR-mnR,rG=mxG-mnG,rB=mxB-mnB;const ch=rR>=rG&&rR>=rB?0:rG>=rB?1:2;
    b.sort((a,c)=>a[ch]-c[ch]);const mid=Math.floor(b.length/2);
    buckets.splice(wi,1,b.slice(0,mid),b.slice(mid));
  }
  return buckets.map(b=>{let sr=0,sg=0,sb=0;for(const[r,g,bl]of b){sr+=r;sg+=g;sb+=bl;}
    const n=b.length;return"#"+[Math.round(sr/n),Math.round(sg/n),Math.round(sb/n)].map(v=>v.toString(16).padStart(2,"0")).join("");});
}
function floodFill(grid,w,h,sx,sy,target,rep){
  if(target===rep)return grid;const ng=grid.map(r=>[...r]);const stack=[[sx,sy]];
  while(stack.length){const[x,y]=stack.pop();if(x<0||x>=w||y<0||y>=h)continue;
    const cv=ng[y][x];if(typeof target==="object"?cv?.id!==target?.id:cv!==target)continue;
    ng[y][x]=rep;stack.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);}return ng;
}
function rgbHex(r,g,b){return"#"+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,"0")).join("");}

function imageToGrid(img,nw,nh,tw,th,useYarn,numC){
  const c=document.createElement("canvas");c.width=tw;c.height=th;
  const ctx=c.getContext("2d");ctx.drawImage(img,0,0,tw,th);
  const data=ctx.getImageData(0,0,tw,th).data;const cg=[];const allPx=[];
  for(let y=0;y<th;y++){const row=[];for(let x=0;x<tw;x++){
    const i=(y*tw+x)*4;const hex=rgbHex(data[i],data[i+1],data[i+2]);
    row.push(hex);allPx.push([data[i],data[i+1],data[i+2]]);}cg.push(row);}
  if(useYarn){for(let y=0;y<th;y++)for(let x=0;x<tw;x++)cg[y][x]=nearestColor(cg[y][x],YARN_PALETTE);}
  else if(numC&&numC<256){const q=quantizeColors(allPx,numC);
    for(let y=0;y<th;y++)for(let x=0;x<tw;x++)cg[y][x]=nearestColor(cg[y][x],q);}
  return cg;
}

function assignStitches(cg,stitchSet){
  const h=cg.length,w=cg[0]?.length||0,sg=[],n=stitchSet.length;
  for(let y=0;y<h;y++){const row=[];for(let x=0;x<w;x++){
    const hex=cg[y][x];if(!hex){row.push(null);continue;}
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    const br=(r*299+g*587+b*114)/1000;const idx=Math.min(n-1,Math.floor((br/255)*n));
    row.push(stitchSet[idx]);}sg.push(row);}return sg;
}

export default function KnittingDesigner(){
  const[lang,setLang]=useState("bg");const t=T[lang];
  const[gridW,setGridW]=useState(DEFAULT_W);const[gridH,setGridH]=useState(DEFAULT_H);
  const[zoom,setZoom]=useState(1);const[mode,setMode]=useState("grid");
  const[viewMode,setViewMode]=useState("symbol");const[craftType,setCraftType]=useState("crochet");
  const[tool,setTool]=useState("draw");const[mirrorH,setMirrorH]=useState(false);
  const[selectedStitch,setSelectedStitch]=useState(STITCH_SETS.crochet[2]);
  const[selectedColor,setSelectedColor]=useState("#2a7fff");
  const[grid,setGrid]=useState(()=>Array.from({length:DEFAULT_H},()=>Array(DEFAULT_W).fill(null)));
  const[colorGrid,setColorGrid]=useState(()=>Array.from({length:DEFAULT_H},()=>Array(DEFAULT_W).fill(null)));
  const[history,setHistory]=useState([]);const[historyIdx,setHistoryIdx]=useState(-1);
  const[isDrawing,setIsDrawing]=useState(false);const[showPreview,setShowPreview]=useState(false);
  const[showInstructions,setShowInstructions]=useState(false);
  const[projectName,setProjectName]=useState("Моят проект");
  const[freeLines,setFreeLines]=useState([]);const[currentLine,setCurrentLine]=useState(null);
  const[panel,setPanel]=useState("stitches");
  const[showImport,setShowImport]=useState(false);const[importImg,setImportImg]=useState(null);
  const[importImgEl,setImportImgEl]=useState(null);const[importW,setImportW]=useState(40);
  const[importH,setImportH]=useState(40);const[importKeepRatio,setImportKeepRatio]=useState(true);
  const[importColorMode,setImportColorMode]=useState("original");
  const[importNumColors,setImportNumColors]=useState(12);
  const[importPreviewGrid,setImportPreviewGrid]=useState(null);
  const[importGenSymbols,setImportGenSymbols]=useState(true);
  const[importProcessing,setImportProcessing]=useState(false);
  const[imgNatW,setImgNatW]=useState(0);const[imgNatH,setImgNatH]=useState(0);
  const canvasRef=useRef(null);const gridRef=useRef(null);const importFileRef=useRef(null);
  const stitches=STITCH_SETS[craftType]||STITCH_SETS.crochet;

  useEffect(()=>{if(!stitches.find(s=>s.id===selectedStitch?.id))setSelectedStitch(stitches[0]);},[craftType]);
  useEffect(()=>{if(importKeepRatio&&imgNatW>0&&imgNatH>0)setImportH(Math.max(5,Math.round(importW*(imgNatH/imgNatW))));},[importW,importKeepRatio,imgNatW,imgNatH]);
  useEffect(()=>{if(!importImgEl)return;setImportProcessing(true);
    const tm=setTimeout(()=>{const cg=imageToGrid(importImgEl,imgNatW,imgNatH,importW,importH,importColorMode==="yarn",importNumColors);setImportPreviewGrid(cg);setImportProcessing(false);},100);
    return()=>clearTimeout(tm);},[importImgEl,importW,importH,importColorMode,importNumColors,imgNatW,imgNatH]);

  const pushHistory=useCallback(()=>{
    const snap={grid:grid.map(r=>[...r]),colorGrid:colorGrid.map(r=>[...r]),freeLines:[...freeLines]};
    const newH=history.slice(0,historyIdx+1);newH.push(snap);if(newH.length>50)newH.shift();
    setHistory(newH);setHistoryIdx(newH.length-1);
  },[grid,colorGrid,freeLines,history,historyIdx]);

  const undo=()=>{if(historyIdx>0){const s=history[historyIdx-1];setGrid(s.grid.map(r=>[...r]));setColorGrid(s.colorGrid.map(r=>[...r]));setFreeLines([...s.freeLines]);setHistoryIdx(historyIdx-1);}};
  const redo=()=>{if(historyIdx<history.length-1){const s=history[historyIdx+1];setGrid(s.grid.map(r=>[...r]));setColorGrid(s.colorGrid.map(r=>[...r]));setFreeLines([...s.freeLines]);setHistoryIdx(historyIdx+1);}};
  const clearAll=()=>{pushHistory();setGrid(Array.from({length:gridH},()=>Array(gridW).fill(null)));setColorGrid(Array.from({length:gridH},()=>Array(gridW).fill(null)));setFreeLines([]);};
  const resizeGrid=(nw,nh)=>{pushHistory();setGrid(Array.from({length:nh},(_,y)=>Array.from({length:nw},(_,x)=>(y<gridH&&x<gridW?grid[y][x]:null))));setColorGrid(Array.from({length:nh},(_,y)=>Array.from({length:nw},(_,x)=>(y<gridH&&x<gridW?colorGrid[y][x]:null))));setGridW(nw);setGridH(nh);};

  const handleCellAction=(x,y)=>{
    if(viewMode==="symbol"){
      if(tool==="eraser"){const ng=grid.map(r=>[...r]);ng[y][x]=null;if(mirrorH){const mx=gridW-1-x;if(mx>=0&&mx<gridW)ng[y][mx]=null;}setGrid(ng);}
      else if(tool==="fill"){setGrid(floodFill(grid,gridW,gridH,x,y,grid[y][x],selectedStitch));}
      else{const ng=grid.map(r=>[...r]);ng[y][x]=selectedStitch;if(mirrorH){const mx=gridW-1-x;if(mx>=0&&mx<gridW)ng[y][mx]=selectedStitch;}setGrid(ng);}
    }else{
      if(tool==="eraser"){const nc=colorGrid.map(r=>[...r]);nc[y][x]=null;if(mirrorH){const mx=gridW-1-x;if(mx>=0&&mx<gridW)nc[y][mx]=null;}setColorGrid(nc);}
      else if(tool==="fill"){setColorGrid(floodFill(colorGrid,gridW,gridH,x,y,colorGrid[y][x],selectedColor));}
      else{const nc=colorGrid.map(r=>[...r]);nc[y][x]=selectedColor;if(mirrorH){const mx=gridW-1-x;if(mx>=0&&mx<gridW)nc[y][mx]=selectedColor;}setColorGrid(nc);}
    }
  };

  const onGridMouseDown=(e)=>{
    if(mode==="free"){const rect=e.currentTarget.getBoundingClientRect();const x=(e.clientX-rect.left)/zoom;const y=(e.clientY-rect.top)/zoom;
      setCurrentLine({points:[{x,y}],color:selectedColor,width:2});setIsDrawing(true);pushHistory();return;}
    const rect=e.currentTarget.getBoundingClientRect();const x=Math.floor((e.clientX-rect.left)/(CELL*zoom));const y=Math.floor((e.clientY-rect.top)/(CELL*zoom));
    if(x>=0&&x<gridW&&y>=0&&y<gridH){pushHistory();handleCellAction(x,y);setIsDrawing(true);}
  };
  const onGridMouseMove=(e)=>{if(!isDrawing)return;
    if(mode==="free"&&currentLine){const rect=e.currentTarget.getBoundingClientRect();const x=(e.clientX-rect.left)/zoom;const y=(e.clientY-rect.top)/zoom;
      setCurrentLine(l=>({...l,points:[...l.points,{x,y}]}));return;}
    const rect=e.currentTarget.getBoundingClientRect();const x=Math.floor((e.clientX-rect.left)/(CELL*zoom));const y=Math.floor((e.clientY-rect.top)/(CELL*zoom));
    if(x>=0&&x<gridW&&y>=0&&y<gridH)handleCellAction(x,y);
  };
  const onGridMouseUp=()=>{if(mode==="free"&&currentLine&&currentLine.points.length>1)setFreeLines(ls=>[...ls,currentLine]);setCurrentLine(null);setIsDrawing(false);};

  const handleImageFile=(file)=>{if(!file||!file.type.startsWith("image/"))return;
    const url=URL.createObjectURL(file);setImportImg(url);
    const img=new Image();img.onload=()=>{setImgNatW(img.naturalWidth);setImgNatH(img.naturalHeight);setImportImgEl(img);
      const ratio=img.naturalHeight/img.naturalWidth;const w=Math.min(60,Math.max(10,Math.round(img.naturalWidth/10)));
      setImportW(w);setImportH(Math.max(5,Math.round(w*ratio)));};img.src=url;
  };
  const handleImportDrop=(e)=>{e.preventDefault();const file=e.dataTransfer?.files?.[0];if(file)handleImageFile(file);};

  const applyImport=()=>{if(!importPreviewGrid)return;pushHistory();
    const h=importPreviewGrid.length,w=importPreviewGrid[0]?.length||0;
    setGridW(w);setGridH(h);setColorGrid(importPreviewGrid.map(r=>[...r]));
    if(importGenSymbols){setGrid(assignStitches(importPreviewGrid,stitches));}
    else{setGrid(Array.from({length:h},()=>Array(w).fill(null)));}
    setViewMode("color");setShowImport(false);setImportImg(null);setImportImgEl(null);setImportPreviewGrid(null);
  };
  const cancelImport=()=>{setShowImport(false);setImportImg(null);setImportImgEl(null);setImportPreviewGrid(null);};

  const generateInstructions=()=>{const lines=[];
    for(let y=0;y<gridH;y++){const row=grid[y];const parts=[];let i=0;
      while(i<gridW){const st=row[i];if(!st){i++;continue;}let cnt=0;
        while(i<gridW&&row[i]?.id===st.id){cnt++;i++;}
        const lbl=lang==="bg"?st.labelBg:st.label;parts.push(cnt>1?`${cnt} ${lbl}`:lbl);}
      if(parts.length)lines.push(`${lang==="bg"?"Ред":"Row"} ${y+1}: ${parts.join(", ")}`);}
    return lines.length?lines.join("\n"):(lang==="bg"?"Празна схема":"Empty pattern");
  };

  const stitchCount=useMemo(()=>{let c=0;grid.forEach(r=>r.forEach(s=>{if(s)c++;}));return c;},[grid]);

  const exportPNG=()=>{const c=document.createElement("canvas");const sz=CELL;c.width=gridW*sz;c.height=gridH*sz;
    const ctx=c.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,c.width,c.height);
    for(let y=0;y<gridH;y++)for(let x=0;x<gridW;x++){
      if(viewMode==="color"&&colorGrid[y][x]){ctx.fillStyle=colorGrid[y][x];ctx.fillRect(x*sz,y*sz,sz,sz);}
      else if(grid[y][x]){ctx.fillStyle=grid[y][x].color||"#333";ctx.font=`${sz*0.7}px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(grid[y][x].sym,x*sz+sz/2,y*sz+sz/2);}
      ctx.strokeStyle="#ddd";ctx.strokeRect(x*sz,y*sz,sz,sz);}
    const a=document.createElement("a");a.download=`${projectName}.png`;a.href=c.toDataURL("image/png");a.click();
  };
  const exportSVG=()=>{const sz=CELL;let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${gridW*sz}" height="${gridH*sz}"><rect width="100%" height="100%" fill="#fff"/>`;
    for(let y=0;y<gridH;y++)for(let x=0;x<gridW;x++){
      if(viewMode==="color"&&colorGrid[y][x])svg+=`<rect x="${x*sz}" y="${y*sz}" width="${sz}" height="${sz}" fill="${colorGrid[y][x]}" stroke="#ddd" stroke-width="0.5"/>`;
      else if(grid[y][x]){svg+=`<rect x="${x*sz}" y="${y*sz}" width="${sz}" height="${sz}" fill="none" stroke="#ddd" stroke-width="0.5"/>`;
        svg+=`<text x="${x*sz+sz/2}" y="${y*sz+sz/2}" text-anchor="middle" dominant-baseline="central" fill="${grid[y][x].color}" font-size="${sz*0.65}">${grid[y][x].sym}</text>`;}
      else svg+=`<rect x="${x*sz}" y="${y*sz}" width="${sz}" height="${sz}" fill="none" stroke="#ddd" stroke-width="0.5"/>`;}
    svg+=`</svg>`;const blob=new Blob([svg],{type:"image/svg+xml"});const a=document.createElement("a");a.download=`${projectName}.svg`;a.href=URL.createObjectURL(blob);a.click();
  };
  const saveProject=()=>{const data=JSON.stringify({projectName,gridW,gridH,grid,colorGrid,freeLines,craftType,viewMode});
    const blob=new Blob([data],{type:"application/json"});const a=document.createElement("a");a.download=`${projectName}.kpd.json`;a.href=URL.createObjectURL(blob);a.click();};
  const loadProject=()=>{const inp=document.createElement("input");inp.type="file";inp.accept=".json";
    inp.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
      r.onload=ev=>{try{const d=JSON.parse(ev.target.result);pushHistory();setProjectName(d.projectName||"Project");setGridW(d.gridW);setGridH(d.gridH);setGrid(d.grid);setColorGrid(d.colorGrid);setFreeLines(d.freeLines||[]);if(d.craftType)setCraftType(d.craftType);if(d.viewMode)setViewMode(d.viewMode);}catch(err){alert("Invalid file");}};
      r.readAsText(f);};inp.click();};

  const st={
    app:{fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",height:"100vh",background:"var(--color-background-tertiary)",color:"var(--color-text-primary)",overflow:"hidden"},
    header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"var(--color-background-primary)",borderBottom:"1px solid var(--color-border-tertiary)",flexWrap:"wrap",gap:"6px"},
    logo:{display:"flex",alignItems:"center",gap:"8px"},
    logoIcon:{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#7F77DD,#D4537E)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14},
    body:{display:"flex",flex:1,overflow:"hidden"},
    sidebar:{width:220,background:"var(--color-background-primary)",borderRight:"1px solid var(--color-border-tertiary)",display:"flex",flexDirection:"column",overflow:"auto",flexShrink:0},
    main:{flex:1,overflow:"auto",display:"flex",flexDirection:"column"},
    toolbar:{display:"flex",gap:"4px",padding:"6px 8px",background:"var(--color-background-secondary)",borderBottom:"1px solid var(--color-border-tertiary)",flexWrap:"wrap",alignItems:"center"},
    canvasWrap:{flex:1,overflow:"auto",padding:12,display:"flex",justifyContent:"center",alignItems:"flex-start"},
    btn:a=>({padding:"4px 10px",borderRadius:6,border:"1px solid",borderColor:a?"var(--color-text-info)":"var(--color-border-tertiary)",background:a?"var(--color-background-info)":"var(--color-background-primary)",color:a?"var(--color-text-info)":"var(--color-text-primary)",cursor:"pointer",fontSize:12,fontWeight:500,transition:"all .15s",whiteSpace:"nowrap"}),
    smallBtn:a=>({padding:"3px 7px",borderRadius:5,border:"1px solid",borderColor:a?"var(--color-text-info)":"var(--color-border-tertiary)",background:a?"var(--color-background-info)":"transparent",color:a?"var(--color-text-info)":"var(--color-text-secondary)",cursor:"pointer",fontSize:11,fontWeight:500}),
    sideSection:{padding:"8px 10px",borderBottom:"1px solid var(--color-border-tertiary)"},
    sideTitle:{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",color:"var(--color-text-tertiary)",marginBottom:6},
    stitchGrid:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3},
    stitchBtn:a=>({display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"4px 2px",borderRadius:6,border:"2px solid",borderColor:a?"var(--color-text-info)":"transparent",background:a?"var(--color-background-info)":"var(--color-background-secondary)",cursor:"pointer",transition:"all .1s",minHeight:40}),
    colorSwatch:(c,a)=>({width:22,height:22,borderRadius:4,background:c,cursor:"pointer",border:a?"2px solid var(--color-text-info)":c==="#FFFFFF"?"1px solid var(--color-border-secondary)":"1px solid transparent",transition:"transform .1s",transform:a?"scale(1.15)":"scale(1)"}),
    paletteGrid:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3},
    statusBar:{display:"flex",gap:"12px",padding:"4px 10px",fontSize:11,color:"var(--color-text-tertiary)",background:"var(--color-background-primary)",borderTop:"1px solid var(--color-border-tertiary)"},
    input:{padding:"3px 6px",borderRadius:5,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,width:"100%"},
    numInput:{width:52,padding:"3px 5px",borderRadius:5,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontSize:12,textAlign:"center"},
    modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
    modalContent:{background:"var(--color-background-primary)",borderRadius:12,padding:20,maxWidth:700,width:"95%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.3)"},
    tabBar:{display:"flex",gap:0,borderBottom:"1px solid var(--color-border-tertiary)",marginBottom:6},
    tab:a=>({padding:"6px 12px",fontSize:12,fontWeight:500,cursor:"pointer",borderBottom:a?"2px solid var(--color-text-info)":"2px solid transparent",color:a?"var(--color-text-info)":"var(--color-text-secondary)",background:"transparent",border:"none",borderBottomWidth:2,borderBottomStyle:"solid"}),
  };
  const cellSize=CELL*zoom;
  const ipcs=importPreviewGrid?Math.max(2,Math.min(Math.floor(280/Math.max(importW,importH)),12)):6;

  return(
    <div style={st.app}>
      <div style={st.header}>
        <div style={st.logo}><div style={st.logoIcon}>K</div><span style={{fontSize:15,fontWeight:600}}>{t.title}</span></div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
          <input style={{...st.input,width:140}} value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder={t.projectName}/>
          {[["crochet",t.crochet],["knitting",t.knitting],["crossStitch",t.crossStitch]].map(([k,l])=>(<button key={k} style={st.btn(craftType===k)} onClick={()=>setCraftType(k)}>{l}</button>))}
          <span style={{width:1,height:20,background:"var(--color-border-tertiary)"}}/>
          <button style={st.btn(mode==="grid")} onClick={()=>setMode("grid")}>{t.gridMode}</button>
          <button style={st.btn(mode==="free")} onClick={()=>setMode("free")}>{t.freeMode}</button>
          <span style={{width:1,height:20,background:"var(--color-border-tertiary)"}}/>
          <button style={{...st.btn(false),background:"linear-gradient(135deg,#7F77DD22,#D4537E22)",borderColor:"#7F77DD"}} onClick={()=>setShowImport(true)}>{"📷 "+t.importImage}</button>
          <span style={{width:1,height:20,background:"var(--color-border-tertiary)"}}/>
          <button style={st.btn(false)} onClick={()=>setLang(lang==="bg"?"en":"bg")}>{t.lang}</button>
        </div>
      </div>
      <div style={st.body}>
        <div style={st.sidebar}>
          <div style={st.tabBar}>
            <button style={st.tab(panel==="stitches")} onClick={()=>setPanel("stitches")}>{t.stitches}</button>
            <button style={st.tab(panel==="colors")} onClick={()=>setPanel("colors")}>{t.colors}</button>
            <button style={st.tab(panel==="tools")} onClick={()=>setPanel("tools")}>{t.tools}</button>
          </div>
          {panel==="stitches"&&<div style={st.sideSection}><div style={st.stitchGrid}>
            {stitches.map(s=>(<button key={s.id} style={st.stitchBtn(selectedStitch?.id===s.id)} onClick={()=>{setSelectedStitch(s);setTool("draw");}}>
              <span style={{fontSize:16,lineHeight:1,color:s.color}}>{s.sym}</span>
              <span style={{fontSize:8,color:"var(--color-text-tertiary)",marginTop:2,textAlign:"center",lineHeight:1.1}}>{lang==="bg"?s.labelBg:s.label}</span>
            </button>))}</div></div>}
          {panel==="colors"&&<div style={st.sideSection}><div style={st.sideTitle}>{t.colors}</div>
            <div style={st.paletteGrid}>{COLOR_PALETTE.map(c=>(<div key={c} style={st.colorSwatch(c,selectedColor===c)} onClick={()=>{setSelectedColor(c);setTool("draw");}}/>))}</div></div>}
          {panel==="tools"&&<div style={st.sideSection}><div style={st.sideTitle}>{t.tools}</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <button style={st.btn(tool==="draw")} onClick={()=>setTool("draw")}>{t.draw}</button>
              <button style={st.btn(tool==="eraser")} onClick={()=>setTool("eraser")}>{t.eraser}</button>
              <button style={st.btn(tool==="fill")} onClick={()=>setTool("fill")}>{t.fill}</button>
              <div style={{height:8}}/>
              <button style={st.btn(mirrorH)} onClick={()=>setMirrorH(!mirrorH)}>{t.mirror} {mirrorH?"ON":"OFF"}</button>
              <button style={st.btn(false)} onClick={undo}>{t.undo}</button>
              <button style={st.btn(false)} onClick={redo}>{t.redo}</button>
              <button style={st.btn(false)} onClick={clearAll}>{t.clear}</button>
              <div style={{height:8}}/>
              <div style={st.sideTitle}>{t.gridW}</div>
              <input type="number" style={st.numInput} value={gridW} min={5} max={100} onChange={e=>resizeGrid(+e.target.value||5,gridH)}/>
              <div style={st.sideTitle}>{t.gridH}</div>
              <input type="number" style={st.numInput} value={gridH} min={5} max={100} onChange={e=>resizeGrid(gridW,+e.target.value||5)}/>
              <div style={{height:8}}/>
              <div style={st.sideTitle}>{t.zoom}</div>
              <input type="range" min={0.5} max={3} step={0.1} value={zoom} onChange={e=>setZoom(+e.target.value)} style={{width:"100%"}}/>
              <span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{Math.round(zoom*100)}%</span>
            </div></div>}
          <div style={{...st.sideSection,marginTop:"auto"}}><div style={{display:"flex",flexDirection:"column",gap:4}}>
            <button style={st.btn(false)} onClick={()=>setShowPreview(true)}>{t.preview}</button>
            <button style={st.btn(false)} onClick={()=>setShowInstructions(true)}>{t.generate}</button>
            <div style={{display:"flex",gap:4}}><button style={{...st.btn(false),flex:1}} onClick={exportPNG}>{t.exportPNG}</button><button style={{...st.btn(false),flex:1}} onClick={exportSVG}>{t.exportSVG}</button></div>
            <div style={{display:"flex",gap:4}}><button style={{...st.btn(false),flex:1}} onClick={saveProject}>{t.save}</button><button style={{...st.btn(false),flex:1}} onClick={loadProject}>{t.load}</button></div>
          </div></div>
        </div>
        <div style={st.main}>
          <div style={st.toolbar}>
            <button style={st.smallBtn(viewMode==="symbol")} onClick={()=>setViewMode("symbol")}>{t.symbolView}</button>
            <button style={st.smallBtn(viewMode==="color")} onClick={()=>setViewMode("color")}>{t.colorView}</button>
            <span style={{flex:1}}/><span style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{t.stitchCount}: {stitchCount} | {gridW}{t.cols} × {gridH}{t.rows}</span>
          </div>
          <div style={st.canvasWrap}>
            <div ref={gridRef} style={{position:"relative",cursor:tool==="eraser"?"crosshair":tool==="fill"?"cell":"crosshair",userSelect:"none",touchAction:"none"}}
              onMouseDown={onGridMouseDown} onMouseMove={onGridMouseMove} onMouseUp={onGridMouseUp} onMouseLeave={onGridMouseUp}>
              <svg ref={canvasRef} width={gridW*cellSize} height={gridH*cellSize} style={{display:"block",background:"var(--color-background-primary)",borderRadius:4,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
                {Array.from({length:gridH+1},(_,i)=>(<line key={`h${i}`} x1={0} y1={i*cellSize} x2={gridW*cellSize} y2={i*cellSize} stroke="var(--color-border-tertiary)" strokeWidth={i%5===0?0.8:0.3}/>))}
                {Array.from({length:gridW+1},(_,i)=>(<line key={`v${i}`} x1={i*cellSize} y1={0} x2={i*cellSize} y2={gridH*cellSize} stroke="var(--color-border-tertiary)" strokeWidth={i%5===0?0.8:0.3}/>))}
                {mirrorH&&<line x1={gridW*cellSize/2} y1={0} x2={gridW*cellSize/2} y2={gridH*cellSize} stroke="var(--color-text-danger)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5}/>}
                {grid.map((row,y)=>row.map((cell,x)=>{
                  if(viewMode==="color"){const c=colorGrid[y]?.[x];if(c)return<rect key={`${x}-${y}`} x={x*cellSize+0.5} y={y*cellSize+0.5} width={cellSize-1} height={cellSize-1} fill={c}/>;return null;}
                  if(!cell)return null;return(<text key={`${x}-${y}`} x={x*cellSize+cellSize/2} y={y*cellSize+cellSize/2} textAnchor="middle" dominantBaseline="central" fill={cell.color} fontSize={cellSize*0.65} fontWeight={500} style={{pointerEvents:"none"}}>{cell.sym}</text>);
                }))}
                {Array.from({length:gridH},(_,i)=>(<text key={`rn${i}`} x={-4} y={i*cellSize+cellSize/2} textAnchor="end" dominantBaseline="central" fontSize={9} fill="var(--color-text-tertiary)">{i+1}</text>))}
                {freeLines.map((line,i)=>(<polyline key={`fl${i}`} points={line.points.map(p=>`${p.x*zoom},${p.y*zoom}`).join(" ")} fill="none" stroke={line.color} strokeWidth={line.width*zoom} strokeLinecap="round" strokeLinejoin="round"/>))}
                {currentLine&&<polyline points={currentLine.points.map(p=>`${p.x*zoom},${p.y*zoom}`).join(" ")} fill="none" stroke={currentLine.color} strokeWidth={currentLine.width*zoom} strokeLinecap="round" strokeLinejoin="round"/>}
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div style={st.statusBar}>
        <span>{projectName}</span><span>{craftType==="crochet"?t.crochet:craftType==="knitting"?t.knitting:t.crossStitch}</span>
        <span>{gridW}×{gridH}</span><span>{t.zoom}: {Math.round(zoom*100)}%</span>
        <span style={{marginLeft:"auto"}}>{t.stitchCount}: {stitchCount}</span>
      </div>

      {showImport&&<div style={st.modal} onClick={cancelImport}><div style={{...st.modalContent,maxWidth:750}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:17,fontWeight:600}}>{"📷 "+t.importTitle}</h3>
          <button style={st.btn(false)} onClick={cancelImport}>{t.cancelImport}</button></div>
        {!importImg?(<div onDrop={handleImportDrop} onDragOver={e=>e.preventDefault()} onClick={()=>importFileRef.current?.click()}
          style={{border:"2px dashed var(--color-border-secondary)",borderRadius:12,padding:"48px 24px",textAlign:"center",cursor:"pointer",background:"var(--color-background-secondary)"}}>
          <div style={{fontSize:48,marginBottom:12,opacity:0.4}}>🖼️</div>
          <div style={{fontSize:14,color:"var(--color-text-secondary)"}}>{t.dropImage}</div>
          <input ref={importFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageFile(e.target.files?.[0])}/></div>
        ):(<div>
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center",padding:"10px 12px",background:"var(--color-background-secondary)",borderRadius:8}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase"}}>{t.widthCells}</label>
              <input type="range" min={10} max={120} value={importW} onChange={e=>setImportW(+e.target.value)} style={{width:120}}/>
              <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{importW} × {importH}</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase"}}>{t.keepRatio}</label>
              <button style={st.btn(importKeepRatio)} onClick={()=>setImportKeepRatio(!importKeepRatio)}>{importKeepRatio?"ON":"OFF"}</button></div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase"}}>{t.colorMode}</label>
              <div style={{display:"flex",gap:3}}>
                <button style={st.smallBtn(importColorMode==="original")} onClick={()=>setImportColorMode("original")}>{t.originalColors}</button>
                <button style={st.smallBtn(importColorMode==="yarn")} onClick={()=>setImportColorMode("yarn")}>{t.yarnColors}</button></div></div>
            {importColorMode==="original"&&<div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase"}}>{t.numColors}</label>
              <input type="range" min={2} max={30} value={importNumColors} onChange={e=>setImportNumColors(+e.target.value)} style={{width:80}}/>
              <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{importNumColors}</span></div>}
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase"}}>{t.generateSymbols}</label>
              <button style={st.btn(importGenSymbols)} onClick={()=>setImportGenSymbols(!importGenSymbols)}>{importGenSymbols?"ON":"OFF"}</button></div>
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:6}}>{t.imagePreview}</div>
              <img src={importImg} alt="preview" style={{maxWidth:280,maxHeight:280,borderRadius:8,border:"1px solid var(--color-border-tertiary)",objectFit:"contain",background:"#fff"}}/></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:600,color:"var(--color-text-tertiary)",textTransform:"uppercase",marginBottom:6}}>{t.resultPreview}{importProcessing?` (${t.processing})`:""}</div>
              {importPreviewGrid&&!importProcessing?(<svg width={importW*ipcs} height={importH*ipcs} style={{borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"#fff"}}>
                {importPreviewGrid.map((row,y)=>row.map((c,x)=>c?<rect key={`${x}-${y}`} x={x*ipcs} y={y*ipcs} width={ipcs} height={ipcs} fill={c}/>:null))}</svg>
              ):(<div style={{width:280,height:200,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,border:"1px solid var(--color-border-tertiary)",background:"var(--color-background-secondary)",color:"var(--color-text-tertiary)",fontSize:13}}>{t.processing}</div>)}</div>
          </div>
          {importGenSymbols&&<div style={{marginTop:10,padding:"6px 10px",background:"var(--color-background-info)",borderRadius:6,fontSize:11,color:"var(--color-text-info)"}}>{"ℹ️ "+t.symbolsNote}</div>}
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <button style={st.btn(false)} onClick={()=>{setImportImg(null);setImportImgEl(null);setImportPreviewGrid(null);}}>{"← "+t.otherImage}</button>
            <button style={{...st.btn(true),padding:"6px 20px",fontSize:13}} onClick={applyImport} disabled={!importPreviewGrid}>{"✓ "+t.applyImport}</button></div>
        </div>)}
      </div></div>}

      {showPreview&&<div style={st.modal} onClick={()=>setShowPreview(false)}><div style={st.modalContent} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:16}}>{t.preview}: {projectName}</h3>
          <button style={st.btn(false)} onClick={()=>setShowPreview(false)}>{t.close}</button></div>
        <div style={{textAlign:"center",overflow:"auto"}}>
          <svg width={Math.min(gridW*12,560)} height={Math.min(gridH*12,400)} viewBox={`0 0 ${gridW*CELL} ${gridH*CELL}`} style={{background:"#fff",borderRadius:8,border:"1px solid var(--color-border-tertiary)"}}>
            {grid.map((row,y)=>row.map((cell,x)=>{const c=colorGrid[y]?.[x];
              if(c)return<rect key={`p${x}-${y}`} x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill={c}/>;
              if(cell)return<rect key={`p${x}-${y}`} x={x*CELL} y={y*CELL} width={CELL} height={CELL} fill={cell.color} opacity={0.3}/>;return null;}))}</svg></div>
      </div></div>}

      {showInstructions&&<div style={st.modal} onClick={()=>setShowInstructions(false)}><div style={st.modalContent} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:16}}>{t.instructions}</h3>
          <div style={{display:"flex",gap:6}}><button style={st.btn(false)} onClick={()=>navigator.clipboard.writeText(generateInstructions())}>Copy</button>
            <button style={st.btn(false)} onClick={()=>setShowInstructions(false)}>{t.close}</button></div></div>
        <pre style={{fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap",background:"var(--color-background-secondary)",padding:12,borderRadius:8,maxHeight:400,overflow:"auto",fontFamily:"var(--font-mono,monospace)"}}>{generateInstructions()}</pre>
      </div></div>}
    </div>
  );
}
