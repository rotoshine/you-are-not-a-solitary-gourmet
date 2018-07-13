import * as fs from 'fs'
import express = require('express')
import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import * as admin from 'firebase-admin'


admin.initializeApp();

const app = express()
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
app.get('/parties/:partyId', async (req, res): Promise<any> => {    
  fs.readFile('./build/index.html', 'utf8', (err: Error, data: string): any => {
    if (err) {
      console.error(err.message)      
    } else {
      console.log('request to ' + req.params.partyId)
      return admin
        .firestore()
        .collection('parties')
        .doc(req.params.partyId)
        .get()
        .then((query: DocumentSnapshot) => {
          if (query.exists) {
            console.log(query.data())
            console.log(data)
            res.set('Content-Type', 'text/html')
            res.send(new Buffer(data))
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
