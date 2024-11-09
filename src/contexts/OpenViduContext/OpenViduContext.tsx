import { createContext, useState, useRef, ReactNode } from "react";
import { OpenVidu, Session, Subscriber, Publisher } from "openvidu-browser";

interface OpenViduContextType {
    session: Session | null;
    publisher: Publisher | null;
    subscribers: Subscriber[];

    joinRoom: (sessionid: string, token: any , roomUserId :string) => void;
    publishStream: () => void;
    unpublishStream: () => void;
}

const OpenViduContext = createContext<OpenViduContextType | null>(null);

interface OpenViduProviderProps {
    children: ReactNode;
}

export const OpenViduProvider = ({ children }: OpenViduProviderProps) => {
    const OV = useRef<OpenVidu | null>(null);
    const [session, setSession] = useState<Session | null>(null); // OpenVidu 세션 객체
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [publisher, setPublisher] = useState<Publisher | null>(null); // 자신의 미디어 퍼블리셔
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]); // 다른 사용자의 미디어 구독자

    // session을 초기화한다.
    const initOpenViduSession = async () => {
        if (OV.current === null) {
            try {
                OV.current = new OpenVidu(); // OpenVidu 인스턴스 생성
                const session = OV.current.initSession(); // 세션 생성

                // 다른 사용자의 스트림이 생성될 때 발생하는 이벤트 핸들러
                session.on("streamCreated", (event) => {
                    const subscriber = session.subscribe(event.stream, undefined); // 스트림 구독
                    setSubscribers((prev) => [...prev, subscriber]); // 구독자를 state에 추가
                });

                session.on('streamDestroyed', (event) => {
                    // 참가자가 나갔을 때 처리
                });

                // 세션 설정 완료, state에 세션 저장
                setSession(session);
            } catch (error) {
                console.error("Failed to initialize session", error);
            }
        }
    };

    const joinRoom = async (sessionid: string, token: any, roomUserId : string) => {
        if (sessionId && token) {
            try {
                // 1. 세션 세팅
                setSessionId(sessionid);

                // 2. 세션 초기화
                await initOpenViduSession();

                // 3. 세션에 연결
                if (session) {
                    await session.connect(token, { userId: roomUserId });
                    // 4. 연결 후 스트림 발행 시작
                    await publishStream();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // 스트림 발행 (음성 채팅 시작)
    const publishStream = async () => {
        if (session && !publisher && OV.current) {
            try {
                const newPublisher = OV.current.initPublisher(undefined, {
                    videoSource: false,      // 비디오 사용 안 함
                    audioSource: undefined,   // 기본 마이크 사용
                    publishAudio: true,      // 오디오 활성화
                    publishVideo: false     // 비디오 비활성화
                });

                // 스트림 발행 시작
                await session.publish(newPublisher);
                setPublisher(newPublisher);

                // 음소거 상태 관리 등 추가 가능
                newPublisher.on('streamPlaying', () => {
                    console.log('내 스트림이 재생 중입니다.');
                });

            } catch (error) {
                console.error('스트림 발행 실패:', error);
            }
        }
    };



    // 스트림 발행 중지 (음성 채팅 중단)
    const unpublishStream = () => {
        if (session && publisher) {
            session.unpublish(publisher);
            setPublisher(null);
        }
    };

    return (
        <OpenViduContext.Provider
            value={{
                session,
                publisher,
                subscribers,
                joinRoom,
                publishStream,   // 음성 채팅 시작
                unpublishStream  // 음성 채팅 중단
            }}
        >
            {children}
        </OpenViduContext.Provider>
    );
}


export { OpenViduContext }