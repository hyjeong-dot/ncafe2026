# NCafe 2026 Menu System - Hexagonal Architecture (MSA Ready) Blueprint

## 1. 개요 (Overview)
이 문서는 **MSA(Microservices Architecture)** 환경을 대비하여, **헥사고날 아키텍처(Hexagonal Architecture, Ports and Adapters)** 패턴을 적용한 메뉴 관리 시스템의 청사진입니다.
핵심 목표는 **비즈니스 로직을 외부 기술(Web, DB, Messaging)로부터 완벽하게 격리**하여, 독립적으로 개발, 테스트, 배포할 수 있는 구조를 만드는 것입니다.

## 2. 헥사고날 아키텍처 핵심 개념
- **육각형 내부 (Inner Hexagon)**: 도메인과 비즈니스 로직. 순수한 자바 코드.
- **포트 (Ports)**: 내부와 외부가 대화하는 인터페이스.
- **어댑터 (Adapters)**: 포트를 통해 실제 기술(Web, DB, Kafka 등)을 연결하는 구현체.

## 3. 제안하는 패키지 구조 (Package Structure)

기존 모놀리스 패키지 구조에서 완전히 벗어나, `menu`라는 독립적인 Bounded Context(경계)를 가집니다.

```
com.new_cafe.menu
├── domain                     (육각형의 가장 안쪽: 핵심 비즈니스 로직)
│   ├── model                  (Menu, MenuId, Category, MenuAggregate)
│   ├── event                  (MenuCreatedEvent - 도메인 이벤트)
│   └── exception              (MenuNotFoundException - 도메인 예외)
│
├── application                (육각형 내부: 애플리케이션 로직)
│   ├── port
│   │   ├── in                 (Input Ports / Driving Ports: 외부 -> 내부)
│   │   │   ├── RegisterMenuUseCase.java (메뉴 등록 인터페이스)
│   │   │   ├── ChangeMenuPriceUseCase.java
│   │   │   └── GetMenuQuery.java    (조회 전용 인터페이스 - CQRS 고려)
│   │   │
│   │   └── out                (Output Ports / Driven Ports: 내부 -> 외부)
│   │       ├── LoadMenuPort.java    (DB 조회용 포트)
│   │       ├── SaveMenuPort.java    (DB 저장용 포트)
│   │       └── PublishEventPort.java (이벤트 발행용 포트 - MSA 필수)
│   │
│   └── service                (Input Port의 구현체)
│       └── MenuService.java   (유스케이스 흐름 제어, 도메인 로직 위임)
│
├── adapter                    (육각형 외부: 기술적인 구현체들)
│   ├── in                     (Input Adapters / Driving Adapters)
│   │   └── web                (REST Controller)
│   │       ├── MenuController.java
│   │       └── request            (CreateMenuRequest)
│   │
│   └── out                    (Output Adapters / Driven Adapters)
│       ├── persistence        (JPA / DB Adapter)
│       │   ├── MenuJpaEntity.java (DB 테이블 매핑)
│       │   ├── MenuRepository.java (Spring Data JPA)
│       │   ├── MenuPersistenceAdapter.java (Load/SavePort 구현)
│       │   └── MenuMapper.java    (Domain <-> Entity 변환)
│       │
│       └── message            (Messaging Adapter - MSA 연동)
│           └── KafkaMenuProducer.java (PublishEventPort 구현 - 메뉴 변경 이벤트 발행)
│
└── MenuApplication.java       (독립 실행 가능한 애플리케이션 클래스 - MSA)
```

## 4. 데이터 흐름 및 상호작용 (Interaction Flow)

### 시나리오: 메뉴 가격 변경 (MSA 환경)

1. **외부 요청**: 관리자가 메뉴 가격 변경 API 호출 (`adapter.in.web`)
2. **입력 어댑터**: `MenuController`가 요청을 받아 `ChangeMenuPriceUseCase` (Input Port) 호출
3. **애플리케이션 서비스**: `MenuService`가 트랜잭션 시작
    - `LoadMenuPort` (Output Port)를 통해 `Menu` 도메인 모델 로드
4. **도메인 로직**: `Menu` 도메인 객체 내부의 `changePrice()` 메서드 실행 (비즈니스 규칙 검증)
5. **저장**: `SaveMenuPort` (Output Port)를 통해 변경된 상태 저장
6. **이벤트 발행 (MSA 핵심)**: `PublishEventPort` (Output Port)를 통해 `MenuPriceChangedEvent` 발행
    - 다른 서비스(예: 정산, 검색, 알림 서비스)가 이 이벤트를 구독하여 데이터 동기화
7. **출력 어댑터**:
    - `MenuPersistenceAdapter` -> DB 업데이트
    - `KafkaMenuProducer` -> Kafka 메시지 전송

## 5. 클린 아키텍처 vs 헥사고날 아키텍처 비교

| 구분 | 클린 아키텍처 (이전 제안) | 헥사고날 아키텍처 (이번 제안) | 차이점 및 MSA 적합성 |
| :--- | :--- | :--- | :--- |
| **구조적 중점** | 계층(Layer) 간의 의존성 규칙 강조 | **내부(도메인)**와 **외부(인프라)**의 경계 및 소통 방식(Port) 강조 | 헥사고날이 '포트'를 명시하여 모듈 교체 및 테스트 대역(Mock) 사용이 더 직관적임 |
| **의존성 방향** | 바깥쪽 -> 안쪽 (동일) | 바깥쪽 -> 안쪽 (동일) | 둘 다 도메인을 보호하는 원칙은 동일함 |
| **확장성** | 일반적인 웹 애플리케이션에 적합 | **MSA 및 다중 인터페이스**에 강력함 | Web API 뿐만 아니라 gRPC, CLI, Message Consumer 등 다양한 입력을 처리하기에 용이한 구조 |
| **MSA 요소** | 명시적이지 않음 | **Message Adapter** 등을 적극적으로 포함 | 시스템 간 결합도를 낮추기 위한 이벤트 기반 통신(Event-Driven)을 설계에 포함 |

## 6. 결론
MSA로의 전환을 고려한다면, **헥사고날 아키텍처**가 더 유리합니다.
- **이유 1**: 도메인 로직이 외부 인터페이스나 DB 기술 변경에 전혀 영향을 받지 않습니다.
- **이유 2**: `Port` 인터페이스를 통해 모킹(Mocking)이 쉬워져, DB나 Kafka 없이도 비즈니스 로직을 완벽하게 테스트할 수 있습니다.
- **이유 3**: 나중에 Web API 외에 다른 호출 방식(예: Batch Job, gRPC)이 추가되더라도 `adapter.in` 패키지에 어댑터만 추가하면 됩니다.

---
**다음 단계:**
이 청사진이 마음에 드시면, 기존 코드를 이 구조에 맞춰 리팩토링하는 작업을 시작하겠습니다.
