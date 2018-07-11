# 안 고독한 미식가

## firebase project
auth, database 등을 firebase를 사용하므로 firebase project 생성이 필요.

## .env 생성
프로젝트 루트에 `.env`를 만들고 위에서 만든 firebase project의 API 키들을 통해 아래의 값을 채워넣는다.

```
REACT_APP_FIREBASE_API_KEY=apiKey
REACT_APP_FIREBASE_AUTH_DOMAIN=authDomain
REACT_APP_FIREBASE_DATABASE_URL=databaseUrl
REACT_APP_FIREBASE_PROJECT_ID=projectId

```
## 사용된 프레임워크 및 라이브러리

- React
- Bootstrap
- Firebase
  - Authentication
  - FireStore
- Mobx
- Lodash
- Moment
- axios
- bluebird

## data structure

### users

```json
{
  "id": {
    "displayName": String,
    "email": String,
    "photoURL": String
  }
  ...
}
```

### parties

```json
{
  "id": {
    "category": String,   
    "title": String,
    "description": String,
    "destinationName": String,
    "isDelevery": Boolean,    
    "partyTime": Date,
    "dueDateTime": Date,
    "maxPartyMembers": Number,
    "joinners": Array<User>,
    "createdAt": Date,
    "createdBy": String
  }
}
```

### comments

```json
{
  "id": {
    "partyId": String,
    "content": String,
    "isDisplay": Boolean,
    "createdAt": Date,
    "createdBy": String,
    "user": User
  }
}
```

### destinations

```json
{
  "destinationName": {    
    "partyCreatedCount": Number,
    "reviews": Array<Review>
  }
}
```