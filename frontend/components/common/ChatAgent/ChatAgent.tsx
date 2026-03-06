'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, X } from 'lucide-react';
import Image from 'next/image';
import styles from './ChatAgent.module.css';

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

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

// 더미 응답 데이터 (Gemini 연동 전까지 사용)
const DUMMY_RESPONSES: Record<string, string> = {
    '메뉴': '🪄 저희 메타몽 카페의 인기 메뉴를 알려드릴게요!\n\n☕ **말랑 퍼플 라떼** - ₩7,000\n☕ **꾸덕 콜드브루** - ₩4,500\n🍵 **초록 변신 말차** - ₩6,500\n🍰 **겹겹이 초코 크로와상** - ₩4,800\n\n메뉴 페이지에서 더 많은 메뉴를 확인해보세요! 💜',
    '영업시간': '🕐 메타몽 카페 영업시간 안내\n\n⏰ **매일 09:00 ~ 22:00**\n(연중무휴, 명절 제외)\n\n☕ 라스트 오더는 21:30이에요!\n메타몽이 졸기 전에 와주세요~ 🫠',
    '위치': '📍 메타몽 카페 위치\n\n**서울특별시 강남구 테헤란로 123**\n\n🚇 지하철: 2호선 강남역 3번 출구에서 도보 5분\n🚌 버스: 강남역 정류장 하차\n🚗 주차: 건물 지하 주차장 이용 가능 (2시간 무료)\n\n길 찾기가 어려우시면 메타몽이 변신해서 마중 나갈게요! 🫠',
    '추천': '✨ 오늘의 메타몽 추천 메뉴!\n\n지금 시간대에 딱 맞는 메뉴를 골라봤어요~\n\n🌟 **말랑 퍼플 라떼** - 메타몽의 시그니처!\n달콤한 보라빛 한 잔으로 기분 전환 어떠세요?\n\n🍮 함께 먹으면 좋은 디저트: **겹겹이 초코 크로와상**\n\n메타몽이 정성껏 만들었어요 💜',
    '예약': '📞 예약 안내\n\n현재 예약은 전화로만 가능해요!\n📱 **02-1234-5678**\n\n🎂 생일파티, 단체 예약도 환영합니다!\n메타몽이 특별한 변신 이벤트를 준비해드려요 🎁\n\n✉️ 이메일 문의: hello@dittocafe.kr',
    '이벤트': '🎉 진행 중인 이벤트\n\n1️⃣ **첫 방문 고객** - 오늘의 추천 음료 무료!\n2️⃣ **단골 변신 카드** - 10잔 적립 시 메타몽 특별 음료 증정\n3️⃣ **SNS 인증샷** - 팔로우 + 태그 시 디저트 10% 할인\n\n메타몽이 항상 감사해하고 있어요! 💜🫠',
};

const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    role: 'agent',
    content: '안녕하세요! 🫠 메타몽 카페에 오신 걸 환영해요!\n\n궁금한 게 있으면 편하게 물어보세요~\n메뉴, 영업시간, 위치, 이벤트 등 뭐든 알려드릴게요! 💜',
    timestamp: new Date(),
};

const QUICK_ACTIONS = [
    { label: '☕ 메뉴 추천', keyword: '추천' },
    { label: '🕐 영업시간', keyword: '영업시간' },
    { label: '📍 위치', keyword: '위치' },
    { label: '🎉 이벤트', keyword: '이벤트' },
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
        return '안녕하세요! 🫠💜 메타몽이에요!\n무엇이든 물어봐주세요~';
    }

    // 감사
    if (msg.includes('감사') || msg.includes('고마워') || msg.includes('땡큐')) {
        return '천만에요! 🫠 메타몽은 항상 여기 있어요~\n더 궁금한 게 있으면 언제든 물어봐주세요! 💜';
    }

    // 기본 응답
    return '🤔 음... 메타몽이 아직 잘 모르는 질문이에요!\n\n아래 키워드로 물어보시면 더 잘 도와드릴 수 있어요:\n• **메뉴** - 카페 메뉴 안내\n• **추천** - 오늘의 추천 메뉴\n• **영업시간** - 운영 시간\n• **위치** - 오시는 길\n• **예약** - 예약 안내\n• **이벤트** - 진행 중인 이벤트';
}

export default function ChatAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(1);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

        // =============================================
        // 📌 Gemini API 연동 시 아래 코드로 교체하세요
        // =============================================
        // try {
        //     const res = await fetch('/api/chat', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             message: content.trim(),
        //             history: messages.map(m => ({
        //                 role: m.role === 'agent' ? 'model' : 'user',
        //                 parts: [{ text: m.content }],
        //             })),
        //         }),
        //     });
        //     const data = await res.json();
        //     const agentReply = data.reply;
        // } catch (error) {
        //     console.error('Chat API error:', error);
        //     const agentReply = '죄송해요, 잠시 연결에 문제가 생겼어요. 다시 시도해주세요! 🫠';
        // }
        // =============================================

        // 더미 응답 (1~2초 딜레이로 자연스러움 연출)
        const delay = 800 + Math.random() * 1200;
        setTimeout(() => {
            const agentReply = getDummyResponse(content.trim());

            const agentMessage: Message = {
                id: `agent-${Date.now()}`,
                role: 'agent',
                content: agentReply,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, agentMessage]);
            setIsTyping(false);

            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
        }, delay);
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

    // 간단한 마크다운 볼드 처리
    const renderContent = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div className={`${styles.chatPanel} ${showScrollTop ? styles.shifted : ''}`}>
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
                            <X size={16} />
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
                                <div>
                                    <div
                                        className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleAgent}`}
                                    >
                                        {renderContent(msg.content)}
                                    </div>
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
