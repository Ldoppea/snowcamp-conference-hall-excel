const fs = require('fs')
const axios = require('axios')

const getTalkFormat = (event, formatId) => {
  if (formatId === undefined) {
    return ''
  }

  return event.formats.find(format => format.id === formatId).name
}

const getTalkCategory = (event, categoryId) => {
  if (categoryId === undefined) {
    return ''
  }

  return event.categories.find(category => category.id === categoryId).name
}

const getTalkSpeaker = (privateEvent, publicEvent, talk) => {
  return privateEvent.speakers
    .filter(speaker => talk.speakers.includes(speaker.uid))
    .map(speaker => {
      console.log(speaker)
      let country = ''
      if (speaker.address && speaker.address.country) {
        country = speaker.address.country.long_name
      }
      return {
        name: speaker.displayName,
        email: speaker.email,
        location: country,
        otherTalks: publicEvent.talks
          .filter(otherTalk => otherTalk.speakers.includes(speaker.uid) && otherTalk.title != talk.title)
      }
    })
}

const getTalkLanguage = (language) => {
  if (!language || language === '') return ''

  const fr = [
    'fr',
    'français',
    'francais',
    'france',
    'french'
  ]

  const en = [
    'en',
    'english',
    'anglais'
  ]
  const hasFr = fr.some(str => language.toLowerCase().includes(str))
  const hasEn = en.some(str => language.toLowerCase().includes(str))

  if (hasFr && hasEn) {
    return 'Français/Anglais'
  } else if (hasFr) {
    return 'Français'
  } else if (hasEn) {
    return 'Anglais'
  } else {
    return 'Invalid'
  }
}

// Get the talk from the private event data (json export functionality)
const getPrivateTalkData = (privateEvent, talk) => {
  const privateTalkData = privateEvent.talks.find(privateTalk => privateTalk.title === talk.title && privateTalk.abstract === talk.abstract)

  return privateTalkData
}

// Retrieve data from public api and private exported file and merge everything in one array of talks
const getTalkData = (privateFile, publicUrl) => {
  const conferenceHallExport = fs.readFileSync(privateFile)
  const privateEvent = JSON.parse(conferenceHallExport)

  return axios.get(publicUrl)
    .then(result => {
      const publicEvent = result.data

      const talks = publicEvent.talks.map(currentTalk => {
        const privateTalk = getPrivateTalkData(privateEvent, currentTalk)
        return {
          id: currentTalk.id,
          title: currentTalk.title,
          state: currentTalk.state,
          level: currentTalk.level,
          abstract: currentTalk.abstract,
          categories: getTalkCategory(publicEvent, currentTalk.categories),
          formats: getTalkFormat(publicEvent, currentTalk.formats),
          speakers: getTalkSpeaker(privateEvent, publicEvent, currentTalk),
          rating: privateTalk.rating,
          loves: privateTalk.loves,
          hates: privateTalk.hates,
          language: getTalkLanguage(currentTalk.language),
          hasOrganizerMessages: privateTalk.organizersThread.length > 0
        }
      }).filter(talk => {
        return talk.formats == 'Talk (45 min)' // we don't want the University format
      })

      return talks
    })
}

module.exports = {
  getTalkData
}
