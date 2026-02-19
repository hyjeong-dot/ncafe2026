# NCafe 2026 - 로그인 시스템 (헥사고날 아키텍처)

## 1. 디렉토리 구조

```
auth/
├── domain/                              ← 육각형 가장 안쪽 (순수 자바)
│   ├── model/
│   │   └── Member.java                  ← 회원 도메인 모델
│   └── exception/
│       └── AuthenticationFailedException.java  ← 도메인 예외
│
├── application/                         ← 육각형 내부 (유스케이스)
│   ├── port/
│   │   ├── in/                          ← Input Port (외부 → 내부)
│   │   │   └── LoginUseCase.java        ← 로그인 유스케이스 인터페이스
│   │   └── out/                         ← Output Port (내부 → 외부)
│   │       └── LoadMemberPort.java      ← 회원 조회 인터페이스
│   └── service/
│       └── AuthService.java             ← 유스케이스 구현체
│
└── adapter/                             ← 육각형 외부 (기술 구현체)
    ├── in/web/                          ← Input Adapter (HTTP)
    │   ├── AuthController.java          ← REST 컨트롤러
    │   ├── LoginRequest.java            ← 요청 DTO
    │   └── LoginResponse.java           ← 응답 DTO
    └── out/persistence/                 ← Output Adapter (DB)
        └── MemberPersistenceAdapter.java← DB 접근 구현체
```

## 2. 의존성 흐름

```
[브라우저] → AuthController → LoginUseCase(인터페이스) ← AuthService → LoadMemberPort(인터페이스) ← MemberPersistenceAdapter → [DB]
              (adapter.in)     (port.in)                 (service)       (port.out)                   (adapter.out)
```

**핵심 규칙**: 화살표의 방향이 항상 "바깥 → 안쪽"입니다.
- 컨트롤러(어댑터)는 서비스가 아닌 **인터페이스(포트)**에 의존합니다.
- 서비스는 DB 구현체가 아닌 **인터페이스(포트)**에 의존합니다.

## 3. API 엔드포인트

| Method | URL           | 설명     |
| ------ | ------------- | -------- |
| POST   | `/auth/login` | 로그인   |

### 요청 (Request Body)
```json
{
  "username": "admin",
  "password": "1234"
}
```

### 응답 - 성공 (200)
```json
{
  "memberId": 1,
  "username": "admin",
  "name": "관리자",
  "role": "ADMIN",
  "message": "로그인 성공"
}
```

### 응답 - 실패 (401)
```json
{
  "memberId": null,
  "username": null,
  "name": null,
  "role": null,
  "message": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

## 4. TODO: 직접 구현해야 할 부분

### ✅ `Member.authenticate()` 메서드
`auth/domain/model/Member.java`의 `authenticate()` 메서드에 비밀번호 검증 로직을 구현하세요.

```java
public boolean authenticate(String rawPassword) {
    // 예시 1: 평문 비교
    return this.password.equals(rawPassword);
    
    // 예시 2: BCrypt 비교
    // return BCrypt.checkpw(rawPassword, this.password);
}
```

### ✅ DB 테이블 (member)
아래 컬럼이 필요합니다:
- `id` (BIGINT, PK)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `name` (VARCHAR)
- `role` (VARCHAR)

## 5. 나중에 기술이 바뀌면?

| 변경 사항 | 수정 범위 |
| --------- | --------- |
| DB를 JPA로 변경 | `adapter.out.persistence` 패키지만 수정 |
| REST → gRPC 변경 | `adapter.in` 패키지만 수정 |
| 세션 → JWT 변경 | `adapter.in.web`에 필터 추가 |
| 비밀번호 암호화 방식 변경 | `domain.model.Member.authenticate()`만 수정 |

**서비스, 포트, 도메인 계층은 전혀 수정할 필요가 없습니다.**
