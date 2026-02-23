# NCafe Backend Architecture Guide

이 문서는 NCafe 프로젝트의 백엔드 설계 원칙인 **헥사고날 아키텍처(Hexagonal Architecture)** 및 **역할 기반 도메인 분리(Admin/User Separation)** 구조를 설명합니다. 새로운 AI 어시스턴트나 개발자가 프로젝트에 참여할 때 이 규칙을 반드시 준수해야 합니다.

---

## 🏛 1. 핵심 설계 철학

1.  **관심사의 분리 (Separation of Concerns)**: 핵심 비즈니스 로직(내부)과 웹 API, 데이터베이스 등 기술적 세부사항(외부)을 독립적으로 분리합니다.
2.  **역할 기반 최상위 분리**: 시스템을 관리자(`admin`)와 일반 사용자(`user` 및 기본 도메인)의 역할에 따라 최상위 패키지 레벨에서부터 물리적으로 격리합니다.
3.  **단일 책임 유즈케이스 (Single Responsibility UseCase)**: 하나의 UseCase 인터페이스는 하나의 비즈니스 의도만 가져야 합니다. (예: `GetMenuListUseCase`, `CreateMenuUseCase`)

---

## 📂 2. 디렉토리 및 패키지 구조

도메인별 폴더는 아래와 같은 헥사고날 레이어를 따릅니다.

### 패키지 명명 규칙
*   **관리자 전용**: `com.new_cafe.app.backend.admin.[도메인]`
*   **일반 사용자 전용**: `com.new_cafe.app.backend.[도메인]`

### 계층별 역할
```text
[domain_folder]/
├── adapter/
│   ├── in/web/             ← [Driving Adapter] 입구. 컨트롤러 및 DTO (admin은 /admin/.. 경로 사용)
│   └── out/persistence/    ← [Driven Adapter] 출구. 실제 DB 연동(JPA, JDBC 등) 및 엔티티
├── application/
│   ├── port/
│   │   ├── in/             ← [Input Port] UseCase 인터페이스 및 Command/Query 객체들
│   │   └── out/            ← [Output Port] 서비스가 외부 기능을 요청하기 위한 인터페이스
│   └── service/            ← [Application Service] 비즈니스 로직 오케스트레이션 및 포트 구현
└── domain/
    └── model/              ← [Domain Model] 핵심 비즈니스 객체 (상태와 내부 규칙 포함)
```

---

## 🚀 3. 관리자 vs 사용자 분리 예시 (Menu 도메인)

강사님의 요구사항에 따라 메뉴 도메인은 다음과 같이 완전히 분리되었습니다.

### 🔴 Admin Menu 도메인 (`/admin/menu`)
- **위치**: `admin.menu`
- **목적**: 카페 사장님의 관리 활동 (메뉴 생성, 수정, 삭제, 전체 목록 관리)
- **주요 경로**: `@RequestMapping("/admin/menu")`

### 🔵 User Menu 도메인 (`/menu`)
- **위치**: `menu` (기본 최상위)
- **목적**: 일반 고객의 조회 활동 (메뉴판 보기, 상세 메뉴 확인)
- **주요 경로**: `@RequestMapping("/menu")`

---

## 📝 4. 유즈케이스 작성 가이드

유즈케이스 인터페이스 하나가 너무 커지지 않도록 한 파일에 하나의 인터페이스만 작성합니다.

```java
// 예: 메뉴 생성을 위한 독립적인 인터페이스
public interface CreateMenuUseCase {
    Menu createMenu(CreateMenuCommand command);
}
```

---

## 🛠 5. 의존성 규칙

1.  **Internal -> External 금지**: `domain`과 `application` 계층은 `adapter` 계층의 클래스를 직접 참조할 수 없습니다. 대신 `Port` 인터페이스를 통해 대화합니다.
2.  **역할 간 독립성**: `menu` 도메인의 코드가 `admin.menu` 도메인의 내부 구현에 직접 의존하지 않도록 합니다. 필요한 경우 유즈케이스(Input Port)를 통해 협력합니다.

---

이 문서는 프로젝트의 일관성을 유지하기 위한 헌장입니다. 모든 코드 리팩토링 및 새로운 도메인 추가 시 이 구조를 유지하십시오.
