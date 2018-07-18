import * as fs from 'fs'
import express = require('express')
import * as functions from 'firebase-functions'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import * as admin from 'firebase-admin'
import * as cors from 'cors'
import * as hangul from 'hangul-js'

admin.initializeApp();

const app = express()
app.use(cors({ origin: true }));

const createDescription = (party: Party) => {
  const { category, destinationName, playName } = party
 
  if (category.isTravel) {
    return `${destinationName}${hangul.endsWithConsonant(destinationName) ? '로' : '으로'} 떠나는 여행에 참여하세요!`
  } else if (category.isRestaurant && category.isPlaying) {
    return `${destinationName} 먹고 ${playName} 할 사람 모여요!`
  } else if (!category.isRestaurant && category.isPlaying) {
    return `${playName} 하고 놀 사람 모여요!`
  }

  return `${destinationName}에서 벌어지는 파티에 참여하세요!`
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
app.get('/parties/:partyId', async (req, res): Promise<any> => {
  const { partyId } = req.params

  fs.readFile('./index.html', 'utf8', (err, htmlString) => {
    if (err) {
      console.error(err.message)
      res.redirect('/')
    } else {
      admin
        .firestore()
        .collection('parties')
        .doc(partyId)
        .get()
        .then((query: DocumentSnapshot) => {
          if (query.exists) {
            const party = <Party>query.data()
            res.set('Content-Type', 'text/html')

            const title = `안 고독한 미식가 - ${party.title}`
            const description = createDescription(party)

            const url = `https://${functions.config().angomi.domain}/${partyId}`

            let replacedHTML = htmlString.replace(
              /<title>(.*?)<\/title>/,
              `<title>${title}</title>`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="og:title" .*?\/>/,
              `<meta name="og:title" content="${title}" />`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="description" .*?\/>/,
              `<meta name="description" content="${description}" />`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="og:description" .*?\/>/,
              `<meta name="og:description" content="${description}" />`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="url" .*?\/>/,
              `<meta name="url" content="${url}" />`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="og:url" .*?\/>/,
              `<meta name="og:url" content="${url}" />`
            )
            replacedHTML = replacedHTML.replace(
              /<meta name="identifier-URL" .*?\/>/,
              `<meta name="identifier-URL" content="${url}" />`
            )

            console.log(`${title} visited.`)
            res.send(new Buffer(replacedHTML))
          } else {
            res.redirect('/')
          }
        })
        .catch((e: Error) => {
          console.error(e.message)
          res.redirect('/')
        })
    }
  })
})

export const partyDetail = functions.https.onRequest(app)
