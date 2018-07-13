# 안 고독한 미식가

식사, 커피타임, 각종 문화생활을 함께 할 파티를 만들고 모집하는 웹 애플리케이션

# 설치 및 배포

## node.js

`create-react-app` 기반의 앱이므로 `node.js` 설치가 필요하다.

## npm install

`git clone` 후 `npm install`로 필요 모듈들을 설치해주자.

## firebase project 생성

`firebase`의 auth, firestore를 이용하여 구현되어있어서 firebase project 생성이 필요하다.

https://console.firebase.google.com 에서 생성하자.

## .env 생성

`.env`를 통해 프로젝트에 필요한 환경변수들을 주입 받도록 되어있다.

프로젝트 루트에 `.env`를 만들고 위에서 만든 firebase project의 API 키들을 해당하는 값들에 채워넣는다.

파티 생성 알람을 slack으로 받고 싶다면 slack hook url을 만들어서 해당 값에 넣는다.

```
# firebase setting
REACT_APP_FIREBASE_API_KEY=apiKey
REACT_APP_FIREBASE_AUTH_DOMAIN=authDomain
REACT_APP_FIREBASE_DATABASE_URL=databaseUrl
REACT_APP_FIREBASE_PROJECT_ID=projectId

# slack setting
REACT_APP_SLACK_HOOK=your slack hook url
```

## .firebaserc 생성

`firebase hoting`에 배포를 해서 쓸 경우 `.firebaserc` 파일을 프로젝트 루트에 생성한다.

`default` 에 생성한 `firebase` 프로젝트 명을 넣는다.

```json
{
  "projects": {
    "default": YOUR_FIREBASE_PROJECT_NAME   
  }
}
```

# 만드는 사람들

- 로토 - https://github.com/rotoshine
- 루카스 - https://github.com/stardustrain
- 오다 - https://github.com/yogicat
- 알마 - https://github.com/colus001