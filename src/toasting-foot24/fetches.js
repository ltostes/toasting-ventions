import fetch from 'node-fetch';

// API Secret
import { config } from 'dotenv';
config();
const FOOTAPI_SECRET = process.env.FOOTAPI_SECRET;

export async function fetchDateMatches(date) {

    const day = date.getDate();
    const month = date.getMonth() + 1; // +1 since this method is zero-based
    const year = date.getFullYear();
    
    const url = `https://footapi7.p.rapidapi.com/api/matches/${day}/${month}/${year}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': FOOTAPI_SECRET,
            'x-rapidapi-host': 'footapi7.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);
      return result
    } catch (error) {
        console.error(error);
  }
}

export async function fetchSeasonLastMatches({ tournamentId, seasonId, name }) {
    let allData = [];
    let nextPage = true;
    let pageNum = 0;
  
    const url = `https://footapi7.p.rapidapi.com/api/tournament/${tournamentId}/season/${seasonId}/matches/last`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": FOOTAPI_SECRET,
        "x-rapidapi-host": "footapi7.p.rapidapi.com"
      }
    };
  
    try {
      while (nextPage) {
        const response = await fetch(`${url}/${pageNum}`, options);
        const data = await response.json();
  
        if (data.events) {
          allData = allData.concat(data.events);
        }
  
        nextPage = data.hasNextPage;
        pageNum += 1;
      }
  
      return allData;
    } catch (error) {
      console.error(
        `Error fetching season (${name} - ${tournamentId}), season (${seasonId}), page ${pageNum} matches.`,
        error
      );
      throw error; // Throw an error if something goes wrong
    }
  }