import styled from "styled-components";
import { defaultTransition } from "../../css";

export const MultiPageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 32px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 32px;
  padding-top: 32px;
  background-image: url('/images/game-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

export const MultiPageTitle = styled.div`
    display: flex;
    gap: 10px;
`;

export const MultiPageTitleIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const MainPageTitleText = styled.div`
    font-size: 18px;
    font-weight: 700;
`;

export const MainPageSearchBarWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const MainPageSearchBar = styled.input`
    padding: 10px 14px;
    width: 1204px;
    border: 1px solid #D3D3D3;
    font-size: 12px;
    border-radius: 8px;
    ${defaultTransition}
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

export const MainPageTable = styled.table`
    width: 1336px;
    border-collapse: collapse;
`;

export const MainPageTableThead = styled.thead`

`;

export const MainPageTableTheadTr = styled.tr`
    border-bottom: 1px solid #969696;
`;

export const MainPageTableTheadTh = styled.th`
    color: #969696;
    font-size: 14px;
    font-weight: 700;
    padding: 12px 40px;
    &:first-child{
        width: 1050px;
        text-align: left;
    }
    &:nth-child(2){
        width: 48px;
        text-align: right;
    }
    &:nth-child(3){
        width: 61px;
        text-align: right;
    }
`;

export const MainPageTableTbody = styled.tbody`
    cursor: pointer;
`;

export const MainPageTableTbodyTr = styled.tr`
  &:nth-child(odd) {
    background-color: #F6F8FC;
  }
  &:nth-child(even) {
    background-color: #FFFFFF; 
  }
  &:hover {
      background-color: #E9EBF0; 
    }
  ${defaultTransition}
`;

export const MainPageTableTbodyTd = styled.td`
    padding: 12px 40px;
    font-size: 14px;
    font-weight: 600;
    &:first-child{
        width: 1050px;
        text-align: left;
    }
    &:nth-child(2){
        width: 48px;
        text-align: right;
    }
    &:nth-child(3){
        width: 61px;
        text-align: right;
    }
`;

export const MainPageTableTbodyIcon = styled.img`
    width: 20px;
    height: 20px;
`;