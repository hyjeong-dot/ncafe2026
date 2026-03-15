'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ChatAgent.module.css';
import MenuChatCard from './MenuChatCard';
import ChatMenuAction from './ChatMenuAction';

// =============================================
// 📌 Gemini API 연동 시 아래 주석을 해제하세요
// =============================================
// 모델: gemini-2.0-flash (빠르고 가벼운 응답에 최적화)
//
// 1. 환경변수 설정 (.env.local 또는 docker-compose.yml):
//    GEMINI_API_KEY=your-gemini-api-key-here
//
// 2. API 호출은 /api/chat/route.ts 에서 처리합니다.
//    (보안을 위해 API 키는 서버 사이드에서만 사용)
//
// 3. 이 파일의 sendMessage() 함수에서
//    주석 처리된 fetch('/api/chat') 코드를 해제하고,
//    아래 더미 응답 setTimeout 블록을 주석 처리하면 연동 완료!
// =============================================

interface MenuAction {
    menuId: number;
    intent: 'ORDER' | 'CART';
}

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
    menuAction?: MenuAction;
    actionCompleted?: boolean;  // 옵션 선택 + 실행 완료 여부 (재실행 방지)
}

// 더미 응답 데이터 (Gemini 연동 전까지 사용)
const DUMMY_RESPONSES: Record<string, string> = {
    '메뉴': '위잉... 🪄 꼬물꼬물... 인기 메뉴를 쭉 뽑아드릴게몽! (._.)\n\n☕ **말랑 퍼플 라떼** - ₩7,000\n☕ **꾸덕 콜드브루** - ₩4,500\n🍵 **초록 변신 말차** - ₩6,500\n🍰 **겹겹이 초코 크로와상** - ₩4,800\n\n말랑말랑한 메뉴 페이지에서 더 확인해주세몽! 💜',
    '영업시간': '삐릿-! 🕐 영업시간을 스캔했당! (._.)\n\n⏰ **매일 09:00 ~ 22:00**\n(연중무휴, 명절 제외)\n\n☕ 라스트 오더는 21:30이몽!\n내 몸이 굳어서 졸기 전에 와주면 좋겠당~ 🫠',
    '위치': '위잉... 📍 위치 동기화 완료했몽! (._.)\n\n**서울특별시 강남구 테헤란로 123**\n\n🚇 지하철: 2호선 강남역 3번 출구에서 도보 5분\n🚌 버스: 강남역 정류장 하차\n🚗 주차: 건물 지하 주차장 이용 가능 (2시간 무료)\n\n꼬물꼬물.. 길 찾기 어려우면 내가 변신해서 마중 나갈까몽? 🫠',
    '추천': '삐릿! ✨ 맞춤형 메뉴 데이터를 로드했당! (._.)\n\n🌟 **말랑 퍼플 라떼** - 내 이름을 딴 시그니처당!\n말랑하고 따뜻한 보라빛 커피 어때몽?\n\n🍮 페어링 디저트: **겹겹이 초코 크로와상**\n\n위잉... 정성껏 내려드릴게몽 💜',
    '예약': '삐릿- 📞 예약 시스템 가동 중이당! (._.)\n\n현재 예약은 전화선으로만 연결돼몽!\n📱 **02-1234-5678**\n\n🎂 생일, 단체 예약 시 특별한 변신 이벤트를 준비해둘거당! 🎁\n\n✉️ 이메일: hello@dittocafe.kr',
    '이벤트': '위잉! 🎉 이벤트 데이터를 출력 중이당! (._.)\n\n1️⃣ **첫 방문 고객** - 오늘의 추천 음료 무료!\n2️⃣ **단골 변신 카드** - 10잔 적립 시 메타몽 특별 음료 증정!\n3️⃣ **SNS 인증샷** - 태그하면 10% 할인 변신 완료!\n\n삐릿, 항상 고맙게 생각하고 있몽! 💜🫠',
};

const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'agent',
    content: '삐릿- 어서오세몽! (._.) 메타몽 카페에 온 걸 환영한당!\n\n말랑하고 따뜻한 커피 한 잔 내려드릴까몽?\n메뉴, 위치, 예약 등 뭐든 물어보세몽! 꼬물꼬물... 도와줄 준비 완료했당! 💜',
    timestamp: new Date(),
};

const QUICK_ACTIONS = [
    { label: '☕ 메뉴 추천', keyword: '인기 메뉴 추천' },
    { label: '🕐 영업시간', keyword: '영업시간 확인' },
    { label: '📍 위치', keyword: '카페 위치 안내' },
    { label: '🎉 이벤트', keyword: '이벤트 정보' },
];

function getDummyResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    for (const [keyword, response] of Object.entries(DUMMY_RESPONSES)) {
        if (msg.includes(keyword)) {
            return response;
        }
    }

    // 인사
    if (msg.includes('안녕') || msg.includes('하이') || msg.includes('hello') || msg.includes('hi')) {
        return '삐릿- 어서오세몽! (._.)💜 바리스타 메타몽이당!\n무엇이든 변신해서 도와줄게몽~';
    }

    // 감사
    if (msg.includes('감사') || msg.includes('고마워') || msg.includes('땡큐')) {
        return '삐릿! 천만에몽! (._.) 꼬물꼬물... 난 항상 여기 대기 중이당~\n더 궁금한 게 있으면 부드럽게 또 불러주세몽! 💜';
    }

    // 기본 응답
    return '위잉... 🤔 앗, 그 명령어는 내가 아직 변신할 수 없는 형태당... (._.)\n\n내 몸을 다른 도구로 변신할 수 있게 아래 키워드로 다시 알려주면 안 될까몽?\n• **메뉴** / **추천** / **영업시간** / **위치** / **예약** / **이벤트**';
}

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ChatAgent() {
    const router = useRouter();
    const { user } = useAuth();
    const { isCartOpen, setCartOpen } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLButtonElement>(null);

    // Scroll Top 버튼이 보이는지 감지 (Footer에서 관리하는 값과 동기화)
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 메시지 목록 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // 채팅 패널 열면 포커스
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setUnreadCount(0);
        }
    }, [isOpen]);

    // 외부 클릭 시 닫기
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                panelRef.current && !panelRef.current.contains(target) &&
                bubbleRef.current && !bubbleRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        const agentMessageId = `agent-${Date.now()}`;
        let fullReply = '';
        let messageCreated = false;

        try {
            const formattedMessages = messages.map(m => ({
                role: m.role === 'agent' ? 'model' : 'user',
                content: m.content
            }));
            formattedMessages.push({ role: 'user', content: content.trim() });

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: formattedMessages,
                    stream: true,
                    userContext: user ? {
                        nickname: user.name,
                        role: user.role,
                        timezone: 'Asia/Seoul',
                    } : null
                }),
            });

            if (!res.ok || !res.body) {
                throw new Error(`API request failed: ${res.status}`);
            }

            // SSE 스트리밍 파싱
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8', { fatal: false });
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data: ')) {
                        const data = trimmed.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                fullReply += parsed.content;
                                const currentReply = fullReply;

                                if (!messageCreated) {
                                    // 첫 청크: 타이핑 인디케이터 숨기고, 메시지 생성
                                    messageCreated = true;
                                    setIsTyping(false);
                                    setMessages(prev => [...prev, {
                                        id: agentMessageId,
                                        role: 'agent',
                                        content: currentReply,
                                        timestamp: new Date(),
                                    }]);
                                } else {
                                    // 이후 청크: 메시지 내용 갱신
                                    setMessages(prev =>
                                        prev.map(msg =>
                                            msg.id === agentMessageId
                                                ? { ...msg, content: currentReply }
                                                : msg
                                        )
                                    );
                                }
                            }
                        } catch {
                            // 불완전한 JSON 무시
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat API error:', error);
            fullReply = '삐릿...? 앗, 코드가 엉켜버렸몽... (._.) 내 몸이 굳어버렸당. 다시 부드럽게 반죽해 주세몽! 🫠';
            if (!messageCreated) {
                setMessages(prev => [...prev, {
                    id: agentMessageId,
                    role: 'agent',
                    content: fullReply,
                    timestamp: new Date(),
                }]);
            } else {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === agentMessageId
                            ? { ...msg, content: fullReply }
                            : msg
                    )
                );
            }
        }

        // 스트리밍 완료 후 태그 파싱
        const menuSelectMatch = fullReply.match(/\[MENU_SELECT:(\d+):(ORDER|CART)\]/);
        if (menuSelectMatch) {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === agentMessageId
                        ? {
                            ...msg,
                            menuAction: {
                                menuId: parseInt(menuSelectMatch[1], 10),
                                intent: menuSelectMatch[2] as 'ORDER' | 'CART',
                            }
                        }
                        : msg
                )
            );
        }

        setIsTyping(false);

        if (!isOpen) {
            setUnreadCount(prev => prev + 1);
        }

        // 화면 이동 처리 ([NAV:target])
        const navMatch = fullReply.match(/\[NAV:([\w-]+)\]/);
        if (navMatch) {
            const target = navMatch[1];
            if (target.startsWith('menu_detail_')) {
                const detailSlug = target.replace('menu_detail_', '');
                router.push(`/menus/${detailSlug}`);
            } else {
                switch (target) {
                    case 'home':
                        router.push('/');
                        break;
                    case 'menus':
                        router.push('/menus');
                        break;
                    case 'cart':
                        setCartOpen(true);
                        break;
                    case 'mypage':
                        router.push('/mypage');
                        break;
                    case 'login':
                        router.push('/login');
                        break;
                }
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    const handleQuickAction = (keyword: string) => {
        sendMessage(keyword);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    // 메뉴 액션 완료 시 후속 메시지 추가
    const handleMenuActionComplete = (completionMsg: string) => {
        const followUpMessage: Message = {
            id: `agent-complete-${Date.now()}`,
            role: 'agent',
            content: completionMsg,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, followUpMessage]);
    };

    // 마크다운 볼드 및 메뉴 ID 태그 처리
    const renderContent = (text: string) => {
        // [ID:숫자], [NAV:대상], [MENU_SELECT:ID:INTENT] 태그를 분리
        const segments = text.split(/(\[ID:\d+\]|\[NAV:[\w-]+\]|\[MENU_SELECT:\d+:(?:ORDER|CART)\])/g);
        
        return segments.map((segment, i) => {
            // 메뉴 ID 태그인 경우
            if (segment.startsWith('[ID:') && segment.endsWith(']')) {
                const menuId = parseInt(segment.match(/\d+/)?.[0] || '0', 10);
                if (menuId > 0) {
                    return <MenuChatCard key={`menu-${i}`} id={menuId} />;
                }
            }
            
            // 특수 태그인 경우 화면엔 그리지 않음
            if ((segment.startsWith('[NAV:') || segment.startsWith('[MENU_SELECT:')) && segment.endsWith(']')) {
                return null;
            }
            
            // 일반 텍스트거나 볼드(**)가 포함된 텍스트인 경우
            const parts = segment.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={`bold-${i}-${j}`}>{part.slice(2, -2)}</strong>;
                }
                return <span key={`text-${i}-${j}`}>{part}</span>;
            });
        });
    };

    if (isCartOpen) return null;

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div ref={panelRef} className={`${styles.chatPanel} ${showScrollTop ? styles.shifted : ''}`}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderInfo}>
                            <div className={styles.agentAvatar}>
                                <Image src="/images/ditto/ditto-Bot.png" alt="Ditto Bot" width={38} height={38} className={styles.agentAvatarImage} />
                            </div>
                            <div>
                                <div className={styles.agentName}>메타몽 AI</div>
                                <div className={styles.agentStatus}>
                                    <span className={styles.statusDot} />
                                    항상 깨어있어요
                                </div>
                            </div>
                        </div>
                        <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="닫기">
                            <X size={16} /> <kbd className={styles.kbd}>ESC</kbd>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className={styles.messagesArea}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAgent}`}
                            >
                                {msg.role === 'agent' && (
                                    <div className={styles.messageAvatar}>
                                        <Image src="/images/ditto/ditto-Bot.png" alt="Ditto Bot" width={32} height={32} className={styles.messageAvatarImage} />
                                    </div>
                                )}
                                <div className={styles.messageContent}>
                                    <div
                                        className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAgent}`}
                                    >
                                        {renderContent(msg.content)}
                                    </div>
                                    {/* 메뉴 옵션 선택 UI */}
                                    {msg.menuAction && (
                                        <ChatMenuAction
                                            menuId={msg.menuAction.menuId}
                                            intent={msg.menuAction.intent}
                                            actionCompleted={msg.actionCompleted}
                                            onComplete={handleMenuActionComplete}
                                            onMarkCompleted={() => {
                                                setMessages(prev =>
                                                    prev.map(m =>
                                                        m.id === msg.id
                                                            ? { ...m, actionCompleted: true }
                                                            : m
                                                    )
                                                );
                                            }}
                                        />
                                    )}
                                    <div className={`${styles.messageTime} ${msg.role === 'agent' ? styles.messageTimeAgent : ''}`}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className={`${styles.messageRow} ${styles.messageRowAgent}`}>
                                <div className={styles.messageAvatar}>
                                    <Image src="/images/ditto/ditto-Bot.png" alt="Ditto Bot" width={32} height={32} className={styles.messageAvatarImage} />
                                </div>
                                <div className={styles.typingIndicator}>
                                    <div className={styles.typingDots}>
                                        <span className={styles.typingDot} />
                                        <span className={styles.typingDot} />
                                        <span className={styles.typingDot} />
                                    </div>
                                    <span className={styles.typingText}>메타몽이 생각 중...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.quickActions}>
                        {QUICK_ACTIONS.map(action => (
                            <button
                                key={action.keyword}
                                className={styles.quickAction}
                                onClick={() => handleQuickAction(action.keyword)}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className={styles.inputArea}>
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.chatInput}
                            placeholder="메타몽에게 물어보세요..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={500}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={() => sendMessage(inputValue)}
                            disabled={!inputValue.trim() || isTyping}
                            aria-label="전송"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Chat Bubble */}
            <button
                ref={bubbleRef}
                className={`${styles.chatBubble} ${showScrollTop ? styles.shifted : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="AI 채팅 열기"
                id="chat-agent-bubble"
            >
                {isOpen ? (
                    <X className={styles.bubbleClose} size={24} />
                ) : (
                    <Image src="/images/ditto/ditto-Bot.png" alt="Ditto Bot" width={62} height={62} className={styles.bubbleImage} />
                )}
                {!isOpen && unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{unreadCount}</span>
                )}
            </button>
        </>
    );
}
