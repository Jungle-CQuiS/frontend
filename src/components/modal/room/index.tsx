import { useState } from "react"
import { Modal, IModalProps } from ".."
import { PrimaryButtonMedium, SecondaryButton } from "../../buttons/styled"
import { ModalTitle, ModalTitleIcon, ModalTitleWrap } from "../styled"
import { CreateRoomModalRow, CreateRoomModalLabel, CreateRoomModalInput, CreateRoomModalButtonWrap, CreateRoomModalRowContainer, CreateRoomModalNumber, CreateRoomModalNumberInfo, CreateRoomModalNumberInfoImg, CreateRoomModalNumberInfoText, CreateRoomModalPasswordCheckbox, CreateRoomModalPasswordInput, CreateRoomModalPasswordRow, CreateRoomModalPasswordWrap, CreateRoomModalText, CreateRoomModalNumberWrap, CreateRoomModalBodyWrap } from "./styled"


export const CreateRoomModal = ({
    ...props
}: IModalProps) => {
    const [value, setValue] = useState(4);
    const [isPasswordChecked, setIsPasswordChecked] = useState(false);
    const [isNoPasswordChecked, setIsNoPasswordChecked] = useState(true);

    const handleNoPasswordCheckbox = () => {
        setIsNoPasswordChecked(true);
        setIsPasswordChecked(false);
    }

    const handlePasswordCheckbox = () => {
        setIsPasswordChecked(true);
        setIsNoPasswordChecked(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.target.value));
    };

    //TODO: 방 만들기
    const handleCreateRoom = async () => {
        const userUuid = localStorage.getItem("uuid");
        const roomName = (document.getElementById("roomName") as HTMLInputElement).value;
        const roomPassword = (document.getElementById("password") as HTMLInputElement).value;
        const participants = Number((document.getElementById("participants") as HTMLInputElement).value);

        if(!roomName){
            alert("방 이름을 입력하지 않았습니다. 입력해주세요.");
            return;
        }
        // 비번 체크 됐지만 입력이 없을 때 경고창
        if(isPasswordChecked){
            if(!roomPassword){
                alert("비밀번호를 입력해주세요.");
                return;
            }

            const roomPasswordStr = roomPassword;

            // 숫자인지 확인
            const isNumber = /^\d+$/.test(roomPasswordStr);
            if(!isNumber){
                alert("숫자를 입력하세요.");
                return;
            }

            if(roomPasswordStr.length < 4 || roomPasswordStr.length > 12){
                alert("4자리 이상 12자리 미만의 숫자를 입력하세요.");
                return;
            }
        }

        const roomData = {
            name: roomName,
            password: isPasswordChecked? roomPassword: null,
            maxUser: participants,
            uuid: userUuid,
        };

        try {
            const response = await fetch("/quiz/multi/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(roomData),
            });

            if(!response.ok){
                throw new Error("방 생성에 실패하였습니다.");
            }

            const responseData = await response.json();
            console.log("성공");
            moveToWaitingRoom(responseData.roomId);
        }
        catch (error){
            console.error("방 생성 에러", error);
            alert("방을 생성하지 못했습니다. 잠시후 다시 시도해주세요.")
        }
    };   
    
    const moveToWaitingRoom = (roomId: number) => {
        window.location.href= `/quiz/multi/rooms/join/{roomId}`;
    };


    return(
        <Modal {...props} >
            <ModalTitleWrap>
                <ModalTitleIcon src="/icons/mdi_users_black.svg" alt="Create Room Icon"/>
                <ModalTitle>MULTI MODE</ModalTitle>
            </ModalTitleWrap>
            <CreateRoomModalBodyWrap>
                <CreateRoomModalRow>
                    <CreateRoomModalLabel>방이름</CreateRoomModalLabel>
                    <CreateRoomModalInput id="roomName" placeholder="방 이름을 입력해주세요"/>
                </CreateRoomModalRow>
                <CreateRoomModalRowContainer>
                    <CreateRoomModalRow>
                        <CreateRoomModalLabel>비밀번호</CreateRoomModalLabel>
                        <CreateRoomModalPasswordWrap>
                            <CreateRoomModalPasswordRow onClick={handleNoPasswordCheckbox}>
                                <CreateRoomModalPasswordCheckbox 
                                src={isNoPasswordChecked ? "/icons/checkbox_filled.svg" : "/icons/checkbox_base.svg"} 
                                alt="Checkbox No Password"/>
                                <CreateRoomModalText>사용안함</CreateRoomModalText>
                            </CreateRoomModalPasswordRow>
                            <CreateRoomModalPasswordRow onClick={handlePasswordCheckbox}>
                                <CreateRoomModalPasswordCheckbox 
                                src={isPasswordChecked ? "/icons/checkbox_filled.svg" : "/icons/checkbox_base.svg"} 
                                alt="Checkbox Use Password"/>
                                <CreateRoomModalPasswordInput  
                                disabled={!isPasswordChecked} id="password" placeholder="4자리 이상 숫자를 입력해주세요"/>
                            </CreateRoomModalPasswordRow>
                        </CreateRoomModalPasswordWrap>
                    </CreateRoomModalRow>
                    <CreateRoomModalRow>
                        <CreateRoomModalLabel>인원</CreateRoomModalLabel>
                        <CreateRoomModalNumberWrap>
                            <CreateRoomModalNumber
                                type="number"
                                id="participants"
                                name="participants"
                                min="4" 
                                max="10"
                                value={value}
                                onChange={handleChange}/>
                            <CreateRoomModalNumberInfo>
                                <CreateRoomModalNumberInfoImg src="/icons/info.svg" alt="Info Icon"/>
                                <CreateRoomModalNumberInfoText>최대 10명까지 입장할 수 있습니다.</CreateRoomModalNumberInfoText>
                            </CreateRoomModalNumberInfo>
                        </CreateRoomModalNumberWrap>
                    </CreateRoomModalRow>
                </CreateRoomModalRowContainer>
                <CreateRoomModalButtonWrap>
                    <SecondaryButton onClick={props.onClose}>취소하기</SecondaryButton>
                    <PrimaryButtonMedium onClick={handleCreateRoom}>방만들기</PrimaryButtonMedium>
                </CreateRoomModalButtonWrap>
            </CreateRoomModalBodyWrap>
        </Modal>
    )
}

