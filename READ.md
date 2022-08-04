### mongodb

과거에는, front-end와 back-end가 따로 존재하지 않았지만 최근에는 따로 존재하게 되었다.

---

최근에는, front-end코드를 크롬에서 대부분 가져다 놓고 화면에 다른 버튼을 클릭했을시에 부터는 서버가 html코드를 가지고 있는것이 아니라 json과 같은 데이터를 줌으로써 프론트에 데이터를 주는 것이다.

그렇다면, 프론트엔드가 바로 db를 호출하면 되는데 왜 backend를 중간에 두는가 크게는
인증 & 권한과 데이터의 오염 방지를 위함이다.

#### MongoDB와 RDBMS의 용어차이

RDBMS에서의 table -> mongodb에서 collection이라고 표기하고 (table = collection)
RDBMS에서의 row -> mongodb에서 document라고 한다. (row = document)

🗝 핵심은, row -> document로 불린다.
