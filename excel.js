
const fillSheet = (workbook, worksheetName, talks) => {
  let sheet = workbook.addWorksheet(worksheetName)
  sheet.row(1).freeze()
  
  const setColumn = (worksheet, column, title, width, backgroundColor) => {
    const styleHeader = workbook.createStyle({
      font: {
        color: '#FFFFFF',
        size: 12,
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: backgroundColor || '#4472C4',
        fgColor: backgroundColor || '#4472C4'
      }
    })

    worksheet.cell(1, column).string(title).style(styleHeader)
    worksheet.column(column).setWidth(width)
  }

  const styleRating = workbook.createStyle({
    numberFormat: '0.00',
  })
  const styleOtherTalks = workbook.createStyle({
    alignment: {
      wrapText: true
    },
  })
  const styleTitle = workbook.createStyle({
    font: {
      bold: true
    }
  })
  const styleRedText = workbook.createStyle({
    font: {
      color: '#FF0000',
    }
  })
  const styleLightGrayText = workbook.createStyle({
    font: {
      color: '#D9D9D9',
    }
  })
  const styleGreenText = workbook.createStyle({
    font: {
      color: '#70AD47',
    }
  })

  let headerColumn = 1
  setColumn(sheet, headerColumn++, 'Rating', 8)
  setColumn(sheet, headerColumn++, 'Loves', 5.2)
  setColumn(sheet, headerColumn++, 'Hates', 5.2)
  setColumn(sheet, headerColumn++, 'State', 10)
  setColumn(sheet, headerColumn++, 'Title', 111)
  setColumn(sheet, headerColumn++, 'Level', 12)
  setColumn(sheet, headerColumn++, 'Format', 12)
  setColumn(sheet, headerColumn++, 'Categories', 32)
  setColumn(sheet, headerColumn++, 'Langage', 12)
  setColumn(sheet, headerColumn++, 'Has comment', 12)
  setColumn(sheet, headerColumn++, 'Link', 5)

  const talksSpeakersCounts = talks.map(talk => {
    return talk.speakers.length
  })
  const speakersBackground = [
    '#C65911',
    '#548235',
    '#305496',
  ]

  const maxSpeakerCount = Math.max(...talksSpeakersCounts)
  for (let i = 0; i < maxSpeakerCount; i++) {
    setColumn(sheet, headerColumn++, `Speaker ${i + 1} name`, 30, speakersBackground[i%3])
    setColumn(sheet, headerColumn++, `Speaker ${i + 1} email`, 35, speakersBackground[i%3])
    setColumn(sheet, headerColumn++, `Speaker ${i + 1} company`, 20, speakersBackground[i%3])
    setColumn(sheet, headerColumn++, `Speaker ${i + 1} location`, 20, speakersBackground[i%3])
    setColumn(sheet, headerColumn++, `Speaker ${i + 1} othertalks`, 111, speakersBackground[i%3])
  }

  talks.forEach((talk, index) => {
    const line = index + 2
    let column = 1
    sheet.cell(line, column++).number(talk.rating).style(styleRating)
    sheet.cell(line, column++).number(talk.loves).style(talk.loves > 0 ? styleGreenText : styleLightGrayText)
    sheet.cell(line, column++).number(talk.hates).style(talk.hates > 0 ? styleRedText : styleLightGrayText)
    sheet.cell(line, column++).string(talk.state)
    sheet.cell(line, column++).string(talk.title).style(styleTitle)
    sheet.cell(line, column++).string(talk.level || '')
    sheet.cell(line, column++).string(talk.formats || '')
    sheet.cell(line, column++).string(talk.categories || '')
    sheet.cell(line, column++).string(talk.language || '')
    sheet.cell(line, column++).string(talk.hasOrganizerMessages ? 'yes' : 'no').style(talk.hasOrganizerMessages > 0 ? styleGreenText : styleLightGrayText)
    const link = 'https://conference-hall.io/organizer/event/mB6d6o0uQONgUiFuo9We/proposal/' + talk.id
    sheet.cell(line, column++).link(link, 'link')

    // list authors and other talks
    talk.speakers.forEach(speaker => {
      sheet.cell(line, column++).string(speaker.name)
      sheet.cell(line, column++).link(`mailto:${speaker.email}`, speaker.email)
      sheet.cell(line, column++).string(speaker.company)
      sheet.cell(line, column++).string(speaker.location)
      let othertalks = speaker.otherTalks.map(otherTalk => `-${otherTalk.title}`).join('\n')
      sheet.cell(line, column++).string(othertalks).style(styleOtherTalks)
    })
  })
}


module.exports = {
  fillSheet
}
