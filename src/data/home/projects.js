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
    /** `src/assets/images/home/projects/gingerbread-visual.*` */
    imageSrc: '',
    x: 16,
    y: 80,
    w: 220,
    h: 148,
  },
  {
    id: 'hp-vs-v',
    type: 'visual',
    projectId: 'visual',
    /** `src/assets/images/home/projects/visual-system.*` */
    imageSrc: '',
    x: 440,
    y: 20,
    w: 190,
    h: 128,
  },
  {
    id: 'hp-fl-v',
    type: 'visual',
    projectId: 'flow',
    /** `src/assets/images/home/projects/flow-visual.*` */
    imageSrc: '',
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
    h: 132,
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
    caseStudy: {
      titleBefore: 'Featured: ',
      titleHighlight: 'Cookierun',
      titleAfter: '',
      hoverSiteUrl: 'https://www.cookierunbraverse.com.tw/',
      hoverPreviewImage:
        'https://static.wixstatic.com/media/d6fef4_effdd1f7d98d494581771077051b95ac%7Emv2.png/v1/fit/w_720,h_382,al_c,q_85,usm_0.66_1.00_0.01/d6fef4_effdd1f7d98d494581771077051b95ac%7Emv2.png',
      previewLinkLabel: 'Open Cookie Run: Braverse official site',
      summary:
        'End-to-end UI/UX from problem framing to shipped flows — research, IA, visual system, and interaction specs.',
      linkHref: '',
      linkLabel: 'View case study',
    },
    captions: {
      gingerbread:
        'Gingerbread Man — end-to-end UI/UX planning and product framing.',
      visual:
        'Unified visual language: components, spacing, and tone across flows.',
      flow:
        'Interaction and motion aligned with the story we wanted users to feel.',
    },
    titles: {
      gingerbread: 'Gingerbread Man — UI/UX',
      visual: 'Visual system',
      flow: 'Flow & motion',
    },
  },
  'zh-TW': {
    title: '專案',
    visualAria: '可拖曳的專案畫框',
    surfaceAria: '專案筆記本 — 可拖曳圖示與說明。',
    caseStudy: {
      titleBefore: '精選：',
      titleHighlight: '跑跑薑餅人',
      titleAfter: '專案',
      hoverSiteUrl: 'https://www.cookierunbraverse.com.tw/',
      hoverPreviewImage:
        'https://static.wixstatic.com/media/d6fef4_effdd1f7d98d494581771077051b95ac%7Emv2.png/v1/fit/w_720,h_382,al_c,q_85,usm_0.66_1.00_0.01/d6fef4_effdd1f7d98d494581771077051b95ac%7Emv2.png',
      previewLinkLabel: '開啟《薑餅人對戰卡牌 Braverse》官方網站',
      summary:
        '從問題定義到上線流程的完整 UI/UX——研究、資訊架構、視覺系統與互動規格。',
      linkHref: '',
      linkLabel: '查看案例',
    },
    captions: {
      gingerbread: '薑餅人專案 — 從產品定位到整體 UI/UX 規劃。',
      visual: '一致的視覺語言：元件、留白與語氣貫穿整體體驗。',
      flow: '互動與動效與我們想讓使用者感受到的故事一致。',
    },
    titles: {
      gingerbread: '薑餅人 — UI/UX',
      visual: '視覺系統',
      flow: '流程與動效',
    },
  },
}
