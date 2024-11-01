import { useState, useEffect, useRef } from "react";
import { Background } from "../../../../components/background/styled";
import { SecondaryButtonSmall, PrimaryButtonMedium } from "../../../../components/buttons/styled";
import CategoryComponent from "../../../../components/Category";
import { useConfirm } from "../../../../components/confirmPopup";
import QuizProblemsComponent from "../../../../components/quiz";
import { Timer } from "../../../../components/timer/timer";
import { TeamHeaderComponent } from "../../../quiz/components/multi/TeamHeader/TeamHeader";
import { UserTagsComponent } from "../../../quiz/components/multi/UserTags/UserTags";
import { MultiGameBackground, MultiGameAttackContainer, MutliGameAttackTimerWrap, MultiGameAttackTimer, MultiGameAttackTimerText, MultiGameAttackQuizContainer, MultiGameAttackQuizWrap, MultiGameAttackQuiz, MultiGameAttackQuizCheckbox, MultiGameAttackButtonWrap } from "./styled";
import { Quiz } from "../../../../types/quiz";

interface AttackPageProps {
    onSelectionComplete: (quiz: Quiz) => void;
}

export default function AttackPage({ onSelectionComplete }: AttackPageProps) {
    const [teamId, setTeamId] = useState(1);
    const [isAttackTeam, setIsAttackTeam] = useState(true);
    const customConfirm = useConfirm(); 
    const [timeLeft, setTimeLeft] = useState(60);
    const [quizData, setQuizData] = useState<Quiz[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("OS");
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
    const fetchCalled = useRef(false); // API 중복 호출 방지용 ref

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else {
            handleSelectionComplete();
        }
    }, [timeLeft]);

    const handleLeaveRoom = async () => {
        const confirmed = await customConfirm("정말 나가시겠습니까?");
        if (confirmed) {
            console.log("나감");  // TODO: 방 나감
        }
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            if (fetchCalled.current) return; // 이미 호출된 경우 실행하지 않음
            fetchCalled.current = true;

            const userAccessToken = localStorage.getItem("AccessToken");
            const userUuid = localStorage.getItem("uuid");
            const API_URL = "/api/quiz/multi/random-quizzes/categories";

            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${userAccessToken}`,
                        "uuid": `${userUuid}`,
                        "Accept": "application/json"
                    }
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setQuizData(responseData.data.randomQuizList);

                    const osQuizzes = responseData.data.randomQuizList.filter((quiz: any) => quiz.categoryType === "OS");
                    if (osQuizzes.length > 0) {
                        setSelectedQuizId(osQuizzes[0].quizId);
                    }
                } else {
                    console.error("Failed to fetch quiz data:", response.status);
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            }
        };

        fetchQuizData();
    }, []);

    const filteredQuizData = quizData.filter(quiz => quiz.categoryType === selectedCategory).slice(0, 2);

    const handleSelectionComplete = () => {
        const selectedQuiz = quizData.find(quiz => quiz.quizId === selectedQuizId);
        if (selectedQuiz) {
            onSelectionComplete(selectedQuiz); // 상위 컴포넌트에 선택된 문제 전달
        }
    };

    return (
        <Background>
            <MultiGameBackground>
                <TeamHeaderComponent teamId={teamId} isAttackTeam={isAttackTeam} />
                <MultiGameAttackContainer>
                    <MutliGameAttackTimerWrap>
                        <Timer />
                        <MultiGameAttackTimer>{timeLeft}초&nbsp;</MultiGameAttackTimer>
                        <MultiGameAttackTimerText>남았습니다!!</MultiGameAttackTimerText>
                    </MutliGameAttackTimerWrap>
                    <MultiGameAttackQuizContainer>
                        <CategoryComponent onSelectCategory={setSelectedCategory} />
                        <MultiGameAttackQuizWrap>
                            {filteredQuizData.map((quiz, index) => (
                                <MultiGameAttackQuiz key={quiz.quizId}>
                                    <MultiGameAttackQuizCheckbox 
                                        src={quiz.quizId === selectedQuizId ? "/icons/checkbox_filled.svg" : "/icons/checkbox_base.svg"}
                                        onClick={() => setSelectedQuizId(quiz.quizId)}
                                    />
                                    <QuizProblemsComponent quiz={quiz} />
                                </MultiGameAttackQuiz>
                            ))}
                        </MultiGameAttackQuizWrap>
                    </MultiGameAttackQuizContainer>
                    <MultiGameAttackButtonWrap>
                        <SecondaryButtonSmall onClick={handleLeaveRoom}>나가기</SecondaryButtonSmall>
                        <PrimaryButtonMedium onClick={handleSelectionComplete}>선택완료</PrimaryButtonMedium>
                    </MultiGameAttackButtonWrap>
                </MultiGameAttackContainer>
                <UserTagsComponent teamId={teamId}/>
            </MultiGameBackground>
        </Background>
    );
}