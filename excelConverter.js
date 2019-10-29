const xl = require('excel4node')
const talks = require('./talks')
const excel = require('./excel')

const EXPORT_FILE = '<set-file-path>'
const API_KEY = '<set-api-key>'
const EVENT_ID = '<set-event-id>'

const sortByRating = (a, b) => {
  return a.rating - b.rating
}

talks.getTalkData(EXPORT_FILE, `https://www.conference-hall.io/api/v1/event/${EVENT_ID}?key=${API_KEY}`)
  .then((talks) => {
    let workbook = new xl.Workbook()

    /*************/
    /* ALL TALKS */
    /*************/
    const allTalks = talks.filter(talk => {
      return talk.formats == 'Talk (45 min)'
    }).sort(sortByRating).reverse()

    excel.fillSheet(workbook, 'All', allTalks)

    /**************/
    /* CATEGORIES */
    /**************/
    const categories = [
      { name: 'DevOps / Cloud', sheetTitle: 'DevOps | Cloud' },
      { name: 'Web / Mobile / IoT', sheetTitle: 'Web | Mobile | IoT' },
      { name: 'I.A. & Deep / Machine Learning', sheetTitle: 'Machine Learning' },
      { name: 'Languages & Paradigms', sheetTitle: 'Languages & Paradigms' },
      { name: 'Discover', sheetTitle: 'Discover' },
      { name: 'Architecture, Performance & Security', sheetTitle: 'Archi | Perfs | Security' },
    ]

    categories.forEach(category => {
      const categoryTalks = talks.filter(talk => {
        return talk.categories == category.name
      }).sort(sortByRating).reverse()

      excel.fillSheet(workbook, category.sheetTitle, categoryTalks)
    })
    
    workbook.write('ConferenceHall.xlsx')
  })