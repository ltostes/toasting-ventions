
export const profileFeatures = ['name','avatar'];
export const gameFeatures = ['finishedAt', 'numTeamMembers','profilePlayerStats'];

export function lean_profileBaseWithMatches(profile) {
    return ({
        ...Object.assign({},...profileFeatures.map(pf => ({[pf]: profile[pf]}))),
        games: profile.games.map(game => ({
            ...Object.assign({},...gameFeatures.map(gf => ({[gf]: game[gf]}))),
        }))
    })
}