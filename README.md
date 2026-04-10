# Дизайнер на плетива / Knitting Pattern Designer

Уеб базиран дизайнер за създаване на схеми за плетива — куки, игли и кръстат бод.

## Функционалности

- 3 типа плетене: Куки (16 бода), Игли (12 бода), Кръстат бод (6 бода)
- 2 режима на рисуване: Grid решетка + Свободно рисуване
- 2 изгледа: Символи (международни) + Цветове (пиксел арт)
- Инструменти: Рисуване, Гумичка, Запълване, Огледален режим, Undo/Redo, Zoom
- Експорт: PNG, SVG, JSON проект
- Генериране на текстови инструкции ред по ред
- Двуезичен интерфейс BG / EN
- Тъмен / светъл режим (автоматично)

## Инсталация

```bash
git clone https://github.com/YOUR-USERNAME/knitting-pattern-designer.git
cd knitting-pattern-designer
npm install
npm run dev
```

## Деплой в GitHub Pages

1. Създай ново репо в GitHub с име `knitting-pattern-designer`
2. Качи кода:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/knitting-pattern-designer.git
git push -u origin main
```
3. Settings -> Pages -> Source -> GitHub Actions
4. Сайтът: `https://YOUR-USERNAME.github.io/knitting-pattern-designer/`

## Лиценз

MIT
