import { useState } from "react";
import { CreateRoomModal } from "../../components/modal/room";
import { MainPageRefreshButton, MainPageRefreshWrap, MainPageSearchBar, MainPageSearchBarWrap, MainPageTable, MainPageTableThead, MainPageTableTheadTh, MainPageTableTheadTr, MainPageTitleText, MultiBackground, MultiPageTitle, MultiPageTitleIcon } from "./styled";
import { PrimaryButtonMedium } from "../../components/buttons/styled";
import { Background } from "../../components/background/styled";
import RoomList from './roomlist/roomlist';
import useButtonSoundEffect from "../../hook/useHoverSoundEffect";

export default function MultiPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    useButtonSoundEffect();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleDone = () => {
        setIsModalOpen(false);
    };
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <>
            <MultiBackground>
                <MultiPageTitle>
                    <MultiPageTitleIcon src="/icons/mdi_users_black.svg" alt="Multi Icon Black" />
                    <MainPageTitleText>MULTI MODE</MainPageTitleText>
                </MultiPageTitle>
                <MainPageSearchBarWrap>
                    <MainPageSearchBar
                        placeholder="방 이름으로 검색하기"
                        value={searchTerm}
                        onChange={handleSearch}
                        autoComplete="off" />
                        <MainPageRefreshWrap >
                    <MainPageRefreshButton onClick={handleRefresh} src="/icons/refresh.svg" />                
                </MainPageRefreshWrap>
                    <PrimaryButtonMedium onClick={handleOpenModal}>방 만들기</PrimaryButtonMedium>
                </MainPageSearchBarWrap>
            

                    <RoomList searchTerm={searchTerm} />
            </MultiBackground>
            <CreateRoomModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onDone={handleDone}
            />
        </>
    )
}