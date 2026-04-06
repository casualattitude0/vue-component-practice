import { homeMessages } from '../data/home'
import footer from '../data/footer'
import { notebookPageMessages } from '../data/notebook/messages'

export default {
  langSwitcher: {
    aria: 'Switch to {lang}',
  },
  nav: {
    home: 'Home',
    mainNav: 'Main navigation',
  },
  home: homeMessages('en'),
  footer: footer.en,
  notebookPage: notebookPageMessages.en,
}
