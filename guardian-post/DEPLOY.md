# 가디언 포스트 배포 가이드 (Vercel)

이 문서는 '가디언 포스트' 웹 서비스를 Vercel 플랫폼에 배포하여 누구나 접속할 수 있게 만드는 방법을 안내합니다.

## 전제 조건
- **Vercel 계정**: [vercel.com](https://vercel.com)에서 회원가입이 필요합니다.
- **Git 설치 권장**: 장기적인 관리를 위해 [Git](https://git-scm.com/) 설치를 권장합니다.

---

## 방법 1: 가장 쉬운 방법 (Vercel CLI 사용)

Git 설정이 복잡하다면, 터미널 명령어로 바로 배포할 수 있습니다.

1. **터미널 열기**
   - VS Code에서 `Ctrl + ~`를 눌러 터미널을 엽니다.

2. **배포 명령어 실행**
   아래 명령어를 입력합니다:
   ```bash
   npx vercel
   ```

3. **질문 답변 (Enter만 누르면 됩니다)**
   - `Log in to Vercel`: 브라우저가 열리면 로그인하고 승인합니다.
   - `Set up and deploy?`: `y` (Yes)
   - `Which scope?`: 본인 계정 선택 (Enter)
   - `Link to existing project?`: `n` (No)
   - `Project name?`: `guardian-post` (Enter)
   - `In which directory?`: `./` (Enter)
   - `Auto-detect Project Settings?`: `y` (Yes)

4. **배포 완료**
   - 설정이 끝나면 자동으로 클라우드에 업로드되고 빌드가 시작됩니다.
   - 약 1~2분 후 `Production: https://guardian-post-xxxx.vercel.app` 형태의 주소가 나옵니다.
   - 해당 주소를 클릭하여 접속하면 됩니다.

### (중요) 환경 변수 설정
AI 기능을 실제로 작동시키려면 Vercel 대시보드에서 환경 변수를 설정해야 합니다.
1. Vercel 대시보드 -> 해당 프로젝트 -> **Settings** -> **Environment Variables**
2. 다음 키-값을 추가합니다:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-xxxx` (본인의 OpenAI 키)
3. 설정 후 **Redeploy**(재배포) 해야 적용됩니다.

---

## 방법 2: Git 및 GitHub 사용 (권장)

소스 코드를 안전하게 저장하고, 수정 시 자동 배포가 되게 하려면 이 방법을 씁니다.

1. **GitHub 저장소 생성**
   - GitHub에 로그인 후 새 Repository를 만듭니다 (예: `guardian-post`).

2. **프로젝트 연결**
   터미널에서 아래 명령어를 순서대로 입력합니다 (Git이 설치되어 있어야 함):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/sangbinbag74-lang/guardian-post.git
   git push -u origin main
   ```

3. **Vercel 대시보드에서 불러오기**
   - [vercel.com/new](https://vercel.com/new) 접속
   - `Import Git Repository`에서 방금 만든 저장소 선택
   - `Deploy` 버튼 클릭

---

## 🔄 업데이트 및 재배포 방법

코드를 수정하거나 새로운 기능을 추가했을 때 본 서버(Live)에 반영하는 방법입니다.

### 방법 1: Vercel CLI 사용 (가장 빠름)
터미널에서 다음 명령어를 입력하면 즉시 덮어씌워져 업데이트됩니다.
```bash
npx vercel --prod
```

### 방법 2: Git 사용 (자동 배포)
코드를 수정하고 저장한 뒤, 다음 명령어를 입력하면 Vercel이 감지하여 자동으로 재배포합니다.
```bash
git add .
git commit -m "업데이트 내용 작성"
git push
```

---

## 문제 해결
- **권한 오류**: 터미널을 관리자 권한으로 실행해 보세요.
- **빌드 실패**: 로컬에서 `npm run build`가 성공하는지 먼저 확인하세요.
