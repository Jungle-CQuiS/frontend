import useButtonSoundEffect from "../../../../../hook/useHoverSoundEffect";
import { QuizTypeProps } from "../../../../../types/quiz";
import {
    SingleModeQuizBoxBottom,
    SingleModeQuizBoxBottomBadImg,
    SingleModeQuizBoxBottomBadText,
    SingleModeQuizBoxBottomBadWrap,
    SingleModeQuizBoxBottomSelect,
    SingleModeQuizBoxBottomSelectContainer,
    SingleModeQuizBoxBottomSelectImg,
    SingleModeQuizBoxBottomSelectWrap,
    SingleModeQuizBoxcontainer,
    SingleModeQuizBoxTitle,
    SingleModeQuizBoxTitleWrap,
    SingleModeQuizBoxUsername,
    SingleModeQuizBoxWrap,
} from "./styled";
import { useState } from "react";

interface SingleModeQuizBoxProps extends QuizTypeProps {
    quizData: {
        username: string;
        name: string;
        choices?: string[];
        quizId: number;
    };
    onChoiceSelect?: (choice: number) => void;
}

export const SingleModeQuizBox = ({ type, quizData, onChoiceSelect }: SingleModeQuizBoxProps) => {
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    useButtonSoundEffect()

    const handleChoiceClick = (index: number) => {
        setSelectedChoice(index);
        onChoiceSelect?.(index + 1);
    };

    const handleDownVote = async () => {
        if (hasVoted) return;

        setHasVoted(true);

        const quizId = quizData.quizId;

        try {
            const response = await fetch("/api/quiz/downvote", {  //미완성(백엔드 api 수정)
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
                    "RefreshToken": `${localStorage.getItem("RefreshToken")}`,
                },
                body: JSON.stringify({
                    quizId: quizId,
                }),
            });
            const result = await response.json();
            if (response.ok) {
            }
        } catch (error) {
            console.error("Error during vote:", error);
        }
    }

    const renderChoices = () => {
        return quizData.choices?.map((choice, index) => (
            <SingleModeQuizBoxBottomSelectWrap className="click-sound" key={index} onClick={() => handleChoiceClick(index)}>
                <SingleModeQuizBoxBottomSelectImg
                    src={selectedChoice === index ? "/icons/checkbox_filled.svg" : "/icons/checkbox_base.svg"}
                    alt={selectedChoice === index ? "Selected" : "Unselected"}
                />
                <SingleModeQuizBoxBottomSelectImg src={`/icons/number_${index + 1}.svg`} alt={`Option ${index + 1}`} />
                <SingleModeQuizBoxBottomSelect>{choice}</SingleModeQuizBoxBottomSelect>
            </SingleModeQuizBoxBottomSelectWrap>
        ));
    };

    return (
        <SingleModeQuizBoxcontainer>
            <SingleModeQuizBoxWrap>
                <SingleModeQuizBoxTitleWrap>
                    <SingleModeQuizBoxUsername>출제자: {quizData.username}</SingleModeQuizBoxUsername>
                    <SingleModeQuizBoxTitle>{quizData.name}</SingleModeQuizBoxTitle>
                </SingleModeQuizBoxTitleWrap>
                <SingleModeQuizBoxBottom>
                    {type === "객관식" && (
                        <SingleModeQuizBoxBottomSelectContainer>
                            {renderChoices()}
                        </SingleModeQuizBoxBottomSelectContainer>
                    )}
                    <SingleModeQuizBoxBottomBadWrap className="click-sound" onClick={handleDownVote} $hasVoted={hasVoted}>
                        <SingleModeQuizBoxBottomBadImg src={hasVoted ? "/icons/bad_disabled.svg" : "/icons/bad.svg"}/>
                        <SingleModeQuizBoxBottomBadText $hasVoted={hasVoted}>별로에요</SingleModeQuizBoxBottomBadText>
                    </SingleModeQuizBoxBottomBadWrap>
                </SingleModeQuizBoxBottom>
            </SingleModeQuizBoxWrap>
        </SingleModeQuizBoxcontainer>
    );
};