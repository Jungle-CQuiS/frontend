import { useState } from "react";
import { HealthBarUnit, SolvingHeaderContainer, SolvingHeaderTitle, SolvingHeaderTitleWrap, TeamOneHealthBarContainer, TeamOneHealthBarText, TeamOneHealthBarTop, TeamOneHealthBarTopBackground, TeamOneHealthBarTopTitle, TeamOneHealthBarWrap, TeamTwoHealthBarContainer, TeamTwoHealthBarText, TeamTwoHealthBarTop, TeamTwoHealthBarTopBackground, TeamTwoHealthBarTopTitle, TeamTwoHealthBarWrap } from "./styled"
import { useTeamState } from "../../../../../contexts/TeamStateContext/useTeamState";
export const SolvingHeaderComponent = () => {
    const { teamOneHealth, teamTwoHealth } = useTeamState();

    const renderHealthBar = (health: number, team: number, reverse: boolean = false) => {
        const totalHealth = 3;
        const healthBars = Array.from({ length: totalHealth }).map((_, index) => (
          <HealthBarUnit
            key={index}
            active={index < health}
            team={team}
          />
        ));

        return reverse ? healthBars.reverse() : healthBars;
    };
 
    return(
        <SolvingHeaderContainer>
            <TeamOneHealthBarContainer>
                <TeamOneHealthBarTop>
                    <TeamOneHealthBarTopBackground></TeamOneHealthBarTopBackground>
                    <TeamOneHealthBarTopTitle>1팀</TeamOneHealthBarTopTitle>
                </TeamOneHealthBarTop>
                <TeamOneHealthBarWrap>
                    <TeamOneHealthBarText>{teamOneHealth}/3</TeamOneHealthBarText>
                    <div>{renderHealthBar(teamOneHealth, 1)}</div>
                </TeamOneHealthBarWrap>
            </TeamOneHealthBarContainer>
            <SolvingHeaderTitleWrap>
                <SolvingHeaderTitle>OS</SolvingHeaderTitle>
            </SolvingHeaderTitleWrap>
            <TeamTwoHealthBarContainer>
                <TeamTwoHealthBarTop>
                    <TeamTwoHealthBarTopTitle>2팀</TeamTwoHealthBarTopTitle>
                    <TeamTwoHealthBarTopBackground></TeamTwoHealthBarTopBackground>
                </TeamTwoHealthBarTop>
                <TeamTwoHealthBarWrap>
                    <div>{renderHealthBar(teamTwoHealth,2, true)}</div>
                    <TeamTwoHealthBarText>{teamTwoHealth}/3</TeamTwoHealthBarText>
                </TeamTwoHealthBarWrap>
            </TeamTwoHealthBarContainer>
        </SolvingHeaderContainer>
    )
}