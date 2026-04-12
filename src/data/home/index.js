import hero from './hero'
import about, { aboutCardVisualSrcs } from './about'
import skills from './skills'
import experience, { experienceVisualSrc } from './experience'
import projects from './projects'
import contact from './contact'
import hint from './hint'
import { sections } from './sections'

const locales = ['en', 'zh-TW']

function pickLocale(locale) {
  const key = locales.includes(locale) ? locale : 'en'
  return key
}

/** Full `home` message tree for vue-i18n */
export function homeMessages(locale) {
  const key = pickLocale(locale)
  return {
    hero: hero[key],
    about: about[key],
    skills: skills[key],
    experience: experience[key],
    projects: projects[key],
    contact: contact[key],
    sections: sections[key],
    hint: hint[key],
  }
}

export {
  hero,
  about,
  aboutCardVisualSrcs,
  skills,
  experience,
  experienceVisualSrc,
  projects,
  contact,
  hint,
  sections,
}
