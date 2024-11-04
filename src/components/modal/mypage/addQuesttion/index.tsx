// AddProblemModal.tsx
import { IModalProps, Modal } from "../..";
import { CreateQuistionModalButtonWrap, CreateQuistionModalContainer, CreateQuistionModalTitle, CreateQuiz, CreateQuizCheckbox, CreateQuizContainer, CreateQuizWrap } from "./styled";
import { BlackButtonSmall } from "../../../buttons/styled";
import { useEffect, useState } from "react";
import { Quiz } from "../../../../types/quiz";

interface CreateQuizProps {
    quizData: Quiz[];
    selectedTopic: string;
    selectedType: string;
    onClose: () => void;
    onDone: () => void;
}

export const AddProblemModal = ({
    quizData,
    selectedTopic,
    selectedType,
    onClose,
    onDone,
    ...props
}: IModalProps & CreateQuizProps) => {
    const [selectedProblems, setSelectedProblems] = useState<Quiz[]>([]);

    useEffect(() => {
        if (props.open) {
            setSelectedProblems([]); // 모달이 열릴 때 선택 초기화
        }
    }, [props.open]);

    const handleQuizSelection = (quiz: Quiz) => {
        if (selectedProblems.some(q => q.quizName === quiz.quizName)) {
            setSelectedProblems(selectedProblems.filter(q => q.quizName !== quiz.quizName));
        } else {
            setSelectedProblems([...selectedProblems, quiz]);
        }

        console.log("Updated selectedProblems:", selectedProblems);
    };

    const handleSubmitQuiz = async () => {
        const userAccessToken = localStorage.getItem("AccessToken");
        const userUuid = localStorage.getItem("uuid");
        const API_URL = selectedType === "객관식" ? "/api/util/quiz-insertion/multiple-choice/multiple" : "/api/util/quiz-insertion/short-answer/multiple";
        console.log("Submitting selected problems:", selectedProblems);

        try {
            for (const quiz of selectedProblems) {
                const body = selectedType === "객관식" ? {
                    category: selectedTopic,
                    name: quiz.quizName,
                    type: selectedType,
                    choice1: quiz.choice1,
                    choice2: quiz.choice2,
                    choice3: quiz.choice3,
                    choice4: quiz.choice4,
                    answer: quiz.answer
                } : {
                    category: selectedTopic,
                    name: quiz.quizName,
                    type: selectedType,
                    englishAnswer: quiz.englishAnswer,
                    koreanAnswer: quiz.koreanAnswer
                };

                console.log("Request payload:", body);

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${userAccessToken}`,
                        "uuid": `${userUuid}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    console.error("Failed to submit quiz data:", response.status);
                }
            }

            alert("문제 제출이 완료되었습니다!");
            onDone();
        } catch (error) {
            console.error("Error submitting quiz data:", error);
            alert("문제 제출 중 오류가 발생했습니다.");
        }
    };

    return (
        <Modal {...props} open={props.open} onClose={onClose} onDone={onDone}>
            <CreateQuistionModalContainer>
                <CreateQuistionModalTitle>생성된 문제 보기</CreateQuistionModalTitle>
                <div>선택된 주제: {selectedTopic}</div>
                <div>선택된 문제 유형: {selectedType}</div>
                <div>출제하고 싶은 문제를 선택해주세요! (중복가능)</div>
                <CreateQuizContainer>
                    <CreateQuizWrap>
                        {quizData.map((quiz) => (
                            <CreateQuiz key={quiz.quizName}>
                                <CreateQuizCheckbox
                                    src={selectedProblems.some(q => q.quizName === quiz.quizName) ? "/icons/checkbox_filled.svg" : "/icons/checkbox_base.svg"}
                                    onClick={() => handleQuizSelection(quiz)}
                                />
                                <div>
                                    {selectedType === "객관식" ? (
                                        <>
                                            {quiz.quizName}
                                            <div>1) {quiz.choice1}</div>
                                            <div>2) {quiz.choice2}</div>
                                            <div>3) {quiz.choice3}</div>
                                            <div>4) {quiz.choice4}</div>
                                            <div>정답: {quiz.answer}</div>
                                        </>
                                    ) : (
                                        <>
                                            {quiz.quizName}
                                            <div>정답: {quiz.koreanAnswer}</div>
                                        </>
                                    )}
                                </div>
                            </CreateQuiz>
                        ))}
                    </CreateQuizWrap>
                </CreateQuizContainer>
                <CreateQuistionModalButtonWrap>
                    <BlackButtonSmall onClick={handleSubmitQuiz}>제출하기</BlackButtonSmall>
                    <BlackButtonSmall onClick={onClose}>닫기</BlackButtonSmall>
                </CreateQuistionModalButtonWrap>
            </CreateQuistionModalContainer>
        </Modal>
    );
}