import { readFile } from 'fs/promises';
import JSZip from "jszip";

import { PROFILE_LIST, MULTI_PROFILES, dateRounding, gameSort } from './constants.js';
import { fetchProfiles, fetchMatches } from './fetches.js';

async function main() {

    let infoForDebugging = {};

    // Fetching profiles data
    let profiles = [];
    try {
        // Collecting profile info
        profiles = await fetchProfiles(PROFILE_LIST.map(p => p.id));
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }

    // Getting the cache of matches details
    const matchesCachePath = './src/.observablehq/cache/cs2teamdedication/data/data/raw_matches.json';
    let cachedMatches = [];
    try {
        // Attempt to read the file
        const data = await readFile(matchesCachePath);
        cachedMatches = JSON.parse(data);
    } catch (error) {
        // Check if the error is due to the file not existing
        if (error.code === 'ENOENT') {
            // File just doesn't exist yet so we can continue (it will be as there are no cached matches)
        } else {
            // Handle other possible errors
            console.error('Error reading cached matches:', error);
        }
    }

    // Calculating the matches we have yet to retrieve
    const allPlayedMatches = [...new Set(profiles.map(p => [...p.games.map(g => g.gameId)]).flat())];
    const matchesToRetrieve = allPlayedMatches
                                    .filter(f => !cachedMatches.map(m => m.id).includes(f))
                                    .filter(f => f.length > 30)

    infoForDebugging = {...infoForDebugging, profiles, allPlayedMatches, matchesToRetrieve};

    // Fetching matches
    let retrievedMatches = [];
    try {
        // Collecting profile info
        retrievedMatches = await fetchMatches(matchesToRetrieve);
    } catch (error) {
        console.error('Error fetching matches:', error);
    }

    const matches = [...cachedMatches, ...retrievedMatches];

    infoForDebugging = {...infoForDebugging, numCachedMatches: cachedMatches.length, numRetrievedMatches: retrievedMatches.length};

    ////
    //  Data tuning
    ////

    // Pruning matches dataframe
    const matchesBaseDF = matches.map(match => ({
        ...match,
        sessionDate: dateRounding(match.createdAt),
        numTeamMembers: match.playerStats.filter(f => profiles.map(p => p.meta.steam64Id).includes(f.steam64Id)).length,
        playerStats: match.playerStats.map(playerStat => ({...playerStat, isTeamMember: profiles.map(p => p.meta.steam64Id).includes(playerStat.steam64Id)}))
    }))
    .sort(gameSort("createdAt"))
    
    // Pruning profiles dataframe
    const profilesBaseDF = profiles
                            .filter(profile => !Object.keys(MULTI_PROFILES).includes(profile.meta.name))
                            .map(profile => ({
                                name: profile.meta.name ?? PROFILE_LIST.find(f => f.id == profile.meta.steam64Id).altname,
                                id: profile.meta.steam64Id,
                                avatar: profile.meta.steamAvatarUrl,
                                recentRatings: profile.recentGameRatings,
                                personalBestsCS2: profile.personalBestsCs2,
                                games: profile.games
                            }))

    // Profile-match relations, considering multi profiles
    const profileBaseWithMatches = profilesBaseDF
                            .map(profile => ({ // Listing all profiles that belong to this same profile (multi-profiles)/
                                ...profile,
                                allProfiles: [ 
                                    {id: profile.id, name: profile.name},
                                    ...Object.entries(MULTI_PROFILES)
                                        .filter(([extraprofile, mainprofile]) => mainprofile == profile.name)
                                        .map(([extraprofile, mainprofile]) => ({name: extraprofile, id: PROFILE_LIST.find(f => f.altname == extraprofile).id}))
                                ],
                            }))
                            .map(profile => ({ // Populating with match details
                                ...profile,
                                games: 
                                    matchesBaseDF
                                        .filter(match => profile.allProfiles.some(ap => match.playerStats.some(player => player.steam64Id == ap.id))) // Checking if player was in match
                                        .map(match => ({
                                            ...match,
                                            profilePlayerStats: match.playerStats.find(player => profile.allProfiles.some(ap => player.steam64Id == ap.id))
                                        }))
                            }))

    // Building the team matches DF
    const teamMatchesDF = matchesBaseDF.map(match => ({
        profile: "Team",
        ...match
    }))

    infoForDebugging = {...infoForDebugging, profilesBaseDF, profileBaseWithMatches, teamMatchesDF};

    // Output a ZIP archive to stdout.
    const zip = new JSZip();
    zip.file("infoForDebugging.json", JSON.stringify(infoForDebugging, null, 2)); // Used for debugging this data loader
    zip.file("profiles_matches.json", JSON.stringify(profileBaseWithMatches, null, 2));
    zip.file("team_matches.json", JSON.stringify(teamMatchesDF, null, 2));
    zip.file("raw_profiles.json", JSON.stringify(profiles, null, 2));
    zip.file("raw_matches.json", JSON.stringify(matches, null, 2));
    zip.generateNodeStream().pipe(process.stdout);
    
}

main().catch(err => console.error('An error occurred:', err));
