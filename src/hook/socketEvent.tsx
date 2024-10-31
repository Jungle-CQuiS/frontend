import { Client } from '@stomp/stompjs';
import { TeamUser } from '../modules/room/components/TeamUser';
import { SOCKET_DESTINATIONS } from '../config/websocket/constants';
import { UserControlKickBtn } from '../components/modal/room/usercontrol/styled';
import React from 'react';


export const socketEvents = {
    // SUBSCRIBE ------------------------------------------------------------------------------------
    // 방 정보 구독 함수
    subscribeToRoom: (client: Client, roomId: string, updateTeams: (users: TeamUser[]) => void) => {
        try {
            console.log('Attempting to subscribe to room:', roomId);
            const subscription = client.subscribe(
                SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SUBSCRIBE.ROOM_INFO(roomId),
                (message) => {
                    console.log('Received message:', message);
                    try {
                        interface ServerUser {
                            roomUserId: number;  // string이 아닌 number
                            username: string;
                            honorCount: number;
                            role: string;
                            team: string;
                            isLeader: boolean;
                            isReady: boolean;
                        }

                        const response = JSON.parse(message.body);

                        console.log(response);

                        const teamUsers: TeamUser[] = response.usersData.map((user: ServerUser) => ({
                            id: user.roomUserId,
                            name: user.username,
                            honor: user.honorCount,
                            profileImage: "/images/profile_image.png",
                            role: user.role,
                            team: user.team,
                            isLeader: user.isLeader ? 'leader' : 'member', // bool?
                            state: user.isReady ? 'ready' : 'notready'// bool?
                        }));

                        console.log(teamUsers);
                        updateTeams(teamUsers);
                    } catch (err) {
                        console.error('Error processing message:', err);
                    }
                }
            );
            console.log('Subscription successful:', subscription);
        } catch (err) {
            console.error('Subscription error:', err);
        }
    },

    // 유저 roomUserId 구독 함수
    subscribeRoomUserId: (client: Client, uuid: string, setRoomUserID: (roomUid: string) => void) => {
        try {
            console.log('Attempting to subscribe to roomUserId:', uuid);
            const subscription = client.subscribe(
                `/user/${uuid}/queue/rooms/join`,
                (message) => {
                    console.log('구독 메시지 받음:', message);
                    console.log('메시지 본문:', message.body);
                    try {
                        const response = JSON.parse(message.body);
                        console.log('파싱된 데이터:', response);
                        setRoomUserID(response.data.roomUserId);

                    } catch (err) {
                        console.error('Error processing message:', err);
                    }
                });
            console.log('Subscription successful:', subscription);
        } catch (err) {
            console.error('Subscription error:', err);
        }
    },

    // 준비방 상태 구독 함수
    subscribeRoomStatusMessage: (client: Client, roomId: string, setUseGameState: (event: string, time: number) => void) => {
        try {
            console.log('Attempting to subscribe to room:', roomId);
            // client에 구독 요청
            const subscription = client.subscribe(
                SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SUBSCRIBE.READY_STATUS(roomId),
                (message) => {
                    console.log('Received message:', message);
                    try {
                        const response = JSON.parse(message.body);
                        if (response.data.isAllReady) {
                            console.log('All user are ready');
                            setUseGameState("READY_STATUS", 5);
                        }
                    } catch (err) {
                        console.error('Error processing message:', err);
                    }
                });
            console.log('Subscription successful:', subscription);

        } catch (err) {
            console.error('Subscription successful:', err);
        }
        // message를 받는다.
        /*
        {
            "data": {
                "isAllReady": 1 or 0(bool)
                },
                "message": 성공,
                "code": S001
            }
        
        */
        // setUseGameState(response.data.message)
        // 게임이 시작되면 구독 해지도 해야함.
    },

    // ----------------------------------------------------------------------------------------------

    // APP ( room enter )---------------------------------------------------------------------------
    // 유저 방 입장 알림 함수
    sendJoinMessage: (client: Client, roomId: string) => {
        if (!client.active) {
            throw new Error('No active connection');
        }
        const uuid = localStorage.getItem("uuid");

        const destination = SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.JOIN;
        const message = {
            uuid: uuid, // 수정 요!

            roomId: roomId,
        };

        console.log('Sending message:', {
            destination,
            message
        });

        client.publish({
            destination,
            body: JSON.stringify(message)
        });
    },

    // 유저 방 입장 함수
    enterRoom: async (
        stompClient: React.RefObject<Client>,
        roomId: string,
    ) => {
        try {
            // 입장 메시지 전송만 담당
            if (stompClient.current) {
                socketEvents.sendJoinMessage(stompClient.current, roomId);
                console.log('Join message sent successfully');
            }
        } catch (error) {
            console.error('Enter room error:', error);
            throw error;
        }
    },
    //-----------------------------------------------------------------------------------------------

    // APP ( state change )--------------------------------------------------------------------------
    // FIXME: 유저 준비 상태 변경 함수 형변환 문제가 있어서 수정필요
    updateUserState: async (
        stompClient: React.RefObject<Client>,
        roomId: string,
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            console.log(roomUserId, "user change state");

            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.READY,
                body: JSON.stringify({
                    "roomUserId": roomUserId,
                    "roomId": `${roomId}`
                })
            });
        } catch (error) {
            console.error('Update UserState error:', error);
            throw error;
        }
    },
    // -----------------------------------------------------------------------------------------------

    // APP ( action ) --------------------------------------------------------------------------------
    // FIXME: 유저 팀 변경 함수
    changeUserTeam: async (
        stompClient: React.RefObject<Client>,
        roomId: string,
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            console.log(roomUserId, "user change team");
            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.TEAMSWITCH,
                body: JSON.stringify({
                   "roomUserId": roomUserId,
                    "roomId": `${roomId}`
                })
            });

        } catch (error) {

        }
    },

    // FIXME: 유저 방 나가기 함수.
    userExitRoom: async (
        stompClient: React.RefObject<Client>,
        roomUserId: string,
        roomId: string
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            console.log(roomUserId, "user Exit");
            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.EXIT,
                body: JSON.stringify({
                   "roomUserId": roomUserId,
                    "roomId": `${roomId}`
                })
            });

        } catch (error) {

        }
    },


    // FIXME: 유저 강퇴하기(방장 권한)
    userKick: async (
        stompClient: React.RefObject<Client>,
        kickRoomUserId: string,
        roomId: string
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.KICK,
                body: JSON.stringify({
                    "roomUserId": roomUserId,
                    "kickRoomUserId": `${kickRoomUserId}`,
                    "roomId": `${roomId}`
                })
            });
        } catch (error) {

        }
    },
    // FIXME: 방장 위임하기(방장 권한)
    handOverHost: async (
        stompClient: React.RefObject<Client>,
        yieldUserId: string,
        roomId: string
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.YIELDLEADER,
                body: JSON.stringify({
                    "roomUserId": roomUserId,
                    "roomId": `${roomId}`,
                    "yieldUserId": `${yieldUserId}`
                })
            });
        } catch (error) {

        }
    },

    // FIXME: 리더 위임하기(리더 권한)
    handOverLeader: async (
        stompClient: React.RefObject<Client>,
        yieldUserId: string,
        roomId: string
    ) => {
        try {
            if (!stompClient.current?.active) {
                console.error('STOMP connection is not active');
                return;
            }
            const roomUserId = localStorage.getItem("roomUserId");
            stompClient.current.publish({
                destination: SOCKET_DESTINATIONS.QUIZ_MULTI.ROOMS.SEND.YIELDLEADER,
                body: JSON.stringify({
                    "roomUserId": roomUserId,
                    "roomId": `${roomId}`,
                    "yieldUserId": `${yieldUserId}`
                })
            });
        } catch (error) {

        }
    }



};