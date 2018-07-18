import * as fs from 'fs'
import express = require('express')
import * as functions from 'firebase-functions'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import * as admin from 'firebase-admin'

import * as cors from 'cors'

admin.initializeApp();

const app = express()
app.use(cors({ origin: true }));

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
            const party = query.data()
            res.set('Content-Type', 'text/html')

            const title = `안 고독한 미식가 - ${party.title}`
            const description = `${party.destinationName}에서 벌어지는 파티에 참여하세요.`

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
