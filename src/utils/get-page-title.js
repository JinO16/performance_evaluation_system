import defaultSettings from '@/settings'

const title = defaultSettings.title || '岗位绩效绩分考评系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
