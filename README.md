# 202130115 박건일
## 2025-10-20 10주차 수업내용
### CSS 수정
```
html[data-theme='light'] {
  background-color: white;
  color: black;
}

html[data-theme='dark'] {
  background-color: black;
  color: white;
}
```
### Context provider의 실행 과정 리뷰
- 1.Context 생성 (theme-provider.tsx)
  - createContext(...)로 Context 객체를 만듭니다.
    - : 초기값(default value)은 provider가 없을 때 사용할 fallback입니다.
    - (여기선 theme: 'light', toggleTheme: () => {}).
  - 이 파일 내부에서 ThemeProvider 컴포넌트를 정의합니다.
    - useState로 theme 상태를 관리(예: 'light' | 'dark').
    - toggleTheme 함수는 setTheme을 호출해 상태를 변경. useEffect로 상태 변경 시 document.documentElement.dataset.theme에 값을 기록. (전역 스타일 적용 용도)
    - ThemeContext.Provider에 value={{ theme, toggleTheme }}를 넣고 children을 감싸줍니다.
- 2.Provider 배치 (RootLayout)    
  - RootLayout에서 ThemeProvider로 루트(또는 필요한 하위 트리)를 감싸줍니다.
  - 하위에 렌더링 되는 모든 컴포넌트들이 ThemeContext에 접근
- 3.Consumer 사용 (theme-status.tsx)  
  - ThemeStatus는 'use client'로 클라이언트 컴포넌트이며, useContext(ThemeContext)를 사용해 value를 읽어 들입니다.
  - UI에서는 theme 값을 표시하고, 버튼 클릭 시 toggleTheme()을 호출 합니다.

---

### Context provider의 동작 순서
- 동작 순서(버튼 클릭 시 호출)
1. 사용자가 ThemeStatus의 버튼 클릭.
2. toggleTheme() 호출. (ThemeStatus가 Provider의 함수를 호출)
3. rovider 내부의 setTheme이 실행되어 theme 상태가 변경.
4. 상태 변경으로 Provider와 그 하위 컴포넌트들이 리렌더링되어 theme 값이 최신으로 반영됨.
5. useEffect가 실행되어 document.documentElement.dataset.theme 값도 갱신. (글로벌 스타일 반영)

### Context provider 순서도 형식
- RootLayout 렌더
- ThemeProvider 생성 (useState: theme)
- Provider value 제공 -> children 렌더
- ThemeStatus(useContext) 읽음
- 사용자 클릭 -> toggleTheme() 호출
- setTheme(newTheme) 실행 (state 변경)
- useEffect 실행 -> document.dataset.theme 업데이트
- Provider & Consumer 리렌더 -> UI 갱신

---

### gallery.tsx 외부(서드 파티) component 실습
- gallery.tsx를 문서 처럼 작성하면 다음과 같은 오류가 발생
-> 먼저 모듈을 설치하면 오류를 해결.
  - Cannot find module 'acme-carousel' or its corresponding type declarations. ts(2307)
- 하지만 모듈을 설치한 후에도 다시 Carousel 컴포넌트를 사용할 때 오류가 발생합니다.
  - Property 'items' is missing in type '{}' but required in type 'CarouselProps'. ts(2741)
- 이 오류는 Carousel 컴포넌트의 타입 정의(CarouselProps)에 필수 prop인 items가 정의되어 있어서, 를 props 없이 렌더링해서 발생하는 타입 에러입니다.
- items에서 사용할 이미지는 'https://picsum.photos/'의 더미를 사용합니다.

### app/carousel/page.tsx
```
import Gallery from "@/components/gallery";

export default function CarouselPage() {
   return (
     <div>
       <h1>Carousel Page</h1>
       <Gallery />
     </div>
   );
}
```
- 오류 수정후에도 동작하지만, 첫 페이지에 모두 출력되어 정상 동작이라 할 수는 없음.
- style이 적용되지 않아서이다.
- style은 node_modules/acme-carousel/dist/styles.css 경로에 있지만, 이렇게 특정 모듈에 있는 스타일을 사용할 경우 global.css에 import해서 사용하는 것이 일반적이다.
```
@import 'acme-carousel/dist/styles.css';
```
-> 하지만 이번 경우에는 acme-carousel의 특성 때문에 오류가 발생

- 이런 경우라면 스타일을 components/에 복사해서 사용합니다. 위치는 다른 곳이라도 상관 없음.
-> gallery.tsx에 import './styles.css' 를 추가

---

### acme-carousel의 주요 옵션 및 기능
- 자동 전환(autoplay)
- 반응형(responsive)
- 지원터치/스와이프 제어(touch/swipe)
- 가상화(virtualization) 및 지연 로딩(lazy loading)
- 접근성(accessibility) 기능
- 고급 애니메이션 및 3D 효과 등
---

- { Carousel, Slide } 처럼 import하면 다음과 같은 오류가 발생
   
   ->따라서 default export해줍니다
   ```
   import { useState } from 'react'
  import { Carousel } from 'acme-carousel'
  import Silde from 'acme-carousel' 
  ```
### [ 라이브러리 작성자를 위한 조언 ]
- component 라이브러리를 빌드하는 경우, client 전용 기능에 의존하는 진입점에 "use client" 지시문을 추가합니다.
- 이렇게 하면 사용자가 래퍼를 만들 필요 없이 component를 server component로 가져올 수 있습니다.
- 일부 번들러는 "use client" 지시어를 제거할 수 있습니다.
- React Wrap Balancer 및 Vercel Analytics 저장소에서 "use client" 지시어를 포함하도록 esbuild를 구성하는 방법의 예를 확인할 수 있습니다.

---
- 해당 client-only(클라이언트 전용) 패키지는 클라이언트 전용 로직이 포함된 모듈을 표시하는 데 사용할 수 있습니다. (예 window 객체에 액세스하는 코드)
- Next.js에서 server-only 또는 client-only를 설치하는 것은 선택 사항입니다.
-그러나 lint 규칙에서 불필요한 종속성을 표시하는 경우, 문제를 방지하기 위해 해당 종속성을 설치할 수 있습니다.

### 환경 변수 노출 예방
- JavaScript 모듈은 server 및 client component 모듈 간에 공유될 수 있습니다.
- 이 말의 의미는 실수로 server 전용 코드를 client로 가져올 수도 있습니다.


* Next.js에서는 NEXT_PUBLIC_ 접두사가 붙은 환경 변수만 client 번들에 포함됩니다.
- 접두사가 붙지 않은 변수의 경우 Next.js에서 빈 문자열로 대체됩니다.
- 결과적으로 client에서 getData()를 가져와서 실행할 수는 있지만 예상대로 작동하지는 않습니다.
- client component에서 실수로 사용되는 것을 방지하려면 server-only - package(서버 전용 패키지)를 사용할 수 있습니다.
---


### Fetching Data (데이터 가져오기)
1-1. 서버 컴포넌트

- 서버 컴포넌트에서 데이터를 가져올 수 있는 방법은 다음과 같습니다.
  - fetch API
  - ORM 또는 데이터베이스
- [ fetch API 사용 ]
  - 데이터를 가져오려면 fetch API를 사용하여 컴포넌트를 비동기식 함수로 변환하고 다음 fetch 호출을 기다립니다. 


- [ ORM 또는 데이터베이스를 사용 ]

- 서버 컴포넌트는 서버에서 렌더링 되기 때문에 ORM이나 데이터베이스
클라이언트를 사용해서 안전하게 데이터베이스 쿼리를 실행할 수 있습니다.
- 컴포넌트를 비동기 함수로 변환하고 호출을 기다리면 됩니다.
- **ORM(Object-Relational Mapping)**은 객체 지향 프로그래밍 언어와 관계형 데이터베이스 간의 데이터를 자동으로 변환해주는 기술
---
### 1. 데이터 가져오기(Fetching Data)
- 1-2. 클라이언트 컴포넌트

- 클라이언트 컴포넌트에서 데이터를 가져오는 방법에는 두 가지가 있습니다.
  - React의 use Hook
  - SWR 또는 React 쿼리와 같은 통신 라이브러리
- [ use Hook을 사용한 스트리밍 데이터 ]

  - React의 use Hook을 사용해서 서버에서 클라이언트로 데이터를 스트리밍합니다.
  - 서버 컴포넌트에서 데이터를 먼저 fetch하고, 그 결과(promise)를 클라이언트 컴포넌트에 prop으로 전달합니다.
  - 서버 컴포넌트는 async가 가능하기 때문에 await fetch()도 사용 가능합니다.
  - 하지만 클라이언트 컴포넌트에서는 async가 불가능하기 때문에 직접 fetch가 불가능 합니다. (렌더링 중 fetch 금지)
  - 이런 이유 때문에 서버에서 fetch한 결과를 prop으로 넘기고, 클라이언트에서는 use(promise)를 써서 데이터를 가져옵니다.
---
### React의 use Hook을 사용한 실습
- Don't await the data fetching function. 주석은 fetch함수에 await을 사용하지 말라는 의미입니다.
- 가장 간단히 할 수 있는 방법은 getPost()함수를 사용하지 않고, 그 자리에 fetch함수를 그대로 사용하는 것입니다.
## 2025-10-22 9주차 수업내용
### server 및 client component 인터리빙 
- 인터리빙(Interleaving)은 일반적으로 여러 데이터 블록이나 비트를 섞어서 전송하거나 처리하여 오류 발생 시 영향을 최소화하는 기술입니다.
- 특히 데이터 통신에서 버스트 오류(연속적인 오류)를 줄이고 오류 정정 코드를 효과적으로 사용하기 위해 사용됩니다.
- 프로그래밍이나 문서에서는 sever 컴포넌트와 client 컴포넌트가 섞여서(interleaved) 동작하는 것을 의미 합니다.
- server component를 client component에 prop을 통해 전달할 수 있습니다.
- 이를 통해 client component 내에서 server에서 렌더링된 UI를 시각적으로 중첩할 수 있습니다.
- < ClientComponent>에 공간(slot)을 만들고 children을 끼워넣는 패턴이 일반적입니다.
   
- 예를 들어, client의 state를 사용하여 표시 여부를 전환(toggle)하는 
< Modal> component 안에 server에서 데이터를 가져오는 < Cart> component가 있습니다.
* 그 다음 부모 server component(예: < Page>) 안에 < Modal>의 자식으로 
< Cart>를 전달할 수 있습니다.
* Modal을 불러오는 곳이 Page이기 때문에 Page가 parent가 되는 것입니다.   

---
- 실습을 하기 전에 문서의 설명을 정리하면

- -> 클라이언트 컴포넌트가 껍데기 역할을 하고, 서버 컴포넌트가 그 안의 내용(children)으로 들어오는 구조(패턴)를 설명하는 것입니다.

*** Next.js에서는 기본적으로
- Server Component -> 서버에서 렌더링 됨.(데이터 패칭 가능)
- Client Component -> 브라우저에서 렌더링 됨.(상호작용 가능)

### 즉, 서버 컴포넌트 안에는 클라이언트 컴포넌트를 넣을 수 있지만, 그 반대는 직접적으로는 불가능합니다.

- 그래서 "interleaving"이란 아이디어가 나오게 되는 것입니다.
- 클라이언트 컴포넌트 안에 생성한 children 슬롯에 서버 컴포넌트를 '끼워 넣는' 방식으로 둘을 섞어서 사용하자는 아이디어 입니다. 

---
### 동작 과정을 살펴보면
- Next.js는 먼저 ServerContent를 서버에서 렌더링 -> HTML로 변환
- 이 HTML을 ClientLayout의 {children} 자리에 “끼워 넣음”
- 그 다음 클라이언트에서는 ClientLayout만 hydration(즉, JS 연결)
- 결국 서버 데이터는 이미 들어와 있고, 버튼이나 이벤트 등은 클라이언트 컴포넌트에서 처리가 가능해 집니다. -> 이렇게 둘이 섞여(interleaved) 있는 패턴이 되는 것입니다.

---
### Context란 무엇인가?
- 다음 절은 3-5. Context provider 입니다.
- React에서도 나온 개념이지만, 문서를 보기 전에 먼저 context에 대해서 알아보겠습니다.
- Next.js에서 Context는 React의 Context API를 사용하여 컴포넌트 사이에 데이터를 공유하는 매커니즘을 의미합니다.
- 즉, 부모 컴포넌트에서 자식 컴포넌트로 직접 props를 전달하지 않고도, 특정 데이터를 필요한 컴포넌트에서 쓸 수 있도록 도와줍니다.

### [ Context의 주요 특징 ]
- #전역 상태 관리
  - Context를 사용하면 애플리케이션 전체에서 공유해야 하는 데이터를 중앙 집중적으로 관리할 수 있습니다. (예: 사용자 정보, 테마 설정 등)
- #props drilling 문제 해결
  - 컴포넌트 트리가 깊어질수록 props를 계속 전달해야 하는 번거로움을 줄여줍니다.
  - Context를 사용하면 필요한 컴포G넌트에서 바로 데이터를 가져올 수 있으므로, 코드의 가독성을 높이고 유지 보수를 용이하게 합니다.
- #React 컴포넌트에서 사용
  - Context는 React에서 제공하는 기능이기 때문에, Next.js에서도 React 컴포넌트를 사용하여 구현합니다.

 
- #MyContext는 Context객체를 나나태고, MyContext.Provider는 MyComponent에 데이터 제공
- #'useContext(MyContext)'를 통해 MyComponent는 "Hello from Context"값을 가져와서 렌더링

---
### 3-5. Context provider (컨텍스트 제공자)

* React Context는 일반적으로 아래 테마처럼 전역 상태를 공유하는데 사용됩니다.
* 그러나 server component에서는 React Context가 지원되지 않습니다.
* Context를 사용하려면 children을 허용하는 client component로 만들어야 합니다.
* 그 다음 layout 가져옴.

- 알아두면 좋은 정보
  * Provider component를 트리에서 가능한 한 깊숙이 렌더링해야 합니다.
  * ThemeProvider가 전체 < html> 문서 대신 {children}만 래핑하는 방식을 주목하세요.
  * 이렇게 하면 Next.js가 server component의 정적 부분을 더 쉽게 최적화할 수 있습니다.
---
### Context 생성 코드 설명 (theme-provider.tsx) - client 컴포넌트
- context를 사용하면 props를 사용하지 않고도 전역적으로 사용할 theme, 언어 설정, 로그인 정보 등을 하위 컴포넌트에 전달할 수 있습니다.
- createContext()는 React 컴포넌트 트리 전체에 값을 공유할 수 있도록 하는 역할을 합니다.
- createContext(...)로 Context 객체를 생성하여, Theme state를 공유 합니다. Line5 ~

- <{...}> 부분은 타입 부분입니다. Line6, 7
  - theme: 'light' 또는 'dark' 중 하나이고,
  - toggleTheme: 아무 인자도 받지 않고, 반환값도 없는 함수라는 것을 의미합니다.
- 기본값(default value)은 provider가 없을 때 사용할 fallback value입니다. Line9, 10
  - React에서는 createContext()를 호출할 때 기본값이 반드시 있어야 합니다.
  - 보통은 실제 동작하지 않는 빈 함수(() => {})를 기본으로 넣어둡니다.
  - 실제 동작은 ThemeProvider 컴포넌트에서 설정하게 됩니다.
  - theme: 'light', toggleTheme: () => {}

- 다음 파일 내부에서 ThemeProvider 컴포넌트를 정의합니다. Line13 ~
- useState로 theme 상태를 관리합니다. Line18 : line6에서도 나왔던 <'light' | 'dark'>은 TypeScript의 **“유니온 타입(Union Type)”**이며, 초기값은 light라는 것을 의미 합니다.

```const [theme, setTheme] = useState<'light' | 'dark'>('light')```

- TypeScript의 유니온 타입(Union Type)이란?
- '|'(파이프)로 여러 타입을 연결해서 “이 값은 각각의 타입 중 하나가 될 수 있다”는 것을 지정 합니다.
- 코드에서 문자열 리터럴 유니온 타입의 경우, state 값으로 'light' 또는 'dark'만 설정할 수 있어 코드 자동완성과 타입 안정성이 향상 됩니다.    
---
- #다음은 useEffect Hook을 사용해서 테마(Theme)를 HTML 문서 전체에 적용하는 아주 전형적인 패턴입니다. Line20~24
- useEffect Hook은 컴포넌트가 렌더링된 후 부수 효과(side effect)를 실행하기 위한 함수입니다.
``` useEffect(() => {
if (typeof window !== 'undefined') {
document.documentElement.dataset.theme = theme
 }
}, [theme])
```
- #if문의 조건절은 “현재 실행 환경이 브라우저인지 확인”하는 부분입니다. Line21
  - 서버 사이드 렌더링(SSR) 단계에서는 window 객체가 없습니다.
  - 만약 서버에서 window를 참조하면 오류가 발생합니다. (ReferenceError: window is not defined)
- -> 따라서 typeof window !== 'undefined'는 “클라이언트(브라우저) 환경일 때만 실행하라”는 뜻입니다.
---

- #line22는 다음과 같은 의미입니다.
  - document.documentElement는 HTML 문서의 < html> 요소를 가리킵니다.
  - .dataset.theme = theme 은 < html> 태그에 data-theme 속성을 추가하는 코드입니다.
  - -> 만일 theme state 값이 “dark”라면 다음과 같이 HTML을 반환합니다. < html data-theme="dark">

- #useEffect의 두 번째 인자 [ theme] 는 의존성 배열(dependency array) 입니다. line24
  - theme 값이 변경될 때마다 useEffect 안의 코드가 다시 실행됩니다.
  - 즉, 테마가 바뀔 때마다 HTML의 data-theme 속성도 업데이트됩니다.

- #이 방법을 사용할 경우 CSS에서 속성을 조건으로 스타일을 다르게 지정할 수 있습니다.
---
- 여기서 html[ data-theme='light']는 **속성 선택자(Attribute Selector)**로 CSS에서 클래스(.class)나 아이디(#id)처럼 요소를 선택하는 또 다른 방법 입니다.
- 속성 선택자는 class를 여러 개 붙이는 경우보다 스타일 충돌을 줄일 수 있습니다.
- theme state를 3항 연산자를 사용해서 토글하여 setTheme함수를 이용해서, toggleTheme 에 저장합니다. line26
- ThemeContext.Provider는 무엇일까요?
- createContext 함수를 호출하면, React는 Context 객체 하나를 만들어줍니다.
- 이 객체 안에는 여러가지 속성이 있는데, 대표적인 것이 다음 두 가지가 입니다.
- ThemeContext.Provider, ThemeContext.Consumer입니다.
- 즉, Provider는 createContext()를 호출하면 자동으로 생성되는 React 컴포넌트입니다. line28
- 따라서 ThemeContext.Provider 컴포넌트에 현재 theme state와 함께 toggleTheme 함수도 함께 props로 전달합니다. line28
- 즉, 하위 컴포넌트에서는 현재 theme state를 알 수 없기 때문에 버튼 쪽으로 toggleTheme 함수와 함께 theme state를 함께 전달하는 것입니다.

---
### 테마 토글버튼 코드 설명 (theme-status.tsx) - client 컴포넌트
- ThemeContext를 사용하기 위해서 theme-provider를 import합니다. line4
- useContext 함수를 이용해서 ThemeContext에서 전달 받은 theme와 toggleTheme를 추출 합니다. line7
- 클릭 이벤트가 발생하면 추출된 toggleTheme함수를 실행되고, 버튼 내의 삼항 연산자를 사용하여 버튼의 모양을 교체해 줍니다. line10 ~ line11

---

## 2025-10-17 7주차 수업내용
### server 및 client component를 언제 사용하나요?
- client 환경과 sever 환경은 서로 다른 기능 갖음.
- 각각의 환경에서 필요한 로직을 실행할 수 있음.
- 다음과 같은 항목이 필요할 경우 client component 사용
  - state 및 event hadler, 예. onClick, onChange
  - Lifecycle logic, 예. useEffect
  - 브라우저 전용 API, 예. localStroage, window, Navigator, gelocation 등
  - 사용자 정의 Hock
- 다음은 server component 사용
  - 서버의 데이터베이스 혹은 API에서 data를 가져오는 경우 사용
  - API Key, token 및 기타 보안 데이터 Client에 노출하지 않고 사용
  - 브라우저로 전송되는 JavaScript의 양을 줄이고 싶을 때
  - 콘텐츠가 포함된 첫 번째 페인트를 개선하고, 콘텐츠를 client에 점진적으로 스트리밍

- 예를 들어, Page component는 게시물에 대한 데이터를 가져와서, client 측 상호 작용을 처리하는 likeButton에 props로 전달하는 server component입니다.
- 그리고, ui/like-button은 client component이기 때문에 use client를 사용
---
### [ Optimistic Update(낙관적 업데이트)]
- 사용자에 의해 이벤트가 발생하면, 서버 응답을 기다리지 않고 클라이언트(브라우저)의 UI를 즉시 변경(업데이트)합니다.
- 서버에 보낸 요청의 성공을 낙관한다고 가정해서 먼저 화면에 변화를 보여줍니다.
- 서버에서 응답이 없으면, UI를 원래 상태로 되돌립니다.(rollback)
- 네트워크 지연 동안에도 앱이 "빠르게 반응" 하도록 느끼게 하는 것이 목적입니다.
- (장점)
  - 서버 응답 속도와 관계없이 즉각적인 피드백을 제공하여 사용자 경험을 향상
  - 네트워크 상태가 나쁘거나 응답 시간이 길어도 사용자에게 체감되는 속도 빠름
- (단점)
  - 서버에서 오류 발생하면, 사용자에게는 잠시 동안 잘못된 정보가 표시될 수 있다.
  - 오류 발생 시 복구 로직 필요
---
### 문서의 코드를 완성해 봅시다. like-button.tsx
- /ui/like-button.tsx에서는 state 2개 사용
- count는 like 버튼 클릭 횟수
- count는 like 버튼을 클릭한 횟수라고 했지만 (likes)가 아닌 (like ?? 0)로 작성한 이유는? null 병합연산자
- [ Null 병합 연산자]
- 왼쪽 피연산자가 null 또는 undefined 이면 오른쪽 값을 반환하고, 그렇지 않으면 왼쪽 값 반환
  - 즉, likes의 값이 null이나 undefined이면 0값 반환, 값이 있으면 그대로 반환

- 'Falsy'는 프로그래밍 언어, 특히 JavaScript에서 조건문이나 논리 연ㅅ나 등 불리언값이 필요한 맥락에서 false 로평가되는 값들을 의미
  - false 값 분 아니라 해당하는 값 포함
  - 거짓 같은 값은 Bollem문맥에서 false로 평가되는 값
     
---
### Next.js에서 sever와 Client component는 어떻게 작동합니까?
- server에서 Next.js는 React의 API를 사용하여 렌더링 조정
- 렌더링 작업은 개별 라우팅 세그먼트 별 묶음으로 나뉨.
- server component는 RSC Payload라는 특수한 데이터 형식으로 렌더링
- client component와 RSC Payload는 HTML을 미리 렌더링 하는데 사용
  - React Server Component PayLoad(RSC)란?
    - RSC 페이로드는 렌더링된 React server component 트리의 압축된 바이너리 표현
    - client에서 React의 브라우저의 DOM을 업데이트하는데 사용
       
- RSC 페이로드에는 다음 내용 포함    
  - server component의 렌더링 결과
  - client component가 렌더링될 위치 및 해당 JavaScript 파일 참조를 위한 자리 표시자
  - server component에서 client component로 전달되는 모든 props
---  
### RSC는 JSON인가, 바이너리인가?
- 과거 : JSON 기반
- 현재 : 바이너리 형식으로 최적화
  - 최신 React, 특히 Next.js App Router는 RSC payload를 compact binary format으로 전송
  - JSON이 아니라, React 전용 이진 포맷으로 스트림을 통해 전달
  - 이 방식은 JSON보다 용량이 작고, 빠르게 파싱
- React는 컴포넌트 구조, props, 서버에서 생성된 UI정보를 RSC 프로토콜 정의하고, 이를 전송한느 것에 특화된 이진 형식을 사용
   
- 어떻게 이진이 브라우저에서 처리될까?
  - React가 server에서 만든 UI트리를 바이너리 스트림으로 client에 전달
  - client 측 React는 이를 해석해 UI 재구성
  - Next.js는 이 작업을 통해 자동으로 처리하기 때문에 신경안써도 됨.  
---
### Next.js에서 sever와 Client component는 어떻게 작동합니까?
- client component의 작동
1. Html은 사용자에게 경로(라우팅 페이지)의 비대화형 미리보기를 즉시 보여주는데 사용
2. RSC 페이지로드는 client와 sever component 트리를 조정하는데 사용
3. JavaScript는 client component를 hydration하고, 애플리케이션을 대화형으로 만드는데 사용
- Hydration이란 무엇인가?
  - Hydration은 이벤트 핸들러를 DOM에 연결하여 정적 HTML을 인터랙티브하게 만드는 React의 프로세스
  
### Example
- *client component* 사용
  - 파일의 맨 위, 즉 imort문 위에 "use client" 지시문 추가하여 client component 생성할 수 있음
  - "use clinet"는 server와 client 모듈 트리 사이의 경계를 선언하는데 사용
  - 파일에 "use client"로 표시되면 해당 파일의 모든 import와 자식 component는 client번들의 일부로 간주
  - 즉, client를 대상으로 하는 모든 component에 이 지시문 추가할 필요 없음.

### 3-1. client component 사용 #실습

- 문서의 코드는 /app/ui/counter.tsx를 작성했지만, src 디렉토리를 사용하는 경우는 다음과 같이 관리하는 것이 일반적입니다.
- src/app/ 아래에는 라우팅 페이지만 작성하고 관리합니다.
- 기타 사용자 정의 component나 library는 src/ 아래에 작성하고 관리합니다.

### [ 실습1] 따라서 이번 실습 코드는 src/components 디렉토리를 만들고 Counter 컴포넌트를 작성합니다.
```
src > components > counter.tsx > Counter
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```
- Counter 컴포넌트를 작성했으며 무엇을 해야 할까요?

- 작성하는 이유는 사용할 목적이 있기 때문이다.
  - 다른 컴포넌트의 완성을 위해 사용
  - 라우팅 페이지에서 렌더링을 위해 사용


### 3-2. JS bundle 크기 줄이기
-  client JavaScript 번들의 크기를 줄이려면 UI의 큰 부분을 client component로 표시하는 대신 특정 대화형 component에 “use client”를 추가합니다.
- 예를 들어, 다음 예제의 `<Layout>` component는 로고와 탐색 링크와 같은 정적 요소가 대부분이지만 대화형 검색창이 포함되어 있습니다.
- `<Search />`는 대화형이기 때문에 client component가 되어야 하지만, 나머지 layout은 server component로 유지될 수 있습니다.
- 나머지 layout은 server component로 유지해야 합니다!

---
## 2025-10-01 6주차 수업내용
### 1-4. Client-side transitions (클라이언트 측 전환)
- 일반적으로 서버 렌더링 페이지로 이동하면 전체 페이지가 로드됩니다. 이로 인해 state가 삭제되고, 스크롤 위치가 재설정되며, 상호작용이 차단됩니다.
- Next.js는 컴포넌트를 사용하는 클라이언트 측 전환을 통해 이를 방지합니다. 페이지를 다시 로딩하는 대신 다음과 같은 방법으로 콘텐츠를 동적으로 업데이트합니다.
- 공유 레이아웃과 UI를 유지합니다.
- 현재 페이지를 미리 가져온(prefetching) 로딩 상태 또는 사용 가능한 경우 새 페이지로 바꿉니다.
- 클라이언트 측 전환은 서버에서 렌더링된 앱을 클라이언트에서 렌더링된 앱처럼 느껴지게 하는 요소입니다. 또한 프리페칭 및 스트리밍과 함께 사용하면 동적 경로에서도 빠른 전환이 가능합니다.
---
### 3-3 server에서 client component로 데이터 전달
- 다른 방법으로는 use Hook을 사용하여 server component에서 client component로 데이터를 스트리밍할 수도 있다. 
- 알아두면 좋은 정보 : client component에 전달되는 porps는 React로 직렬화 가능해야 한다


### 직렬화란 무엇인가?
- 일반적으로 메모리에 있는 복잡한 데이터를 바이트의 연속 형태로 변환하는 과정
- 즉, 자바스크립트의 객체나 배열처럼 구조가 있는 데이터를 파일로 저장하거나, 네트워크로 전송하기 쉽게 만드는 과정
- React 나 Next.js 같은 프레임워크는 컴포넌트의 상태나 트리 주고를 서버에서 직렬화하여 클라이언트로 전송하고, 클라이언트에서 역직렬화 하는 과정을 수행
### 1. 네비게이션 작동 실습 
  - blog 디렉토리 생성 후 page.tsx 블로그 목록과, loading.tsx 로딩 스켈레톤 생성
### 2. 전환을 느리게 만드는 요인은 무엇일까요?
- Next.js는 최적화를 통해 네비게이션 속도가 빠르고 반응성이 뛰어납니다.
- 하지만 특정 조건에서는 전환 속도가 여전히 느릴 수 있습니다.
- 다음은 몇 가지 일반적인 원인과 사용자 경험을 개선하는 방법입니다.
### 2-1. 동적 경로 없는 `loading.tsx`
- 동적 경로로 이동할 때 클라이언트는 결과를 표시하기 전에 서버의 응답을 기다려야 합니다.
-  이로 인해 사용자는 앱이 응답하지 않는다는 인상을 받을 수 있습니다.
- 부분 프리페칭을 활성화하고, 즉시 네비게이션을 트리거하고, 경로가 렌더링되는 동안 로딩 UI를 표시하려면 동적 경로에 loading.tsx를 추가하는 것이 좋습니다.
- 개발 모드에서 **Next.js 개발자 도구(Devtools)**를 사용하여 경로가 정적인지 동적인지 확인할 수 있습니다.
### 2-2. 동적 세그먼트 없는 generateStaticParams
- 동적 세그먼트는 사전 렌더링될 수 있지만, generateStaticParams가 누락되어 사전 렌더링되지 않는 경우, 해당 경로는 요청 시점에 동적 렌더링으로 대체됩니다.
- generateStaticParams를 추가하여 빌드 시점에 경로가 정적으로 생성되도록 합니다.
### 코드 분석 - generateStaticParams가 없는 경우
- app/blog2/[ slug]/page.tsx // blog2의 동적 라우트로 각 포스트의 slug에 대응하는 페이지를 렌더링합니다. 
- 이 라우트는 generateStaticParams를 사용하지 않으므로 빌드 타임이 아닌 런타임에 params가 전달됩니다. 
- App Router에서는 params가 Promise로 전달될 수 있으나 안전하게 사용하려면 await params로 값을 해석해야 합니다.
### await이 없어도 async를 붙여 두는 이유
- 서버 컴포넌트(Server Component)는 기본적으로 비동기(asynchronous) 렌더링을 전제로 함.
- 1. 일관성 유지
- 2. 확장성
- 3. React 서버 컴포넌트(RSC) 호환성
---
### generateStaticParams가 없는 경우와 있는 경우 비교
- generateStaticParams가 없는 경우
  - Next.js는 slug 값을 빌드 타임(build time)에는 모르는 상태입니다.
  - 따라서 slug 페이지에 접속하면 Next.js가 서버에서 요청할 때마다 해당 페이지를 동적으로 렌더링하며, 빌드 결과물로 HTML 파일은 생성되지 않습니다.
- generateStaticParams가 있는 경우 Next.js에 빌드 타임에 생성할 slug 목록을 미리 알려줄 수 있습니다.
  -  이 경우에는 지정한 slug에 대해서는 정적 HTML + JSON이 빌드 타임에 생성되어, 최초 접근 시 SSR이 필요 없이 미리 만들어진 페이지를 제공합니다.
### 2-3. 느린 네트워크
- 네트워크가 느리거나 불안정한 경우, 사용자가 링크를 클릭하기 전에 **프리페칭(prefetching)**이 완료되지 않을 수 있습니다.
- 이것은 정적 경로와 동적 경로 모두에 영향을 미칠 수 있습니다.
- 이 경우, loading.tsx 파일이 아직 프리페칭되지 않았기 때문에 즉시 표시되지 않을 수 있습니다.
- 체감 성능을 개선하기 위해 useLinkStatus Hook을 사용하여 전환이 진행되는 동안 사용자에게 인라인 시각적 피드백을 표시할 수 있습니다.
   

- 초기 애니메이션 지연(예: 100ms)을 추가하고, 애니메이션을 보이지 않게(예: opacity: 0) 시작하면 로딩 표시기를 **"디바운스(debounce)"**할 수 있습니다.
- 즉, 로딩 표시기는 내비게이션이 지정된 지연 시간보다 오래 걸리는 경우에만 표시됩니다. 이는 빠른 연결에서는 로딩 UI가 불필요하게 깜박이는 것을 방지해 줍니다.
- debounce란? 연속적으로 발생하는 이벤트를 그룹화하여 특정 시간 간격 이후에 한 번만 처리하도록 하는 기술입니다. 주로 사용자 인터페이스에서 과도한 이벤트 발생을 막고 성능을 최적화하기 위해 사용합니다.
---
### 2-4. 프리페칭 비활성화
- 컴포넌트에서 prefetch prop을 false로 설정하여 프리페치를 사용하지 않도록 선택할 수 있습니다.
- 이는 대량의 링크 목록(예: 무한 스크롤 테이블)을 렌더링할 때 불필요한 리소스 사용을 방지하는 데 유용합니다.
- 그러나 프리페칭을 비활성화하면 다음과 같은 단점이 있습니다.

- 정적 라우팅: 사용자가 링크를 클릭할 때만 페이지를 가져오게 되어 즉시 로딩되지 않습니다.
- 동적 라우팅: 클라이언트가 해당 경로로 이동하기 전에 서버에서 먼저 렌더링되어야 하므로 지연이 발생합니다.
   
- 대안: Hover 시 프리페칭
- 프리페치를 완전히 비활성화하지 않고 리소스 사용량을 줄이려면, 마우스 호버(hover) 시에만 프리페치를 사용하면 됩니다.
- 이렇게 하면 뷰포트의 모든 링크가 아닌, 사용자가 방문할 가능성이 높은 경로로만 프리페치가 제한됩니다.
   
### 2-5. Hydration이 완료되지 않음
- < Link>는 클라이언트 컴포넌트이기 때문에 라우팅 페이지를 프리페치(prefetch)하기 전에 하이드레이션(hydration)해야 합니다.
- 초기 방문 시 대용량 자바스크립트 번들로 인해 하이드레이션이 지연되어 프리페칭이 바로 시작되지 않을 수 있습니다.
- React는 **선택적 Hydration(Selective Hydration)**을 통해 이를 완화하며, 다음과 같은 방법으로 이를 더욱 개선할 수 있습니다.
- @next/bundle-analyzer 플러그인을 사용하면 대규모 종속성을 제거하여, 번들 크기를 식별하고 줄일 수 있습니다.
- 가능하다면 클라이언트에서 서버로 로직을 이동합니다. 자세한 내용은 서버 및 클라이언트 컴포넌트 문서를 참조하세요.   
   
- Hydration이란 서버에서 생성된 HTML에 JavaScript 로직을 추가하여 동적으로 상호작용이 가능하도록 만드는 과정을 의미합니다.
- Hydration의 역할
  - Hydration은 SSR로 생성된 정적인 HTML에 클라이언트 측 JavaScript를 연결하여, 페이지가 로드된 후에도 사용자와의 상호작용이 가능하도록 만듭니다.
     
### 3. Examples - 네이티브 히스토리 API
- Next.js를 사용하면 기본 window.history.pushState 및 window.history.replaceState 메서드를 사용하여 페이지를 다시 로드하지 않고도 브라우저의 기록 스택을 - 업데이트할 수 있습니다.
- pushState 및 replaceState 호출은 Next.js 라우터에 통합되어 usePathname 및 useSearchParams와 동기화할 수 있습니다.
### window.history.pushState
- 이 것을 사용하여 브라우저의 기록 스택에 새 항목을 추가할 수 있습니다.
- 사용자는 이전 상태로 돌아갈 수 있습니다.
- 예를 들어 제품 목록을 정렬할 때 사용할 수 있습니다.
### window.history.replaceState
- 브라우저의 기록 스택에서 현재 항목을 바꾸려면 이 기능을 사용합니다.
- 사용자는 이전 상태로 돌아갈 수 없습니다.
- 예를 들어 애플리케이션의 로케일(Locale)을 전환하는 경우에 사용할 수 있습니다. ※ Locale 이란? 사용자의 언어, 지역, 날짜/시간 형식, 숫자 표기법 등 사용자 인터페이스에서 사용되는 다양한 설정을 정의하는 문자열입니다.

## 2025-09-24 5주차 수업내용
### 왜 동적 렌더링이 되는가?  
- Next.js에서 페이지는 크게 정적(static) 또는 동적(dynamic)으로 렌더링될 수 있습니다.
- searchParams는 요청이 들어와봐야 값을 알 수 있기 때문에, Next.js는 이 페이지를 정적으로 미리 생성할 수 없고, 요청이 올 때마다 서버 렌더링해야 합니다. -> 동적 렌더링 처리
- 즉, searchParams를 사용하는 순간 Next.js는
이 페이지는 요청이 들어와야 동작하네? -> 그러면 정적으로 미리 만들 수 없겠다!"라고 판단합니다. 
      
- 정적 렌더링 - 예시(/about,/ blog[ id]등), 빌드 시 생성, searhParams 사용 불가능
- 동적 렌더링 - 예시(/products?page=2 와 같이 동적 URL), 요청 시 서버에서 생성, searhParams 사용 가능  
### searchParams 실습
```
export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string: name?: string }>
}) {
  const { id="non id", name = "non name" } = await searchParams;
  return (
    <div>
      <h1>Products Page</h1>
      <p>id: {id}</p>
      <p><name>: {name}</p>
    </div>
  )
}
```
### [ slug]의 이해
- 데이터 소스가 크다면 find는 0(n)이므로 DB 쿼리로 바꿔야 합니다. : O(n)은 알고리즘의 시간 복잡도가 입력 데이터의 크기 n에 비례하여 시간이나 메모리 사용량이 선형적으로 증가하는 것을 의미합니다.
- 앞의 코드에서는 Promise... >를 사용하지 않아도 오류 없이 동작
- 하지만 params가 동기식처럼 보이지만 사실은 비동기식이라는 것을 좀더 명확히 하기 위해 사용합니다. 코드의 가독성이 좋습니다.
- 또 한가지 Promise를 명시해주면 await을 깜빡했을 때 TypeScript가 이를 잡아줍니다.
- 결론적으로 오류와 상관없이 Promise 사용을 권장합니다.

### 7.Linking between pages(페이지 간 연결)
- 컴포넌트를 사용하여 경로 사이를 탐색 할 수 있다.
- < Link > HTML 태그를 확장하여 prefetching 및 client-side navigation 기능을 제공하는 Next.js의 기본제공 컴포넌트입니다. - Prefetching은 사용자가 해당 경로로 이동하기 전에 백그라운드에서 해당 경로를 loading 하는 프로세스입니다.
- 예를 들어, 블로그 글 목록을 생성하려면 next/link에서 를 가져와서 컴포넌트에 href prop을 전달합니다.
```
import Link from 'next/link'
 
export default async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```
---
### /blog/page.tsx
```
import Link from "next/link";
import { posts } from "../(marketing)/blog/[slug]/posts";

export default async function BlogPage3() {
    return (
        <div>
            <h1>블로그3 목록</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog3/${post.slug}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```
- React는 기본적으로 라우팅 기능이 없기 때문에, 직접 라우터 라이브러리를 설치해서 라우팅을 설정해야 합니다.
- Next.js는 자체적으로 라우팅 시스템을 내장하고 있습니다.
---
### React vs Next.js 라우팅 방식의 차이
- React는 수동 설치, react-router-dom 같은 외부라이브 필요,< Route>로 정의
- Next.js에서 자동 설치, 자체 내장은 파일 기반 라우팅 시스템, 파일/폴더 이름으로 자동 매핑

### How navigation works(네비게이션 작동 방식)
 - Server Rendering
  - 정적 렌더링(또는 사전 렌더링)은 서버 시작시간에 미리 계산을 통해 캐시를 생성합니다.
    - 사용자는 초기 페이지 로드 시에 더 빠른 렌더링을 경험할 수 있습니다.
  - 동적 렌더링은 클라이언트의 요청에 대한 응답으로 오직 실시간에 발생합니다.
  - 서버 렌더링의 단점은 클라이언트가 새 경로를 요청하기 전에 서버의 응답을 기다려야 한다는 것입니다.
  - Next.js는 사용자가 방문할 가능성이 높은 경로를 미리 가져오(prefetching)하고, 클라이언트 측 전환(client-side transitions)을 수행하여 지연 문제를 해결합니다.
  - 최신 방향은 서버에서 페이지 HTML이 생성됩니다.
### Prefetching
- 프리페칭은 사용자가 해당 경로로 이동하기 전에 백그라운드에서 해당 경로를 로드하는 프로세스입니다.
- 사용자가 링크를 클릭하기 전에 다음 경로를 렌더링하는 데 필요한 데이터가 클라이언트 즉에 이미 준비되어 있기 때문에 애플리케이션에서 경로 간 이동이 즉각적으로 느껴집니다.
- Next.js는 < link› 컴포넌트와 연결된 경로를 자동으로 사용자 뷰포트에 미리 가져옵니다.
- tag를 사용하면 프리페칭을 하지 않습니다.
### Prefetching(프리페칭: 미리 가져오기)
   
- 미리 가져오는 경로의 양은 정적 경로인지 동적 경로인지에 따라 달라집니다.
  - 정적 경로: 전체 경로가 프리퍼치 됩니다.
  - 동적 경로: 프리페치를 건너뛰거나, loading.ts가 있는 경우 경로가 부분적으로 프리페칭 됩니다.
- Next.js는 동적 라우팅을 건너뛰거나 부분적으로 프리페칭하는 방법으로 사용자가 방문 하지 않을 수도 있는 경로에 대한 서버의 불필요한 작업을 방지합니다.
- 그러나 네비게이션 전에 서버 응답을 기다리면 사용자에게 앱이 응답하지 않는다는 인상을 줄 수도 있습니다.
- 동적 경로에 대한 네비게이션 환경을 개선하려면 스트리밍을 사용할 수 있습니다.
   
### Streaming (스트리밍)
- 스트리밍을 사용하면 서버가 전체 경로가 렌더링될 때까지 기다리지 않고, 동적 경로의 일부가 준비되는 즉시 클라이언트에 전송할 수 있습니다.
- 즉, 페이지의 일부가 아직 로드 중이더라도 사용자는 더 빨리 콘텐츠를 볼 수 있습니다.
- 동적 경로의 경우, 부분적으로 미리 가져올 수 있다는 뜻입니다. 즉, 공유 레이아웃과 로딩 스켈레톤을 미리 요청할 수 있습니다.
   
- 스트리밍을 사용하려면 라우팅 폴더에 loading.tsx 파일을 생성합니다.
```
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```
- Next.js는 백그라운드에서 page.tsx 콘텐츠를 < Suspenser 경계로 자동 래핑합니다.
- loading.tsx의 이점:
  - 사용자에게 즉각적인 네비게이션과 시각적 피드백을 제공합니다.
  - 공유 레이아웃은 상호 작용이 가능하고, 네비게이션은 중단될 수 있습니다.
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