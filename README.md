# 202130115 박건일
## 2025-09-17 4주차 수업내용
### 1. Creating a page(페이지 만들기)
- Next.js는 파일 시스템 기반 라우팅을 사용하기 때문에 폴더와 파일을 사용하여 경로를 정의할 수 있다.
- 이번 장에서는 레이아웃과 페이지를 만들고 서로 연결하느 방법을 설명한다.

- page는 특정 경로에서 렌더링되는 ui이다.
- page를 생성하려면 app디렉터리에 page파일을 추가하고, React컴포넌트를 default export한다.
### 2. Creating a layout(레이아웃 만들기)
- layout은 여러 페이지에서 공유되는 UI입니다.
- layout은 네비게이션에서 state 및 상호작용을 유지하며, 다시 렌더링 되지는 않습니다.
- layout 파일에서 React 컴포넌트의 default export를 사용하여 layout을 정의할 수 있다.
- layout 컴포넌트는 page또는 layout이 될 수 있는 children prop를 허용해야 한다.
- children은 컴포넌트 안에 감싸진 요소를 의미
- < page />는 < layout />컴포넌트의 children입니다.
- layout컴포넌트를 만들 때 그 안에 들어갈 콘텐츠를 받을 수 있게 해야하고, 그 컨텐츠는 page또는 layout이 될 수 있다.
   
- Rootlayout component는 반드시 있어야함.
### 3. Creating a nested route(중첩 라우트 만들기)
- 중첩 라우트는 다음 URL 세그먼트로 구성된 라우트입니다.
- 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트를 정의하는데 사용된다.
- 예를 들어, /blog/[sulg ]경로는 세 개의 세그먼트로 구성된다.
  - / (Root Segment)
  - blog (Segment)
  - [slug ] (Leaf Segment)
     
- [Next.js에서 ]
- 폴더는 URL 세그먼트에 매핑되는 경로 세그먼트를 정의하는데 사용된다. 즉 폴더가 URl세그먼트가 된다는 의미이다.
- 파일은 세그먼트에 표시되는 UI를 만드는데 사용된다.
- 폴더를 중첩하면 중첩된 라우트를 만들 수 있다.
- URL Segment URL에서 특정 리소스에 대한 경로를 구성하는 부분을 의미한다.
   
- 폴더를 계속 중첩하여 중첩된 경로를 만들 수 있다. 
- 예를 들어 특정 블로그 게시물에 대한 경로를 만들려면 blog 안에 새 [ slug] 폴더를 만 들고 page 파일을 추가한다.
- 폴더 이름을 대괄호(예: [ slug])로 묶으면 데이터에서 여러 페이지를 생성하는데 사용 되는 동적 경로 세그먼트가 생성됩니다. 예: 블로그 게시물, 제품 페이지 등.
---
###  [ slug]의 이해
- slug는 사이트의 특정 페이지를 쉽게 읽을 수 있는 형태로 식별하는 URL의 일부입니다.
- 신문이나 잡지 점에서 핵심 코미를 포함하는 단어만을 조합해 간단 정료하게 제목을 작성하는 것을 슐러그라고 하는 것에서 유래 하였습니다.
- 문서의 경로/blog/[ slug]의 [ slug] 부분은 불러올 데이터의 key를 말합니다.
- 따라서 데이터에는 slug key가 반드시 있어야 합니다.

- 여기서 [ slug]는 nextjs, routing, ssr-ssg, dynamic-routes에 해당합니다.
- 동작은 정상적으로 되지만 한가지 오류가 발생합니다. Error: Route "/blog/[ slug]" used "params.slug"- "params" should be awaited before using its properties.
- 이 오류는 Next.js App Router에서 params가 비동기(async) 객체처럼 다뤄지는 경우 발생합니다.
- Next.js 14.2 이후로 params와 searchParams는 내부적으로 Promise 기반 객체일 수 있어서, 바로 쓰면 안 되고 await하거나 props의 구조 분해에서 미리 await해야 합니다. 현재 실습 중인 버전은 15.x이기 때문에 오류가 발생하는 것입니다.
```
export default async function Posts({ params }: { params: { slug: string } })
 { const { slug } = await params; // params
const post = posts.find(pp.slugmslug);
 }
```
---
- sync function: 함수를 async로 선언해야 내부에서 await를 쓸 수 있습니다.
- await을 사용하는 이유는 서버의 데이터를 읽어올 때 타임 딜레이에 의한 오류를 방지 하기 위해서 입니다.
  - RESTful API HTTP 프로토콜을 사용하여 자원을 식별하고 조작하는 통신 규칙을 정의
- 매개변수 구조({ params }): Next.js가 페이지를 호출할 때는 props 객체로 {params. searchParams, ... } 같은 값을 넘겨주는데, 여기서 params만 구조 분해로 받고 있습니다.
- 타입 { params: Promisec{ slug: string }> }: Typescript 타입 선언입니다.
- params가 Promise(비동기 값)임을 명시하고 있습니다.          
---   
- 4번째 라인 const { slug} = await params;
- await params params가 가리키는 Promise를 해제(resolve) 해서 실제 객체 { slug:"..." }를 얻습니다.
- const { slug }....는 그 객체에서 slug 프로퍼티만 꺼내 오는 구조 분해 할당입니다.
- const resolved = await params;
const slug resolved.slug:
---      
- 5번째 라인 const post = posts.find((p) p.slug === slug);
- posts는 배열입니다. (예: 더미 데이터나 DB에서 가져온 결과)
- .find()는 조건에 맞는 첫 번째 요소를 반환합니다. 못 찾으면 undefined를 반환합니다.
- 여기서는 D.slug가 URL에서 온 slug와 일치하는 게시글을 찾아 post에 할당합니다.
- .find는 찾는 것이 없으면 undefined이기 때문에 이후에 post.title 같은 접근을 하면 런타임 에러가 납니다.
- 따라서 게시글이 존재 하는지를 검사할 필요가 있습니다.
- 문서에서는 없기 때문에 이부분을 추가한 것입니다. (lib에 별도로 구현했을 수는 있음)
   
- 데이터 소스가 크다면 find는 O(n)이므로 DB 쿼리로 바꿔야 합니다. : 0(n)은 알고리즘의 시간 복잡도가 입력 데이터의 크기 n에 비례하여 시간이나 메모리 사용량이 선형적으로 증가하는 것을 의미합니다.
- 앞의 코드에서는 Promise...>를 사용하지 않아도 오류 없이 동작했습니다.
- 하지만 params가 동기식처럼 보이지만 사실은 비동기식이라는 것을 좀더 명확히 하기 위해 사용합니다. 코드의 가독성이 좋습니다.
- 또 한가지 Promise를 명시해주면 await을 깜빡했을 때 TypeScript가 이를 잡아줍니다.
- 결론적으로 오류와 상관없이 Promise 사용을 권장합니다.
###  Nesting layouts (중첩 레이아웃)
- 기본적으로 폴더 계층 구조의 레이아웃도 중첩되어 있습니다.
- 즉, 자식 prop을 통해 자식 레이아웃을 감싸게 됩니다.
- 특정 경로 세그먼트(폴더) 안에 레이아웃을 추가하여 레이아웃을 중첩할 수 있습니다.
- 예를 들어 blog 경로에 대한 레이아웃을 만들려면 blog 폴더 안에 새 레이아웃 파일을 추가합니다.
### 5.Creating a dynamic segment(동적 세그먼트 만들기)
- 동적 세그먼트를 사용하면 데이터에서 생성된 경로를 만들 수 있습니다
  - 예를 들어, 각 blog 게시물에 대한 경로를 직접 만드는 대신, 동적 세그먼트를 만들어 블로그 게시물 데이터를 기반으로 경로를 생성할 수 있습니다.
  -동적 세그먼트를 생성하려면 세그먼트(폴더) 이름을 대괄호로 묶습니다. 예: [ segmentName]） 예를 들어, app/blog/[ slug]/page.tsx 경로에서 [ slug]는 동적 세그먼트입니다.
### 6. Rendering with search params(검색 매개변수를 사용한 렌더링)
- 서버 컴포넌트 page에서는 searchParams prop을 사용하여 검색 매개변수에 액세스할 수 있습니다.
- searchParams를 사용하면 해당 페이지는 동적 렌더링 (dynamic rendering)으로 처리됩니다.
- 왜냐하면 URL의 쿼리 파라미터(search parameters)를 읽기 위해 요청(request)이 필요하기 때문입니다.
- 클라이언트 컴포넌트는 useSearchParams Hook을 사용하여 검색 매개변수를 읽을 수 있습니다.
   
- 페이지에 대한 데이터를 로드하기 위해 검색 매개변수가 필요한 경우(예: 페이지 매김, 데이터베이스에서 필터링) searchParams prop을 사용합니다.   
- 검색 매개변수가 클라이언트에서만 사용되는 경우(예: props를 통해 이미 로딩된 목록을 필터링하는 경우) useSearchParams를 사용합니다.
- 콜백이나 이벤트 핸들러에서 new URLSearchParams(window.location.search)를 사용하여 리랜더링을 하지 않고도 검색 매개변수를 읽어올 수 있습니다.
- params는 동적 세그먼트 [ slug]에서 가져오는 값으로 URL의 path 부분에 포함된 데이터 를 의미합니다.
- searchParams 는 query string에서 가져오는 값으로 URL의 ? 이후에 붙는 key=value 데이터를 의미합니다.
### searchParams란?
- URL의 쿼리 문자열(Query String)을 읽는 방법입니다.
- 예시 URL: /products?category=shoes&page=2
- 여기서 category=shoes, page=2가 search parameters입니다.
### 왜 동적 렌더링이 되는가?
- Next.js에서 페이지는 크게 정적(static) 또는 동적(dynamic)으로 렌더링될 수 있습니다.
- searchParams는 요청이 들어와봐야 값을 알 수 있기 때문에, Next.js는 이 페이지를 정적으로 미리 생성할 수 없고, 요청이 올 때마다 서버 렌더링해야 합니다. -> 동적 렌더링 처리
즉, searchParams를 사용하는 순간 Next.js는
- 이 페이지는 요청이 들어와야 동작하네? -> 그러면 정적으로 미리 만들 수 없겠다!"라고 판단합니다. 
   
- 정적 렌더링 - 예시(/about,/ blog[ id]등), 빌드 시 생성, searhParams 사용 불가능
- 동적 렌더링 - 예시(/products?page=2 와 같이 동적 URL), 요청 시 서버에서 생성, searhParams 사용 가능     
## 2025-09-10 3주차 수업내용
### 용어 정의  
- 원문에는 route라는 단어가 자주 등장하고, 사전적 의미로는 경로입니다.
- route(라우트)는 경로를 의미하고, routing(라우팅)은 경로를 찾아가는 과정을 의미합니다.
- 그런데 path도 경로로 번역하기 때문에 구별을 위해 대부분 routing(라우팅)으로 번역했습니다.
- directory와 folder는 특별한 구분 없이 나옵니다.
- 최상위 폴더의 경우 directory로 하위 폴더는 folder로 쓰는 경우가 많지만 꼭 그렇지는 않습니다.
- directory와 folder는 OS에 따라 구분되는 용어이기 때문에 같은 의미로 이해하면 됩니다.
- segment routing과 관련이 있는 directory의 별칭 정도로 이해하면 됩니다.
### 1. Folder and file conventions (폴더 및 파일 규칙)\
- [최상위 폴더] Top-level folders
  - 최상위 폴더는 애플리케이션의 코드와 정적 자산을 구성하는 데 사용됩니다.
  - app(앱 라우터), pages(페이지 라우터), public(제공될 정적 리소스), src(선택적 애플리케이션 소스 폴더)
  - 최상위 파일은 애플리케이션 구성, 종속성 관리, 미들웨어 실행, 모니터링 도구 통합, 환경 변수 정의에 사용됩니다.
- 다음 파일이 프로젝트 생성과 동시에 모두 생성되는 것은 아닙니다.
  - .env(환경변수)
- [라우팅 파일] Routing Files  
  - layout, page, loading, error
- [중첩 라우팅] Nested routes
  - folder(라우팅 세그멘트)
  - folder/folder (중첩된 라우팅 세그멘트)  
- [동적 라우팅] Dynamic routes
  - [foler ] - 동적 라우팅 세그멘트
  - [..foler ] - 포괄 라우팅 세그멘트
  - [..folder ] - 선택 가능한 포괄적 라우트 세그멘트
- [라우팅 그룹 및 비공개 폴더] Route Groups and private folders
  - [folder ] - 라우팅에 영향을 주지않고 경로를 그룹화
  - folder - 옵션 폴더 및 모든 자식 세그멘트를 라우팅에서 제외합니다.
- [병렬 및 차단 라우팅]  Parallel and Intercepted Routes
  - ()folder - 한 레벨위에서 가로채기
- [메타데이터 파일 규칙] Metadata file conventions
  - favicon파일  - jco
  - icon      - jco .jpg .jpeg .png
  - apple-icon  - jpg .png Apple 앱아이콘 파일
- Open Graph and Twitter images
  - twitter-image 트위터 이미지 파일 - jpg,jpeg
- SEO  
  - sitemap.xml/js : 사이트맵
  - robot 로봇파일 - .txt
---

### 2. Organizing your project(프로젝트 구성하기)
- Next.js는 프로젝트 파일을 어떻게 구성하고 어디에 배치할지에 대한 제약이 없습니다.
- 하지만 프로젝트 구성에 도움이 되는 몇 가지 기능을 제공합니다. [component의 계층 구조 ] Component hierarchy
- 특수 파일에 정의된 component는 특정 계층 구조로 렌더링 됩니다.
- layout.js
- template.js
- errorjs(React 오류 경계)
- loading js(리액트 서스펜스 경계)
- not-found js(React 오류 경계)
- page.js 또는 중첩 layoutjs
         
- layout과 template의 차이
  - 마스터 텍스트 스타일 편집
  - layout.tsx 경로별 공유 레이아웃/ 상태유지(정적)/ 네비게이션,사이드바, 공통 레이아웃
  - template.tsx 매번 새 인스턴스 생성/ 상태초기화(동적)/ 페이지별로 초기화 필요

- component는 중첩된 라우팅에서 재귀적으로 렌더링됩니다.
- 즉, 라우팅 세그먼트의 component는 부모 세그먼트의 component 내부에 중첩됩니다  
- 세그먼트(Segment)는 나뉘어진 각 부분, 분할된 부분, 또는 특정 기준에 따라 분류된 그룹을 의미    
- [코로케이션 ] Colocation - 파일 및 폴더를 기능별로 그룹화하여 프로젝트의 구조를 명확하게 정의
  - app 디렉토리에서 중첩된 폴더는 라우팅 구조를 정의합니다.
  - 각 폴더는 URL 경로의 해당 세그먼트에 맵핑되는 라우팅 세그먼트를 나타냅니다.
  - 그러나 라우팅 구조가 폴더를 통해 정의되더라도 라우팅 세그먼트에 page.js 또는 routejs 파일이 추가 될 때까지 라우팅 폴더에는 공개적으로 액세스할 수 없습니다.
  - 즉, 프로젝트 파일을 app 디렉토리의 라우팅 세그먼트 내에 안전하게 배치하여 실수로 라우팅 되지 않도록 할 수 있습니다.
  - 프로젝트 파일을 app 폴더에 함께 저장할 수는 있지만 꼭 그럴 필요는 없습니다. 원한다면 app 디렉터리 외부에 보관할 수도 있습니다.

   
- [비공개 폴더] Private folders
  - 비공개 폴더는 폴더 앞에 밑줄을 붙여서 만들 수 있습니다. folderName
  - 이 것은 해당 폴더가 비공개로 구현되는 세부 사항이기 때문에 라우팅 시스템에서 고려되어서는 안 되며, 따라서 해당 폴더와 모든 하위 폴더가 라우팅에서 제외됨을 나타냅니다.
- app 디렉토리의 파일은 기본적으로 안전하게 코로케이션 될 수 있으므로, 코로케이션에 비공개 폴더는 불필요 합니다. 하지만 다음과 같은 경우에는 유용할 수 있습니다.
- UI 로직과 라우팅 로직을 분리합니다.
- 프로젝트와 Nextjs 생태계 전반에서 내부 파일을 일관되게 구성합니다.
- 코드 편집기에서 파일을 정렬하고 그룹화합니다.
- 향후 Next.js 파일 규칙과 관련된 잠재적인 이름 충돌을 방지합니다.  

- [라우팅 그룹] Route groups

  - 폴더를 괄호로 묶어 라우팅 그룹을 만들 수 있습니다.(folderName)
  - 이 것은 해당 폴더가 구성 목적으로 사용되는 것을 의미하며, 라우터의 URL 경로에 포함되지 않아야 합니다.

  - 라우팅 그룹은 다음과 같은 경우에 유용합니다.
  - 사이트 섹션, 목적 또는 팀별로 라우트를 구성합니다. 예: 마케팅 페이지, 관리 페이지 등.
  - 동일한 라우팅 세그먼트 수준에서 중첩 레이아웃 활성화:  공통 서그먼트 안에 여러 개의 루트 레이아웃을 포함하여 여러 개의 중첩 레이아웃 만들기,
공통 세그먼트의 라우팅 하위 그룹에 레이아웃 추가
   
- [src 디렉토리]
  - Next.js는 애플리케이션 코드(app 포함)를 옵션으로 선택하는 src폴더 내에 저장할 수 있도록 지원합니다.
  - 이를 통해 애플리케이션 코드와 주로 프로젝트 루트에 위치하는 프로젝트 설정 파일을 분리할 수 있습니다.   \
---
### 3. 예제 (Examples)
- 핵심 요점은 자신과 팀에 적합한 전략을 선택하고, 프로젝트 전반에 걸쳐 일관성을 유지하는 것입니다.
알아두면 좋습니다.
- 아래 예제에서는 components와 lib 폴더를 일반화된 플레이스 홀더로 사용하고 있습니다.
- 이름 지정은 프레임워크에서 특별한 의미가 있는 것은 아니며, 프로젝트에서 Ul, utils. books, styles 등과 같은 다른 폴더명을 사용할 수 있습니다.
### 프로젝트 생성
- 예제를 학습하기 전에 Nextjs 프로젝트를 생성합니다. npx create-next-app@latest
- 명령을 실행하면 다음과 같은 8개의 선택 항목이 나옵니다.
- 선택 항목이지만 모두 yes를 선택해서 프로젝트를 생성합니다
  1. 프로젝트 이름을 입력합니다. 2~4. TypeScript. ESLint Tailwind를 사용할지 선택합니다.
  2. src/ 디렉토리를 사용할지 선택합니다.
  3. App Router를 사용할지 선택합니다.
  4. importalias를 사용할지 선택합니다.
  5. alias 문자를 지정합니다. 기본은 @/* 입니다.
  6. 프로젝트를 생성한 후 실행 명령은 다음과 같습니다. npm run dev
### 서버 실행 전후
- next 디렉토리가 생성됩니다.
- Nextjs에서 next 디렉토리는 빌드 아웃풋과 실행에 필요한 캐시·중간 산출물을 저장하는 폴더입니다.
- 즉, next dev, next build, next start를 실행할 때 내부적으로 필요한 작업 디렉토리 입니다.
   
- 모든 프로젝트 파일을 src/ 디렉토리에서 관리합니다.
### 3-1. Store project files outside of app
- [프로젝트 파일을 app 외부에 저장]
- 이 전략은 모든 애플리케이션 코드를 프로젝트 루트의 공유 폴더에 저장 하고, 해당 app 디 렉토리는 라우팅 목적으로만 사용합니다.
      
   
### 3-3. Split project files by feature or route
- [기능 또는 라우팅 별로 프로젝트 파일 분할]
- 이 전략은 전역적으로 공유되는 애플리케이션 코드를 app 디렉토리 루트에 저장하고, 보다 구체적인 애플리케이션 코드를 이를 사용하는 라우팅 세그먼트로 분할합니다.
### 3-4. Organize routes without affecting the URL path
- [URL 경로에 영향을 주지 않고 라우트를 구성]
- URL에 영향을 주지 않고 라우트를 구성하려면, 관련 라우트를 함께 보관할 그룹을 만들어 줍니다. 괄호 안에 폴더는 URL에서 생략
### 3.5 Opting specific segments into a layout
- [레이아웃에 특정 세그먼트 선택]
  - 특정 라우트를 레이아웃에 포함하려면 새 라우팅 그룹(예:(shop))을 만들고, 동일한 레이아웃을 공유하는 라우팅 폴더들을 이 그룹으로 이동합니다. (예: account 및 cart)
  - 그룹 외부 라우팅 폴더에는 레이아웃을 공유하지 않습니다. (예: checkout)
### 3-6. Opting for loading skeletons on a specific route
- [특정 라우트에 스켈레톤 로딩을 적재하도록 선택]
  - loading.js 파일을 통해 특정 라우트 폴더에 로딩 스켈레톤을 적용하려면, 새 라우팅 그룹 (예: /(overview))을 만든 다음 해당 라우팅 그룹 내부로 loading.tsx를 이동합니다.
  - 이제 해당 loading.tsx 파일은 dashboard 페이지에만 적용됩니다. → URL 경로 구조에 영향을 주지 않고 모든 dashboard 페이지 대신 overview 페이지로 이동합니다.
  - #loading skeletons (스켈톤 로딩) 콘텐츠가 로드되기 전에, 마치 뼈대(skeleton)처럼 콘텐츠가 표시될 위치에 회색이나 반투명한 상자 또는 영역을 표시하여, 사용자에게 로딩 중임을 시각적으로 안내하고, 로딩 완료 후의 화면 구성을 미리 짐작할 수 있도록 도와주는 역할을 하는 일종의 와이어 프레임.
### 3-7 Creating multiple root layouts
- [여러 개의 루트 레이아웃 만들기]
- 여러 개의 루트 레이아웃을 만들려면 최상위 layout.js 파일을 제거하고, 각 라우팅 그룹 내에 layout.js 파일을 추가합니다.
- 이것은 완전히 다른 UI 또는 UX를 갖는 섹션으로 애플리케이션을 분할하는데 유용합니다.
- 각 루트 레이아웃에 및 태그를 추가해야 합니다.
- 위의 예에서 (marketing)과 (shop)은 둘 다 자체 루트 레이아웃을 갖습니다.  
## 2025-09-03 2주차 수업내용

### Installation
- (IDE플러그인)  Nextjs에는 사용자 정의 TypeScript 플러그인과 유형 검사기가 포함되어 있습니다. 
-  VS Code와 다른 코드 편집기에서 고급 유형 검사 및 자동 완성에 사용할 수 있습니다.
- #다음 작업을 하기 전에 TypeScript reference를 참고해서, next.config.js를 먼저 작성합니다.
    
- VS Code에서 플러그인을 활성화하는 방법은 다음과 같습니다.

    - 명령 팔레트 열기 (Ctrl/36+Shift+P)
    - "TypeScript: TypeScript 버전 선택 검색
    - "Use Workspace Version 선택
- ESLint 설정    
    - Nextjs에는 ESLint가 내장되어 있습니다.
    - create-next-app 명령을 사용하여 새 프로젝트를 생성하면 필요한 패키지를 자동으로 설치 하고, 적절한 설정을 구성합니다.
    - 기존 프로젝트에 ESLint를 수동으로 추가하려면 package.json에 next lint 스크립트를 다음과 같이 추가합니다.
```    {
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

- import 및 모듈의 절대 경로 별칭 설정
    - Next.js에는 tsconfig.json 및 jsconfig.json 파일의 "paths" 및 "baseUrl" 옵션에 대한 지원을 내장하고 있습니다.
    - 이 옵션을 사용하면 프로젝트 디렉터리를 절대 경로로 별칭 하여 모듈을 더 쉽고 깔끔하게 가져올 수 있습니다.
---
### 자동 생성되는 항목
- package.json 파일에 scripts 자동 추가/ public 디렉토리
- TypeScript 사용(선택): tsconfig.json 파일 생성
- Eslint 설정 (선택): eslintrc.json 대신 eslint.config.mjs 파일 생성
- Tailwind CSS 사용 (선택)
- src 디렉토리 사용 (선택)
- App Router(선택), app/layout.tsx 파일 및 app/page.tsx
- Turbopack 사용(선택)
- import alias 사용 (선택): tsconfig.json에 "paths" 자동 생성.
- 수동으로 프로젝트를 생성할 때 추가적으로 해야 하는 작업을 자동으로 처리해 줍니다.
### Core Web Vitals
- LCP(Largest Contentful Paint) : 뷰포트 내에서 가장 큰 페이지 요소(큰 텍스트 블록, 이미 지 또는 비디오)를 표시하는 데 걸리는 시간.
- 뷰포트: 웹페이지 사용자가 별도의 스크롤 동작 없이 볼 수 있는 영역.
- FID(First Input Delay): 사용자가 웹페이지와 상호작용을 시도하는 첫 번째 순간부터 웹페 이지가 응답하는 시간.
- CLS(Cumulative Layout Shift) : 방문자에게 콘텐츠가 얼마나 불안정한 지 측정한 값입니다.
- 페이지에서 갑자기 발생하는 레이아웃의 변경이 얼마나 일어나는지를 측정합니다. 즉, 레이아웃 이동(layout shift) 빈도를 측정합니다.
---
### 실습에 사용할 프로젝트를 생성합니다.
- 공식 문서에는 기본 패키지 관리자를 pnpm을 사용합니다.
- 원하는 패키지 관리자 탭을 클릭하면 명령을 확인할 수 있습니다.
- pnpm과 관련한 내용은 뒤에서 설명합니다. npx create-next-app@latest
- 다음 명령으로 프로젝트를 생성합니다.
- 명령을 실행하면 다음과 같은 8개의 선택 항목이 나옵니다.
1. 프로젝트 이름을 입력합니다. 2~4. Typescript, ESLint, Tailwind를 사용할지 선택합니다.
2. src/ 디렉토리를 사용할지 선택합니다.
3. App Router를 사용할지 선택합니다.
4. import alias를 사용할지 선택합니다.
5. alias 문자를 지정합니다. 기본은 @/* 입니다.
  
### src/ 디렉토리 선택
- 모든 프로젝트 파일을 src/ 프로젝트에서 관리합니다.
  
### alias 문자 및 경로
- alias 문자를 선택하면 tsconfig.json에 등록됩니다.
- 기본값은 선택하면/src/들 @으로 대신합니다.
- 즉/src/*는 @/*로 사용할 수 있습니다. 생성된 프로젝트의 서버의 실행: $ npm run dev
---
### pnpm 
- pnpm은 Performant(효율적인) NPM의 약자로 고성능 Node 패키지 매니저입니다.
- npm, yarn과 같은 목적의 패키지 관리자이지만, 디스크 공간 낭비, 복잡한 의존성 관리, 느린 설치 속도 문제 개선을 위해 개발되었습니다.
  
- 대표적인 특징은 다음과 같습니다.
1. 하드 링크(Hard Link) 기반의 효율적인 저장 공간 사용 패키지를 한 번만 설치하여 글로벌 저장소에 저장하고, 각 프로젝트의 node_modules 디 렉토리에는 설치된 패키지에 대한 하드 링크(또는 심볼릭 링크)가 생성됩니다.
2. 빠른 패키지 설치 속도(Performant) : 이미 설치된 패키지는 다시 다운로드하지 않고 재사 용하므로, 초기 설치뿐만 아니라 종속성 설치 및 업데이트 할 때도 더 빠른 속도를 경험할 수 있습니다.
3. 엄격하고 효율적인 종속성 관리
4. 다른 패키지 매니저의 비효율성 개선
---
### pnpm 설치 및 기본 명령어
- pnpm 글로벌 설치: $ npm install -g pnpm
- [많이 사용하는 명령어]
  
- Node_module 설치(clone 한 경우): $ pnpm install
- 새로운 패키지 설치 : $ pnpm add [package]
- 패키지 제거: $ pnpm remove [package]
- 종속성을 최신 버전으로 업데이트: $ pnpm update
- 프로젝트에 설치된 모든 패키지를 표시: $ pnpm list
### pnpm으로 Next.js 프로젝트 생성
- $ pnpm create next-app@latest
- npm의 npx 대신 pnpm create을 사용합니다.
- next-app 명령이 실제로 실행되는 것은 create-next-app입니다. 블로그 등에서 pnpm도 - create-next-app 이라고 소개하는 경우가 있지만 추천하지는 않습니다.
- $ cd my-app
서버 실행: $ pnpm start
---
### pnpm으로 React 프로젝트 생성
- Next.js에 비해서 react는 pnpm 도입에 소극적입니다.
- 따라서 다음 명령 중 1번 명령을 실행해도 npx create-react-app my-app와 동일하게 생성 됩니다.
- 따라서 무엇으로 프로젝트를 생성하던 node_modules과 package-lock.json을 삭제하고, 4 번 명령으로 node_modules을 다시 설치해야 합니다.
- $ pnpm create react-app my-app
- $ cd my-app
- $ rm -rf node_modules package-lock.json
- $ pnpm install
- 서버 실행: $ pnpm dev
---
### Hard link vs. Symbolic link(Soft link)
- pnpm의 특징 중에 하드 링크를 사용해서 디스크 공간을 효율적으로 사용할 수 있다고 합니다. 탐색기에서 npm과 pnpm 프로젝트의 node module의 용량을 확인해 보세요.
- "왜 효율적이라 한 것일까요?
  
### 하드 링크(Hard link)
- 우리가 "파일"이라고 부르는 것은 두 부분으로 나뉘어 있습니다.
    1. Directory Entry: 파일 이름과 해당 inode 번호를 매핑 정보가 있는 특수한 파일.
    2. inode: 파일 또는 디렉토리에 대한 모든 메타데이터를 저장하는 구조체. (권한, 소유자, 크기, 데이터 블록 위치 등)
- 하드링크를 생성하면 디렉토리 엔트리에 매핑 정보가 추가 되어 동일한 inode를 가리키게 됩니다.
- 따라서 원본과 하드링크는 완전히 동일한 파일입니다.
- 원본과 사본(copy)의 개념이 아닙니다.
### Hard link vs. Symbolic link(Soft link)
- 디렉토리 엔트리에 있는 원본과 하드링크는 같은 inode를 참조하므로 데이터 블록을 100% 공유합니다.
- 따라서 원본이나 하드링크 중에서 하나만 삭제하면 디렌토리 엔트리에서 이름만 삭제되는 것이라서 link count가 0이 되지 않는 한 데이터는 남아 있습니다.
- pnpm store에 저장된 패키지나, node_modules/.pnpm에 저장된 패키지나 동일한 파일을 참조하고 있습니다.
- 그런데 탐색기에서 node_modules의 속성을 보면 npm의 경우와 디스크용량이 같아 보입니다.
- 이 것은 하드링크는 겉으로는 복사한 것처럼 보이는 특징을 가지고 있기 때문입니다.
- pnpm으로 패키지를 설치하면 전역 store에 1번만 저장합니다. (C:\Users<user>\AppData\Local\pnpm-store\)
- 따라서 실제 디스크 사용량은 중복되지 않습니다.
  
### 심볼릭 링크 (소프트 링크)
- inode를 공유하지 않고 경로 문자열을 저장해 두는 특수 파일입니다.
- 따라서 심볼릭 링크를 열면 내부에 적힌 "경로"를 따라가서 원본 파일을 찾습니다.
- 원본이 삭제되면 심볼릭 링크는 끊어진 경로가 되므로 더 이상 사용할 수 없습니다.
- 윈도우의 바로 가기 파일과 비슷하게 생각할 수 있습니다.
---