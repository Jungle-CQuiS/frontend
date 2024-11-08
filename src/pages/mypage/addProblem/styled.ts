// styled.ts
import styled from "styled-components";

export const AddProblemContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

export const AddProblemHeader = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
`;

export const AddProblemHeaderImg = styled.img`
    width: 24px;
    height: 24px;
`;

export const AddProblemHeaderTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
`;

export const AddProblemWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const AddProblemCategoryWrap = styled.div`
    display: flex;
    gap: 16px;
`;

export const AddProblemLabel = styled.label`
    font-size: 16px;
    font-weight: 600;
`;

export const AddProblemTab = styled.div<{ isSelected?: boolean }>`
    padding: 8px 19px;
    border: ${({ isSelected }) => (isSelected ? "none" : "1px solid #969696")};
    color: ${({ isSelected }) => (isSelected ? "#FFF" : "#969696")};
    font-size: 13px;
    font-weight: 500;
    border-radius: 4px;
    background-color: ${({ isSelected }) => (isSelected ? "#2F69FF" : "#FFF")};
    cursor: pointer;
`;

export const AddProblemInputLong = styled.textarea`
    padding: 10px 14px;   
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #D3D3D3;
    width: 895px;
    height: 350px;
    border-radius: 8px;
    &::placeholder{
        color: #D3D3D3;
    }
`;

export const AddProblemInput = styled.input`
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #D3D3D3;
    width: 854px;
    border-radius: 8px;
    &::placeholder{
        color: #D3D3D3;
    }
`;

export const AddProblemSelectRow = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

export const AddProblemSelectImg = styled.img`
    width: 24px;
    height: 24px;
`;

export const AddProblemButtonWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-end;
`;

export const CreateQuizNumber = styled.input`
    padding: 10px 4px 10px 14px;
    border: 1px solid #D3D3D3;
    font-size: 12px;
    border-radius: 8px;
    &:hover {
        box-shadow: 0 0px 10px #e6e8f6, 0 5px 5px #e6e8f6;
    }
    &:focus {
        border: 1px solid #2F69FF;
    }
    &::placeholder {
        color: #D3D3D3;
    }
`;

export const CreateQuestion = styled.div`
    padding-top: 500px;
    font-size: 30px;
    font-weight: 600;
`;

export const LoadingQuestionContainer = styled.div`
    position: fixed; // 화면에 고정
  top: 0;
  left: 0;
  width: 100%; // 전체 화면 너비
  height: 100vh; // 전체 화면 높이
  display: flex;
  justify-content: center; // 가로 중앙 정렬
  align-items: center; // 세로 중앙 정렬
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 9999; // 다른 요소들 위에 표시

  // 로티 애니메이션이 들어갈 div 스타일링
  div {
    width: 300px; // 원하는 애니메이션 크기
    max-width: 90%; // 모바일 대응
  }
`;