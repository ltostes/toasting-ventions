---
style: toasting-foot24/style.css
---

# Toasting Foot 24

```js
const matches = FileAttachment("toasting-foot24/data/matches.json").json();
```

```js
const lastXRoundsFilter = 3;
const all_matches = matches[0];

const round_fun = (d) => d.roundInfo.round;

const filteredMatches = all_matches.filter(
    (f) => d3.max(all_matches, round_fun) - lastXRoundsFilter < round_fun(f)
  );

const sortedMatches = d3.sort(filteredMatches, (d) => -d.roundInfo.round);

const matches_by_round =  d3.group(sortedMatches, (d) => `${d.roundInfo.round}ª Jornada`);
```
```js
renderPannel(matches_by_round, "Test")
```

```js
function teamNameColoring({primary, secondary, text}) {
  return {primary, text: text != primary ? text : 'white'}
}

function renderPannel(matches, title) {
  const pannel = d3.create("div").attr("class", "panel");

  const windowTitle = pannel
    .append("div")
    .style("width", d => `${width - 11}px`)
    .classed("window-title", true)
    .text(title)
    .append("span")
    .classed("close-icon", true)
    .text("x")

  const leagues = pannel
    .selectAll("div.league")
    .data(matches)
    .join("div")
    .classed("league", true);

  const leagueHeader = leagues
    .append("span")
    .classed("league-title", true)
    .text((d) => d[0]);

  const gamesList = leagues
    .append("div")
    .classed("games-list", true)
    .datum((d) => d[1]);

  // Each game
  const gameContainer = gamesList
    .selectAll("div.game")
    .data((d) => d)
    .join("div")
    .classed("game-container", true);

  // Home
  const homeTeamName = gameContainer
    .append("span")
    .classed("team-name home", true)
    .text((d) => d.homeTeam.name.toUpperCase())
    .style(
      "background-color",
      (d) => teamNameColoring(d.homeTeam.teamColors).primary
    )
    .style("color", (d) => teamNameColoring(d.homeTeam.teamColors).text);

  const homeTeamScore = gameContainer
    .append("span")
    .classed("team-score home", true)
    .text((d) => d.homeScore.current || 0);

  const scoreSeparator = gameContainer
    .append("span")
    .classed("team-score score-separator", true)
    .text("");

  // Away
  const awayTeamScore = gameContainer
    .append("span")
    .classed("team-score away", true)
    .text((d) => d.awayScore.current || 0);

  const awayTeamName = gameContainer
    .append("span")
    .classed("team-name away", true)
    .text((d) => d.awayTeam.name.toUpperCase())
    .style(
      "background-color",
      (d) => teamNameColoring(d.awayTeam.teamColors).primary
    )
    .style("color", (d) => teamNameColoring(d.awayTeam.teamColors).text);

  return pannel.node();
}
```
