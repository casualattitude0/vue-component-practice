/**
 * Scrapbook floats — same model as NotebookPage: separate visual + caption per project.
 * Positions are px on the notebook surface.
 */
// Design canvas reference: 660 × 520 px.
// Each visual and caption occupies a non-overlapping zone:
//
//   Zone map (design px, no item bounding boxes touch):
//
//   [gb_v  16–236, 80–228]      [vs_c 244–430, 24–88]   [vs_v 440–630, 20–148]
//   [gb_c 250–430, 108–180]
//   [fl_v  24–264, 282–440]     [fl_c 278–470, 314–386]
//
export const HOME_PROJECT_NOTEBOOK_ITEMS = [
  {
    id: 'hp-gb-v',
    type: 'visual',
    projectId: 'gingerbread',
    x: 16,
    y: 80,
    w: 220,
    h: 148,
  },
  {
    id: 'hp-vs-v',
    type: 'visual',
    projectId: 'visual',
    x: 440,
    y: 20,
    w: 190,
    h: 128,
  },
  {
    id: 'hp-fl-v',
    type: 'visual',
    projectId: 'flow',
    x: 24,
    y: 282,
    w: 240,
    h: 158,
  },
  {
    id: 'hp-gb-c',
    type: 'caption',
    projectId: 'gingerbread',
    x: 250,
    y: 108,
    w: 180,
    h: 72,
  },
  {
    id: 'hp-vs-c',
    type: 'caption',
    projectId: 'visual',
    x: 244,
    y: 24,
    w: 186,
    h: 64,
  },
  {
    id: 'hp-fl-c',
    type: 'caption',
    projectId: 'flow',
    x: 278,
    y: 314,
    w: 192,
    h: 72,
  },
]

export default {
  en: {
    title: 'Projects',
    visualAria: 'Draggable project frame',
    surfaceAria: 'Project notebook — drag visuals and captions.',
    captions: {
      gingerbread:
        'Gingerbread Man — end-to-end UI/UX planning and product framing.',
      visual:
        'Unified visual language: components, spacing, and tone across flows.',
      flow:
        'Interaction and motion aligned with the story we wanted users to feel.',
    },
  },
  'zh-TW': {
    title: '專案',
    visualAria: '可拖曳的專案畫框',
    surfaceAria: '專案筆記本 — 可拖曳圖示與說明。',
    captions: {
      gingerbread: '薑餅人專案 — 從產品定位到整體 UI/UX 規劃。',
      visual: '一致的視覺語言：元件、留白與語氣貫穿整體體驗。',
      flow: '互動與動效與我們想讓使用者感受到的故事一致。',
    },
  },
}
