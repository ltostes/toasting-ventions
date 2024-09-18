export function MatchContainer({
        homeTeamName,
        homeTeamScore,
        awayTeamName,
        awayTeamScore,
        currentObs
    }) {
        return (
            <div className="game-container">
                <span className="team-name home" style="background-color: rgb(255, 0, 0); color: rgb(0, 0, 0);">{homeTeamName}</span>
                <span className="team-score home">{homeTeamScore}</span>
                <span className="team-score score-separator"></span>
                <span className="team-score away">{awayTeamScore}</span>
                <span className="team-name away" style="background-color: rgb(255, 255, 0); color: rgb(0, 0, 0);">{awayTeamName}</span>
            </div>
        )
}

export function GamesSection({
    title,
    matches
}) {

    return (
        <div>test</div>
    )
}
