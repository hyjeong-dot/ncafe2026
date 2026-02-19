# NCafe 2026 - 메뉴 및 카테고리 시스템 (헥사고날 아키텍처)

## 1. 개요
기존의 3계층(Controller-Service-Repository) 구조를 도메인 중심의 **헥사고날 아키텍처(Hexagonal Architecture)**로 리팩토링하였습니다. 특히 `Menu`와 `Category`를 독립된 도메인으로 분리하여 유지보수성과 확장성을 극대화했습니다.

---

## 2. 전체 구조 (최신 버전)

### 도메인 분리 및 패키지 구조
```
com.new_cafe.app.backend.
├── menu/                         # 메뉴 도메인 (독립)
│   ├── domain/
│   │   ├── model/ (Menu, MenuImage)
│   │   └── exception/ (MenuNotFoundException)
│   ├── application/
│   │   ├── port/
│   │   │   ├── in/ (GetMenuQuery, GetPublicMenuQuery, RegisterMenuUseCase, ...)
│   │   │   └── out/ (LoadMenuPort, SaveMenuPort, DeleteMenuPort, ...)
│   │   └── service/ (MenuQueryService, PublicMenuQueryService, MenuCommandService)
│   └── adapter/
│       ├── in/web/ (AdminMenuController, PublicMenuController, DTOs)
│       └── out/persistence/ (MenuPersistenceAdapter, AvailableMenuPersistenceAdapter, ...)
│
└── category/                     # 카테고리 도메인 (독립)
    ├── domain/
    │   └── model/ (Category)
    ├── application/
    │   ├── port/
    │   │   ├── in/ (GetCategoryQuery)
    │   │   └── out/ (LoadCategoryPort)
    │   └── service/ (CategoryQueryService)
    └── adapter/
        └── out/persistence/ (CategoryPersistenceAdapter)
```

---

## 3. 핵심 설계 포인트

### A. 관리자 vs 회원 시스템 분리
동일한 메뉴 데이터를 사용하지만, 접근 권한과 비즈니스 규칙에 따라 Input Port와 Controller를 분리했습니다.
*   **Admin (관리자)**: 전체 메뉴 조회, 상세 정보 변경, 생성, 삭제 (CUD) 전체 허용.
*   **Public (회원)**: 판매 가능(`isAvailable=true`)한 메뉴만 필터링하여 노출.

### B. 도메인 간 협력 (Menu → Category)
`Menu` 도메인은 `Category` 도메인의 내부 구현을 알 필요가 없습니다. 오직 `GetCategoryQuery`(Port) 인터페이스를 통해서만 카테고리 정보를 가져옵니다.

### C. 영속성 계층 (JdbcTemplate)
모든 DB 접근은 `JdbcTemplate`을 사용하여 로우 레벨 쿼리 제어권을 가지면서도 스프링의 데이터 접근 편의성을 활용합니다.

---

## 4. API 엔드포인트

### 관리자 API (`/admin/**`)
| Method | URL | 설명 |
| :--- | :--- | :--- |
| GET | `/admin/menus` | 전체 메뉴 목록 (검색/필터 가능) |
| POST | `/admin/menus` | 새 메뉴 등록 |
| GET | `/admin/menus/{id}` | 메뉴 상세 정보 조회 |
| PUT | `/admin/menus/{id}` | 메뉴 정보 수정 |
| DELETE| `/admin/menus/{id}` | 메뉴 삭제 |
| GET | `/admin/categories` | 전체 카테고리 목록 조회 |

### 회원 API (`/api/menus/**`)
| Method | URL | 설명 |
| :--- | :--- | :--- |
| GET | `/api/menus` | 판매 중인 메뉴 목록 조회 |
| GET | `/api/menus/{id}` | 메뉴 상세 조회 (판매중인 것만) |
| GET | `/api/menus/categories` | 카테고리 목록 조회 |

---

## 5. 의존성 흐름도

```text
[ Admin Web UI ]          [ Customer Web UI ]
       ↓                         ↓
AdminMenuController      PublicMenuController
       ↓                         ↓
  (Input Ports) ←──┐        (Input Ports)
       ↓           │             ↓
MenuCommandService ├──── MenuQueryService / PublicMenuQueryService
       ↓           │             ↓
  (Output Ports) ──┘        (Output Ports)
       ↓                         ↓
MenuPersistenceAdapter   AvailableMenuPersistenceAdapter
       └───────────┬─────────────┘
             [ PostgreSQL ]
```

---

## 6. 기존 3계층 코드 처리 현황
기존 `backend.controller`, `backend.service`, `backend.repository` 패키지의 코드들은 헥사고날 구조로 이관되었으며, Bean 충돌 방지를 위해 기존 파일들의 어노테이션(`@Service`, `@Repository` 등)은 **주석 처리**되었습니다.
