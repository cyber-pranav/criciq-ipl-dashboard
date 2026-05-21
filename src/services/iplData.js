// src/services/iplData.js
// Comprehensive IPL mock data and processing functions for CricIQ

// ─────────────────────────────────────────────────
// 1. MATCHES_DATA  (~80 matches across 2008–2024)
// ─────────────────────────────────────────────────
export const MATCHES_DATA = [
  // 2008
  { id: 1, season: 2008, city: 'Bangalore', date: '2008-04-18', team1: 'RCB', team2: 'KKR', winner: 'KKR', win_by_runs: 140, win_by_wickets: 0, player_of_match: 'Brendon McCullum', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 2, season: 2008, city: 'Chennai', date: '2008-04-19', team1: 'CSK', team2: 'PBKS', winner: 'CSK', win_by_runs: 33, win_by_wickets: 0, player_of_match: 'Matthew Hayden', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 3, season: 2008, city: 'Delhi', date: '2008-04-19', team1: 'DC', team2: 'RR', winner: 'RR', win_by_runs: 0, win_by_wickets: 9, player_of_match: 'Shane Warne', venue: 'Arun Jaitley Stadium, Delhi' },
  { id: 4, season: 2008, city: 'Mumbai', date: '2008-04-20', team1: 'MI', team2: 'RR', winner: 'RR', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Shane Watson', venue: 'Wankhede Stadium, Mumbai' },
  { id: 5, season: 2008, city: 'Jaipur', date: '2008-06-01', team1: 'RR', team2: 'CSK', winner: 'RR', win_by_runs: 0, win_by_wickets: 3, player_of_match: 'Yusuf Pathan', venue: 'Sawai Mansingh Stadium, Jaipur' },

  // 2009
  { id: 6, season: 2009, city: 'Cape Town', date: '2009-04-18', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 19, win_by_wickets: 0, player_of_match: 'Sachin Tendulkar', venue: 'Newlands, Cape Town' },
  { id: 7, season: 2009, city: 'Durban', date: '2009-04-19', team1: 'KKR', team2: 'DC', winner: 'DC', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Virender Sehwag', venue: 'Kingsmead, Durban' },
  { id: 8, season: 2009, city: 'Cape Town', date: '2009-05-24', team1: 'RCB', team2: 'DC', winner: 'DC', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Adam Gilchrist', venue: 'Newlands, Cape Town' },

  // 2010
  { id: 9, season: 2010, city: 'Mumbai', date: '2010-03-12', team1: 'MI', team2: 'RR', winner: 'MI', win_by_runs: 37, win_by_wickets: 0, player_of_match: 'Sachin Tendulkar', venue: 'DY Patil Stadium, Mumbai' },
  { id: 10, season: 2010, city: 'Chennai', date: '2010-04-25', team1: 'CSK', team2: 'MI', winner: 'CSK', win_by_runs: 22, win_by_wickets: 0, player_of_match: 'Suresh Raina', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 11, season: 2010, city: 'Kolkata', date: '2010-04-28', team1: 'KKR', team2: 'RCB', winner: 'RCB', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Jacques Kallis', venue: 'Eden Gardens, Kolkata' },

  // 2011
  { id: 12, season: 2011, city: 'Chennai', date: '2011-04-08', team1: 'CSK', team2: 'KKR', winner: 'CSK', win_by_runs: 2, win_by_wickets: 0, player_of_match: 'MS Dhoni', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 13, season: 2011, city: 'Bangalore', date: '2011-04-12', team1: 'RCB', team2: 'MI', winner: 'RCB', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Chris Gayle', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 14, season: 2011, city: 'Chennai', date: '2011-05-28', team1: 'CSK', team2: 'RCB', winner: 'CSK', win_by_runs: 58, win_by_wickets: 0, player_of_match: 'Murali Vijay', venue: 'MA Chidambaram Stadium, Chennai' },

  // 2012
  { id: 15, season: 2012, city: 'Chennai', date: '2012-04-04', team1: 'CSK', team2: 'MI', winner: 'CSK', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Suresh Raina', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 16, season: 2012, city: 'Kolkata', date: '2012-04-17', team1: 'KKR', team2: 'DC', winner: 'KKR', win_by_runs: 6, win_by_wickets: 0, player_of_match: 'Gautam Gambhir', venue: 'Eden Gardens, Kolkata' },
  { id: 17, season: 2012, city: 'Kolkata', date: '2012-05-27', team1: 'KKR', team2: 'CSK', winner: 'KKR', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Manvinder Bisla', venue: 'MA Chidambaram Stadium, Chennai' },

  // 2013
  { id: 18, season: 2013, city: 'Kolkata', date: '2013-04-03', team1: 'KKR', team2: 'DC', winner: 'KKR', win_by_runs: 6, win_by_wickets: 0, player_of_match: 'Jacques Kallis', venue: 'Eden Gardens, Kolkata' },
  { id: 19, season: 2013, city: 'Mumbai', date: '2013-04-09', team1: 'MI', team2: 'RCB', winner: 'MI', win_by_runs: 58, win_by_wickets: 0, player_of_match: 'Kieron Pollard', venue: 'Wankhede Stadium, Mumbai' },
  { id: 20, season: 2013, city: 'Kolkata', date: '2013-05-26', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 23, win_by_wickets: 0, player_of_match: 'Kieron Pollard', venue: 'Eden Gardens, Kolkata' },

  // 2014
  { id: 21, season: 2014, city: 'Abu Dhabi', date: '2014-04-16', team1: 'MI', team2: 'KKR', winner: 'KKR', win_by_runs: 41, win_by_wickets: 0, player_of_match: 'Sunil Narine', venue: 'Sheikh Zayed Stadium, Abu Dhabi' },
  { id: 22, season: 2014, city: 'Bangalore', date: '2014-05-24', team1: 'KKR', team2: 'PBKS', winner: 'KKR', win_by_runs: 0, win_by_wickets: 3, player_of_match: 'Manish Pandey', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 23, season: 2014, city: 'Chennai', date: '2014-04-18', team1: 'CSK', team2: 'PBKS', winner: 'CSK', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Brendon McCullum', venue: 'MA Chidambaram Stadium, Chennai' },

  // 2015
  { id: 24, season: 2015, city: 'Mumbai', date: '2015-04-08', team1: 'MI', team2: 'KKR', winner: 'MI', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Rohit Sharma', venue: 'Wankhede Stadium, Mumbai' },
  { id: 25, season: 2015, city: 'Bangalore', date: '2015-04-22', team1: 'RCB', team2: 'CSK', winner: 'RCB', win_by_runs: 0, win_by_wickets: 3, player_of_match: 'AB de Villiers', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 26, season: 2015, city: 'Kolkata', date: '2015-05-24', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 41, win_by_wickets: 0, player_of_match: 'Rohit Sharma', venue: 'Eden Gardens, Kolkata' },

  // 2016
  { id: 27, season: 2016, city: 'Mumbai', date: '2016-04-09', team1: 'MI', team2: 'RCB', winner: 'MI', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Rohit Sharma', venue: 'Wankhede Stadium, Mumbai' },
  { id: 28, season: 2016, city: 'Bangalore', date: '2016-05-14', team1: 'RCB', team2: 'KKR', winner: 'RCB', win_by_runs: 0, win_by_wickets: 9, player_of_match: 'Virat Kohli', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 29, season: 2016, city: 'Bangalore', date: '2016-05-29', team1: 'RCB', team2: 'SRH', winner: 'SRH', win_by_runs: 8, win_by_wickets: 0, player_of_match: 'Ben Cutting', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 30, season: 2016, city: 'Hyderabad', date: '2016-04-15', team1: 'SRH', team2: 'MI', winner: 'SRH', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'David Warner', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 31, season: 2016, city: 'Mohali', date: '2016-04-17', team1: 'PBKS', team2: 'RR', winner: 'PBKS', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Murali Vijay', venue: 'PCA Stadium, Mohali' },

  // 2017
  { id: 32, season: 2017, city: 'Hyderabad', date: '2017-04-05', team1: 'SRH', team2: 'RCB', winner: 'SRH', win_by_runs: 35, win_by_wickets: 0, player_of_match: 'David Warner', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 33, season: 2017, city: 'Mumbai', date: '2017-04-09', team1: 'MI', team2: 'PBKS', winner: 'MI', win_by_runs: 0, win_by_wickets: 8, player_of_match: 'Lendl Simmons', venue: 'Wankhede Stadium, Mumbai' },
  { id: 34, season: 2017, city: 'Pune', date: '2017-05-01', team1: 'RR', team2: 'MI', winner: 'MI', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Jos Buttler', venue: 'MCA Stadium, Pune' },
  { id: 35, season: 2017, city: 'Hyderabad', date: '2017-05-21', team1: 'MI', team2: 'RR', winner: 'MI', win_by_runs: 1, win_by_wickets: 0, player_of_match: 'Krunal Pandya', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },

  // 2018
  { id: 36, season: 2018, city: 'Mumbai', date: '2018-04-07', team1: 'MI', team2: 'CSK', winner: 'CSK', win_by_runs: 0, win_by_wickets: 1, player_of_match: 'Dwayne Bravo', venue: 'Wankhede Stadium, Mumbai' },
  { id: 37, season: 2018, city: 'Hyderabad', date: '2018-04-09', team1: 'SRH', team2: 'RR', winner: 'SRH', win_by_runs: 9, win_by_wickets: 0, player_of_match: 'Rashid Khan', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 38, season: 2018, city: 'Pune', date: '2018-05-27', team1: 'CSK', team2: 'SRH', winner: 'CSK', win_by_runs: 0, win_by_wickets: 8, player_of_match: 'Shane Watson', venue: 'MCA Stadium, Pune' },
  { id: 39, season: 2018, city: 'Delhi', date: '2018-04-23', team1: 'DC', team2: 'RCB', winner: 'RCB', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'AB de Villiers', venue: 'Arun Jaitley Stadium, Delhi' },

  // 2019
  { id: 40, season: 2019, city: 'Chennai', date: '2019-03-23', team1: 'CSK', team2: 'RCB', winner: 'CSK', win_by_runs: 7, win_by_wickets: 0, player_of_match: 'Harbhajan Singh', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 41, season: 2019, city: 'Mumbai', date: '2019-04-03', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 37, win_by_wickets: 0, player_of_match: 'Hardik Pandya', venue: 'Wankhede Stadium, Mumbai' },
  { id: 42, season: 2019, city: 'Hyderabad', date: '2019-05-12', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 1, win_by_wickets: 0, player_of_match: 'Jasprit Bumrah', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 43, season: 2019, city: 'Kolkata', date: '2019-03-24', team1: 'KKR', team2: 'SRH', winner: 'KKR', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Andre Russell', venue: 'Eden Gardens, Kolkata' },
  { id: 44, season: 2019, city: 'Jaipur', date: '2019-04-14', team1: 'RR', team2: 'MI', winner: 'MI', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Quinton de Kock', venue: 'Sawai Mansingh Stadium, Jaipur' },

  // 2020
  { id: 45, season: 2020, city: 'Abu Dhabi', date: '2020-09-19', team1: 'MI', team2: 'CSK', winner: 'MI', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Ambati Rayudu', venue: 'Sheikh Zayed Stadium, Abu Dhabi' },
  { id: 46, season: 2020, city: 'Dubai', date: '2020-09-21', team1: 'DC', team2: 'PBKS', winner: 'DC', win_by_runs: 0, win_by_wickets: 4, player_of_match: 'Marcus Stoinis', venue: 'Dubai International Stadium, Dubai' },
  { id: 47, season: 2020, city: 'Sharjah', date: '2020-09-22', team1: 'RR', team2: 'CSK', winner: 'RR', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Sanju Samson', venue: 'Sharjah Cricket Stadium, Sharjah' },
  { id: 48, season: 2020, city: 'Dubai', date: '2020-11-10', team1: 'MI', team2: 'DC', winner: 'MI', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Rohit Sharma', venue: 'Dubai International Stadium, Dubai' },
  { id: 49, season: 2020, city: 'Abu Dhabi', date: '2020-10-18', team1: 'KKR', team2: 'RCB', winner: 'RCB', win_by_runs: 82, win_by_wickets: 0, player_of_match: 'AB de Villiers', venue: 'Sheikh Zayed Stadium, Abu Dhabi' },

  // 2021
  { id: 50, season: 2021, city: 'Chennai', date: '2021-04-09', team1: 'MI', team2: 'RCB', winner: 'RCB', win_by_runs: 0, win_by_wickets: 2, player_of_match: 'AB de Villiers', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 51, season: 2021, city: 'Mumbai', date: '2021-04-10', team1: 'DC', team2: 'CSK', winner: 'DC', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Shikhar Dhawan', venue: 'Wankhede Stadium, Mumbai' },
  { id: 52, season: 2021, city: 'Chennai', date: '2021-04-11', team1: 'PBKS', team2: 'RR', winner: 'PBKS', win_by_runs: 4, win_by_wickets: 0, player_of_match: 'Sanju Samson', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 53, season: 2021, city: 'Dubai', date: '2021-10-15', team1: 'CSK', team2: 'KKR', winner: 'CSK', win_by_runs: 27, win_by_wickets: 0, player_of_match: 'Faf du Plessis', venue: 'Dubai International Stadium, Dubai' },

  // 2022
  { id: 54, season: 2022, city: 'Mumbai', date: '2022-03-26', team1: 'CSK', team2: 'KKR', winner: 'KKR', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Ajinkya Rahane', venue: 'Wankhede Stadium, Mumbai' },
  { id: 55, season: 2022, city: 'Mumbai', date: '2022-03-27', team1: 'LSG', team2: 'GT', winner: 'GT', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Rahul Tewatia', venue: 'Wankhede Stadium, Mumbai' },
  { id: 56, season: 2022, city: 'Pune', date: '2022-04-02', team1: 'RR', team2: 'SRH', winner: 'RR', win_by_runs: 61, win_by_wickets: 0, player_of_match: 'Jos Buttler', venue: 'MCA Stadium, Pune' },
  { id: 57, season: 2022, city: 'Mumbai', date: '2022-04-10', team1: 'RCB', team2: 'MI', winner: 'RCB', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Faf du Plessis', venue: 'MCA Stadium, Pune' },
  { id: 58, season: 2022, city: 'Ahmedabad', date: '2022-05-29', team1: 'GT', team2: 'RR', winner: 'GT', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Hardik Pandya', venue: 'Narendra Modi Stadium, Ahmedabad' },

  // 2023
  { id: 59, season: 2023, city: 'Ahmedabad', date: '2023-03-31', team1: 'GT', team2: 'CSK', winner: 'GT', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Rashid Khan', venue: 'Narendra Modi Stadium, Ahmedabad' },
  { id: 60, season: 2023, city: 'Hyderabad', date: '2023-04-02', team1: 'SRH', team2: 'RR', winner: 'SRH', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Harry Brook', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 61, season: 2023, city: 'Kolkata', date: '2023-04-06', team1: 'KKR', team2: 'RCB', winner: 'KKR', win_by_runs: 81, win_by_wickets: 0, player_of_match: 'Shardul Thakur', venue: 'Eden Gardens, Kolkata' },
  { id: 62, season: 2023, city: 'Bangalore', date: '2023-05-18', team1: 'RCB', team2: 'MI', winner: 'MI', win_by_runs: 6, win_by_wickets: 0, player_of_match: 'Suryakumar Yadav', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 63, season: 2023, city: 'Chennai', date: '2023-04-12', team1: 'CSK', team2: 'MI', winner: 'CSK', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Ruturaj Gaikwad', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 64, season: 2023, city: 'Ahmedabad', date: '2023-05-28', team1: 'CSK', team2: 'GT', winner: 'CSK', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Devon Conway', venue: 'Narendra Modi Stadium, Ahmedabad' },
  { id: 65, season: 2023, city: 'Lucknow', date: '2023-04-08', team1: 'LSG', team2: 'DC', winner: 'LSG', win_by_runs: 5, win_by_wickets: 0, player_of_match: 'KL Rahul', venue: 'Ekana Cricket Stadium, Lucknow' },
  { id: 66, season: 2023, city: 'Mohali', date: '2023-04-05', team1: 'PBKS', team2: 'KKR', winner: 'PBKS', win_by_runs: 7, win_by_wickets: 0, player_of_match: 'Liam Livingstone', venue: 'PCA Stadium, Mohali' },

  // 2024
  { id: 67, season: 2024, city: 'Chennai', date: '2024-03-22', team1: 'CSK', team2: 'RCB', winner: 'CSK', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Mustafizur Rahman', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 68, season: 2024, city: 'Kolkata', date: '2024-03-22', team1: 'KKR', team2: 'SRH', winner: 'KKR', win_by_runs: 4, win_by_wickets: 0, player_of_match: 'Phil Salt', venue: 'Eden Gardens, Kolkata' },
  { id: 69, season: 2024, city: 'Mohali', date: '2024-03-23', team1: 'PBKS', team2: 'DC', winner: 'PBKS', win_by_runs: 0, win_by_wickets: 4, player_of_match: 'Shashank Singh', venue: 'PCA Stadium, Mohali' },
  { id: 70, season: 2024, city: 'Hyderabad', date: '2024-03-25', team1: 'SRH', team2: 'MI', winner: 'SRH', win_by_runs: 31, win_by_wickets: 0, player_of_match: 'Travis Head', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 71, season: 2024, city: 'Jaipur', date: '2024-03-24', team1: 'RR', team2: 'LSG', winner: 'RR', win_by_runs: 0, win_by_wickets: 7, player_of_match: 'Jos Buttler', venue: 'Sawai Mansingh Stadium, Jaipur' },
  { id: 72, season: 2024, city: 'Ahmedabad', date: '2024-03-24', team1: 'GT', team2: 'MI', winner: 'MI', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Jasprit Bumrah', venue: 'Narendra Modi Stadium, Ahmedabad' },
  { id: 73, season: 2024, city: 'Bangalore', date: '2024-04-11', team1: 'RCB', team2: 'RR', winner: 'RCB', win_by_runs: 0, win_by_wickets: 4, player_of_match: 'Virat Kohli', venue: 'M. Chinnaswamy Stadium, Bangalore' },
  { id: 74, season: 2024, city: 'Chennai', date: '2024-04-23', team1: 'CSK', team2: 'SRH', winner: 'SRH', win_by_runs: 0, win_by_wickets: 6, player_of_match: 'Heinrich Klaasen', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 75, season: 2024, city: 'Kolkata', date: '2024-05-21', team1: 'KKR', team2: 'DC', winner: 'KKR', win_by_runs: 7, win_by_wickets: 0, player_of_match: 'Sunil Narine', venue: 'Eden Gardens, Kolkata' },
  { id: 76, season: 2024, city: 'Mumbai', date: '2024-04-17', team1: 'MI', team2: 'RCB', winner: 'RCB', win_by_runs: 0, win_by_wickets: 5, player_of_match: 'Faf du Plessis', venue: 'Wankhede Stadium, Mumbai' },
  { id: 77, season: 2024, city: 'Hyderabad', date: '2024-05-24', team1: 'SRH', team2: 'RR', winner: 'SRH', win_by_runs: 36, win_by_wickets: 0, player_of_match: 'Travis Head', venue: 'Rajiv Gandhi Intl Stadium, Hyderabad' },
  { id: 78, season: 2024, city: 'Chennai', date: '2024-05-26', team1: 'KKR', team2: 'SRH', winner: 'KKR', win_by_runs: 8, win_by_wickets: 0, player_of_match: 'Mitchell Starc', venue: 'MA Chidambaram Stadium, Chennai' },
  { id: 79, season: 2024, city: 'Lucknow', date: '2024-04-19', team1: 'LSG', team2: 'PBKS', winner: 'LSG', win_by_runs: 0, win_by_wickets: 8, player_of_match: 'KL Rahul', venue: 'Ekana Cricket Stadium, Lucknow' },
  { id: 80, season: 2024, city: 'Delhi', date: '2024-04-27', team1: 'DC', team2: 'RR', winner: 'RR', win_by_runs: 0, win_by_wickets: 12, player_of_match: 'Riyan Parag', venue: 'Arun Jaitley Stadium, Delhi' },
];


// ─────────────────────────────────────────────────
// 2. PLAYERS_DATA  (~40 players with realistic stats)
// ─────────────────────────────────────────────────
export const PLAYERS_DATA = [
  {
    id: 1, name: 'Virat Kohli', team: 'RCB', role: 'Batsman',
    matches: 252, runs: 8004, average: 37.25, strikeRate: 131.61, wickets: 4, economy: 8.82, fifties: 55, hundreds: 8, bestScore: '113',
    seasons: [
      { year: 2016, runs: 973, wickets: 0, matches: 16, average: 81.08, strikeRate: 152.03, economy: 0 },
      { year: 2018, runs: 530, wickets: 0, matches: 14, average: 48.18, strikeRate: 141.49, economy: 0 },
      { year: 2019, runs: 464, wickets: 0, matches: 14, average: 33.14, strikeRate: 141.30, economy: 0 },
      { year: 2020, runs: 466, wickets: 0, matches: 15, average: 42.36, strikeRate: 121.35, economy: 0 },
      { year: 2021, runs: 405, wickets: 0, matches: 15, average: 28.93, strikeRate: 119.47, economy: 0 },
      { year: 2022, runs: 341, wickets: 0, matches: 16, average: 22.73, strikeRate: 115.98, economy: 0 },
      { year: 2023, runs: 639, wickets: 0, matches: 14, average: 53.25, strikeRate: 139.08, economy: 0 },
      { year: 2024, runs: 741, wickets: 0, matches: 15, average: 61.75, strikeRate: 154.69, economy: 0 },
    ],
  },
  {
    id: 2, name: 'Rohit Sharma', team: 'MI', role: 'Batsman',
    matches: 248, runs: 6211, average: 29.58, strikeRate: 130.39, wickets: 15, economy: 7.23, fifties: 42, hundreds: 2, bestScore: '109*',
    seasons: [
      { year: 2017, runs: 333, wickets: 0, matches: 17, average: 27.75, strikeRate: 122.51, economy: 0 },
      { year: 2018, runs: 286, wickets: 0, matches: 14, average: 23.83, strikeRate: 133.64, economy: 0 },
      { year: 2019, runs: 405, wickets: 0, matches: 15, average: 28.93, strikeRate: 128.98, economy: 0 },
      { year: 2020, runs: 332, wickets: 0, matches: 12, average: 27.67, strikeRate: 127.18, economy: 0 },
      { year: 2021, runs: 381, wickets: 0, matches: 14, average: 27.21, strikeRate: 127.00, economy: 0 },
      { year: 2022, runs: 268, wickets: 0, matches: 14, average: 19.14, strikeRate: 120.18, economy: 0 },
      { year: 2023, runs: 332, wickets: 0, matches: 14, average: 25.54, strikeRate: 137.19, economy: 0 },
      { year: 2024, runs: 417, wickets: 0, matches: 14, average: 34.75, strikeRate: 150.00, economy: 0 },
    ],
  },
  {
    id: 3, name: 'MS Dhoni', team: 'CSK', role: 'Batsman',
    matches: 264, runs: 5243, average: 38.09, strikeRate: 135.92, wickets: 0, economy: 0, fifties: 24, hundreds: 0, bestScore: '84*',
    seasons: [
      { year: 2018, runs: 455, wickets: 0, matches: 16, average: 75.83, strikeRate: 150.66, economy: 0 },
      { year: 2019, runs: 416, wickets: 0, matches: 15, average: 83.20, strikeRate: 134.62, economy: 0 },
      { year: 2020, runs: 200, wickets: 0, matches: 14, average: 25.00, strikeRate: 116.27, economy: 0 },
      { year: 2021, runs: 114, wickets: 0, matches: 16, average: 16.29, strikeRate: 106.54, economy: 0 },
      { year: 2022, runs: 232, wickets: 0, matches: 14, average: 33.14, strikeRate: 123.40, economy: 0 },
      { year: 2023, runs: 104, wickets: 0, matches: 15, average: 20.80, strikeRate: 182.45, economy: 0 },
      { year: 2024, runs: 161, wickets: 0, matches: 14, average: 53.67, strikeRate: 220.55, economy: 0 },
    ],
  },
  {
    id: 4, name: 'Jasprit Bumrah', team: 'MI', role: 'Bowler',
    matches: 133, runs: 80, average: 6.67, strikeRate: 82.47, wickets: 165, economy: 7.39, fifties: 0, hundreds: 0, bestScore: '10*',
    seasons: [
      { year: 2018, runs: 0, wickets: 17, matches: 14, average: 0, strikeRate: 0, economy: 6.84 },
      { year: 2019, runs: 0, wickets: 19, matches: 16, average: 0, strikeRate: 0, economy: 6.63 },
      { year: 2020, runs: 0, wickets: 27, matches: 15, average: 0, strikeRate: 0, economy: 6.73 },
      { year: 2022, runs: 0, wickets: 12, matches: 14, average: 0, strikeRate: 0, economy: 7.24 },
      { year: 2023, runs: 0, wickets: 20, matches: 14, average: 0, strikeRate: 0, economy: 7.38 },
      { year: 2024, runs: 0, wickets: 20, matches: 13, average: 0, strikeRate: 0, economy: 6.48 },
    ],
  },
  {
    id: 5, name: 'Suryakumar Yadav', team: 'MI', role: 'Batsman',
    matches: 152, runs: 3966, average: 32.85, strikeRate: 145.72, wickets: 0, economy: 0, fifties: 24, hundreds: 1, bestScore: '103*',
    seasons: [
      { year: 2020, runs: 480, wickets: 0, matches: 16, average: 40.00, strikeRate: 145.45, economy: 0 },
      { year: 2021, runs: 317, wickets: 0, matches: 14, average: 22.64, strikeRate: 143.18, economy: 0 },
      { year: 2022, runs: 303, wickets: 0, matches: 14, average: 23.31, strikeRate: 145.67, economy: 0 },
      { year: 2023, runs: 543, wickets: 0, matches: 14, average: 45.25, strikeRate: 155.14, economy: 0 },
      { year: 2024, runs: 345, wickets: 0, matches: 11, average: 34.50, strikeRate: 161.68, economy: 0 },
    ],
  },
  {
    id: 6, name: 'Shubman Gill', team: 'GT', role: 'Batsman',
    matches: 101, runs: 2965, average: 35.65, strikeRate: 133.92, wickets: 0, economy: 0, fifties: 22, hundreds: 2, bestScore: '129',
    seasons: [
      { year: 2021, runs: 440, wickets: 0, matches: 14, average: 36.67, strikeRate: 117.33, economy: 0 },
      { year: 2022, runs: 483, wickets: 0, matches: 16, average: 34.50, strikeRate: 132.33, economy: 0 },
      { year: 2023, runs: 890, wickets: 0, matches: 17, average: 59.33, strikeRate: 157.52, economy: 0 },
      { year: 2024, runs: 426, wickets: 0, matches: 14, average: 30.43, strikeRate: 147.40, economy: 0 },
    ],
  },
  {
    id: 7, name: 'Faf du Plessis', team: 'RCB', role: 'Batsman',
    matches: 145, runs: 4571, average: 35.15, strikeRate: 133.28, wickets: 0, economy: 0, fifties: 36, hundreds: 0, bestScore: '96',
    seasons: [
      { year: 2021, runs: 633, wickets: 0, matches: 16, average: 45.21, strikeRate: 138.16, economy: 0 },
      { year: 2022, runs: 468, wickets: 0, matches: 16, average: 31.20, strikeRate: 127.52, economy: 0 },
      { year: 2023, runs: 413, wickets: 0, matches: 14, average: 29.50, strikeRate: 137.79, economy: 0 },
      { year: 2024, runs: 438, wickets: 0, matches: 14, average: 33.69, strikeRate: 141.10, economy: 0 },
    ],
  },
  {
    id: 8, name: 'Jos Buttler', team: 'RR', role: 'Batsman',
    matches: 107, runs: 3550, average: 37.37, strikeRate: 148.93, wickets: 0, economy: 0, fifties: 18, hundreds: 5, bestScore: '124',
    seasons: [
      { year: 2018, runs: 548, wickets: 0, matches: 13, average: 54.80, strikeRate: 155.24, economy: 0 },
      { year: 2022, runs: 863, wickets: 0, matches: 17, average: 57.53, strikeRate: 149.05, economy: 0 },
      { year: 2023, runs: 360, wickets: 0, matches: 14, average: 30.00, strikeRate: 139.53, economy: 0 },
      { year: 2024, runs: 359, wickets: 0, matches: 13, average: 27.62, strikeRate: 145.33, economy: 0 },
    ],
  },
  {
    id: 9, name: 'Rashid Khan', team: 'GT', role: 'Bowler',
    matches: 115, runs: 532, average: 15.05, strikeRate: 148.74, wickets: 130, economy: 6.34, fifties: 0, hundreds: 0, bestScore: '34*',
    seasons: [
      { year: 2018, runs: 25, wickets: 21, matches: 17, average: 0, strikeRate: 0, economy: 6.73 },
      { year: 2019, runs: 15, wickets: 17, matches: 15, average: 0, strikeRate: 0, economy: 6.24 },
      { year: 2022, runs: 50, wickets: 19, matches: 16, average: 0, strikeRate: 0, economy: 6.59 },
      { year: 2023, runs: 42, wickets: 16, matches: 15, average: 0, strikeRate: 0, economy: 6.96 },
      { year: 2024, runs: 45, wickets: 19, matches: 14, average: 0, strikeRate: 0, economy: 7.34 },
    ],
  },
  {
    id: 10, name: 'Yuzvendra Chahal', team: 'RR', role: 'Bowler',
    matches: 159, runs: 68, average: 6.18, strikeRate: 73.91, wickets: 205, economy: 7.58, fifties: 0, hundreds: 0, bestScore: '8',
    seasons: [
      { year: 2018, runs: 0, wickets: 14, matches: 14, average: 0, strikeRate: 0, economy: 7.58 },
      { year: 2019, runs: 0, wickets: 18, matches: 14, average: 0, strikeRate: 0, economy: 7.88 },
      { year: 2020, runs: 0, wickets: 21, matches: 15, average: 0, strikeRate: 0, economy: 7.08 },
      { year: 2022, runs: 0, wickets: 27, matches: 17, average: 0, strikeRate: 0, economy: 7.75 },
      { year: 2023, runs: 0, wickets: 14, matches: 14, average: 0, strikeRate: 0, economy: 8.44 },
      { year: 2024, runs: 0, wickets: 18, matches: 14, average: 0, strikeRate: 0, economy: 8.86 },
    ],
  },
  {
    id: 11, name: 'Ravindra Jadeja', team: 'CSK', role: 'All-rounder',
    matches: 226, runs: 2692, average: 26.39, strikeRate: 130.46, wickets: 157, economy: 7.61, fifties: 5, hundreds: 0, bestScore: '62*',
    seasons: [
      { year: 2018, runs: 310, wickets: 12, matches: 16, average: 25.83, strikeRate: 148.80, economy: 7.39 },
      { year: 2019, runs: 162, wickets: 15, matches: 16, average: 20.25, strikeRate: 148.62, economy: 7.10 },
      { year: 2020, runs: 232, wickets: 6, matches: 14, average: 33.14, strikeRate: 173.13, economy: 8.22 },
      { year: 2021, runs: 227, wickets: 13, matches: 16, average: 22.70, strikeRate: 145.51, economy: 7.53 },
      { year: 2022, runs: 116, wickets: 5, matches: 10, average: 19.33, strikeRate: 118.37, economy: 7.79 },
      { year: 2023, runs: 190, wickets: 10, matches: 15, average: 27.14, strikeRate: 135.71, economy: 7.70 },
      { year: 2024, runs: 270, wickets: 10, matches: 14, average: 33.75, strikeRate: 150.00, economy: 7.93 },
    ],
  },
  {
    id: 12, name: 'KL Rahul', team: 'LSG', role: 'Batsman',
    matches: 132, runs: 4683, average: 45.47, strikeRate: 134.28, wickets: 0, economy: 0, fifties: 37, hundreds: 4, bestScore: '132*',
    seasons: [
      { year: 2018, runs: 659, wickets: 0, matches: 14, average: 54.92, strikeRate: 158.41, economy: 0 },
      { year: 2019, runs: 593, wickets: 0, matches: 14, average: 53.91, strikeRate: 135.08, economy: 0 },
      { year: 2020, runs: 670, wickets: 0, matches: 14, average: 55.83, strikeRate: 129.34, economy: 0 },
      { year: 2021, runs: 626, wickets: 0, matches: 13, average: 62.60, strikeRate: 138.61, economy: 0 },
      { year: 2022, runs: 616, wickets: 0, matches: 15, average: 51.33, strikeRate: 135.24, economy: 0 },
      { year: 2023, runs: 520, wickets: 0, matches: 15, average: 40.00, strikeRate: 130.00, economy: 0 },
      { year: 2024, runs: 520, wickets: 0, matches: 14, average: 37.14, strikeRate: 136.84, economy: 0 },
    ],
  },
  {
    id: 13, name: 'Hardik Pandya', team: 'MI', role: 'All-rounder',
    matches: 120, runs: 2340, average: 28.54, strikeRate: 151.36, wickets: 58, economy: 9.08, fifties: 9, hundreds: 0, bestScore: '91',
    seasons: [
      { year: 2019, runs: 402, wickets: 14, matches: 16, average: 44.67, strikeRate: 191.43, economy: 9.06 },
      { year: 2020, runs: 281, wickets: 4, matches: 14, average: 35.13, strikeRate: 178.98, economy: 8.60 },
      { year: 2022, runs: 487, wickets: 8, matches: 15, average: 44.27, strikeRate: 131.27, economy: 7.27 },
      { year: 2023, runs: 326, wickets: 3, matches: 14, average: 27.17, strikeRate: 147.06, economy: 10.80 },
      { year: 2024, runs: 216, wickets: 11, matches: 14, average: 18.00, strikeRate: 143.05, economy: 10.75 },
    ],
  },
  {
    id: 14, name: 'David Warner', team: 'DC', role: 'Batsman',
    matches: 176, runs: 6565, average: 41.26, strikeRate: 139.96, wickets: 1, economy: 12.00, fifties: 55, hundreds: 4, bestScore: '126',
    seasons: [
      { year: 2016, runs: 848, wickets: 0, matches: 17, average: 60.57, strikeRate: 151.43, economy: 0 },
      { year: 2017, runs: 641, wickets: 0, matches: 14, average: 58.27, strikeRate: 141.85, economy: 0 },
      { year: 2019, runs: 692, wickets: 0, matches: 12, average: 69.20, strikeRate: 143.86, economy: 0 },
      { year: 2020, runs: 548, wickets: 0, matches: 16, average: 39.14, strikeRate: 134.64, economy: 0 },
      { year: 2021, runs: 195, wickets: 0, matches: 8, average: 24.38, strikeRate: 107.73, economy: 0 },
      { year: 2022, runs: 432, wickets: 0, matches: 12, average: 48.00, strikeRate: 150.52, economy: 0 },
      { year: 2023, runs: 516, wickets: 0, matches: 14, average: 36.86, strikeRate: 136.51, economy: 0 },
      { year: 2024, runs: 168, wickets: 0, matches: 8, average: 21.00, strikeRate: 120.00, economy: 0 },
    ],
  },
  {
    id: 15, name: 'AB de Villiers', team: 'RCB', role: 'Batsman',
    matches: 184, runs: 5162, average: 39.71, strikeRate: 151.68, wickets: 0, economy: 0, fifties: 40, hundreds: 3, bestScore: '133*',
    seasons: [
      { year: 2016, runs: 687, wickets: 0, matches: 16, average: 52.85, strikeRate: 168.22, economy: 0 },
      { year: 2018, runs: 480, wickets: 0, matches: 14, average: 53.33, strikeRate: 174.55, economy: 0 },
      { year: 2019, runs: 442, wickets: 0, matches: 13, average: 44.20, strikeRate: 154.55, economy: 0 },
      { year: 2020, runs: 454, wickets: 0, matches: 14, average: 45.40, strikeRate: 158.74, economy: 0 },
      { year: 2021, runs: 313, wickets: 0, matches: 15, average: 31.30, strikeRate: 164.40, economy: 0 },
    ],
  },
  {
    id: 16, name: 'Chris Gayle', team: 'PBKS', role: 'Batsman',
    matches: 142, runs: 4965, average: 39.72, strikeRate: 148.96, wickets: 20, economy: 8.21, fifties: 31, hundreds: 6, bestScore: '175*',
    seasons: [
      { year: 2011, runs: 608, wickets: 5, matches: 12, average: 67.56, strikeRate: 183.13, economy: 7.60 },
      { year: 2012, runs: 733, wickets: 2, matches: 15, average: 61.08, strikeRate: 160.31, economy: 8.00 },
      { year: 2013, runs: 708, wickets: 4, matches: 16, average: 59.00, strikeRate: 156.29, economy: 7.73 },
      { year: 2016, runs: 227, wickets: 1, matches: 10, average: 28.38, strikeRate: 152.35, economy: 9.00 },
      { year: 2018, runs: 368, wickets: 0, matches: 11, average: 40.89, strikeRate: 146.03, economy: 0 },
      { year: 2019, runs: 490, wickets: 0, matches: 13, average: 40.83, strikeRate: 153.13, economy: 0 },
    ],
  },
  {
    id: 17, name: 'Rishabh Pant', team: 'DC', role: 'Batsman',
    matches: 111, runs: 3284, average: 35.31, strikeRate: 148.75, wickets: 0, economy: 0, fifties: 18, hundreds: 1, bestScore: '128*',
    seasons: [
      { year: 2018, runs: 684, wickets: 0, matches: 14, average: 52.62, strikeRate: 173.60, economy: 0 },
      { year: 2019, runs: 488, wickets: 0, matches: 16, average: 37.54, strikeRate: 162.67, economy: 0 },
      { year: 2021, runs: 419, wickets: 0, matches: 16, average: 34.92, strikeRate: 128.83, economy: 0 },
      { year: 2022, runs: 340, wickets: 0, matches: 14, average: 30.91, strikeRate: 151.11, economy: 0 },
      { year: 2024, runs: 446, wickets: 0, matches: 13, average: 40.55, strikeRate: 155.40, economy: 0 },
    ],
  },
  {
    id: 18, name: 'Ishan Kishan', team: 'MI', role: 'Batsman',
    matches: 105, runs: 2643, average: 28.40, strikeRate: 136.01, wickets: 0, economy: 0, fifties: 14, hundreds: 1, bestScore: '99',
    seasons: [
      { year: 2020, runs: 516, wickets: 0, matches: 14, average: 57.33, strikeRate: 145.76, economy: 0 },
      { year: 2021, runs: 241, wickets: 0, matches: 10, average: 24.10, strikeRate: 133.89, economy: 0 },
      { year: 2022, runs: 418, wickets: 0, matches: 14, average: 34.83, strikeRate: 120.81, economy: 0 },
      { year: 2023, runs: 454, wickets: 0, matches: 14, average: 34.92, strikeRate: 142.95, economy: 0 },
    ],
  },
  {
    id: 19, name: 'Pat Cummins', team: 'SRH', role: 'Bowler',
    matches: 56, runs: 468, average: 17.33, strikeRate: 133.71, wickets: 54, economy: 8.76, fifties: 0, hundreds: 0, bestScore: '56*',
    seasons: [
      { year: 2022, runs: 46, wickets: 7, matches: 8, average: 23.00, strikeRate: 153.33, economy: 9.10 },
      { year: 2023, runs: 89, wickets: 7, matches: 14, average: 14.83, strikeRate: 132.84, economy: 8.44 },
      { year: 2024, runs: 120, wickets: 18, matches: 14, average: 30.00, strikeRate: 166.67, economy: 8.84 },
    ],
  },
  {
    id: 20, name: 'Mohammed Shami', team: 'GT', role: 'Bowler',
    matches: 106, runs: 97, average: 6.47, strikeRate: 100.00, wickets: 120, economy: 8.10, fifties: 0, hundreds: 0, bestScore: '14',
    seasons: [
      { year: 2019, runs: 5, wickets: 19, matches: 14, average: 0, strikeRate: 0, economy: 7.88 },
      { year: 2020, runs: 0, wickets: 20, matches: 14, average: 0, strikeRate: 0, economy: 8.57 },
      { year: 2022, runs: 10, wickets: 20, matches: 16, average: 0, strikeRate: 0, economy: 8.00 },
      { year: 2023, runs: 0, wickets: 28, matches: 17, average: 0, strikeRate: 0, economy: 8.03 },
    ],
  },
  {
    id: 21, name: 'Trent Boult', team: 'RR', role: 'Bowler',
    matches: 86, runs: 50, average: 5.56, strikeRate: 89.29, wickets: 98, economy: 8.01, fifties: 0, hundreds: 0, bestScore: '9',
    seasons: [
      { year: 2020, runs: 0, wickets: 22, matches: 15, average: 0, strikeRate: 0, economy: 7.97 },
      { year: 2021, runs: 0, wickets: 13, matches: 14, average: 0, strikeRate: 0, economy: 8.42 },
      { year: 2022, runs: 0, wickets: 16, matches: 14, average: 0, strikeRate: 0, economy: 7.78 },
      { year: 2023, runs: 0, wickets: 11, matches: 13, average: 0, strikeRate: 0, economy: 8.14 },
    ],
  },
  {
    id: 22, name: 'Andre Russell', team: 'KKR', role: 'All-rounder',
    matches: 116, runs: 2317, average: 29.71, strikeRate: 177.88, wickets: 100, economy: 9.32, fifties: 8, hundreds: 0, bestScore: '88*',
    seasons: [
      { year: 2019, runs: 510, wickets: 11, matches: 14, average: 56.67, strikeRate: 204.82, economy: 9.92 },
      { year: 2020, runs: 117, wickets: 6, matches: 10, average: 13.00, strikeRate: 144.44, economy: 10.18 },
      { year: 2022, runs: 335, wickets: 8, matches: 14, average: 33.50, strikeRate: 183.52, economy: 9.04 },
      { year: 2023, runs: 265, wickets: 12, matches: 14, average: 26.50, strikeRate: 175.50, economy: 9.68 },
      { year: 2024, runs: 222, wickets: 8, matches: 14, average: 37.00, strikeRate: 185.00, economy: 9.25 },
    ],
  },
  {
    id: 23, name: 'Sunil Narine', team: 'KKR', role: 'All-rounder',
    matches: 177, runs: 1500, average: 15.79, strikeRate: 161.46, wickets: 182, economy: 6.68, fifties: 3, hundreds: 1, bestScore: '109',
    seasons: [
      { year: 2018, runs: 357, wickets: 17, matches: 16, average: 29.75, strikeRate: 189.89, economy: 5.53 },
      { year: 2020, runs: 121, wickets: 5, matches: 11, average: 15.13, strikeRate: 139.08, economy: 7.09 },
      { year: 2022, runs: 219, wickets: 10, matches: 14, average: 18.25, strikeRate: 136.88, economy: 6.64 },
      { year: 2023, runs: 185, wickets: 9, matches: 14, average: 15.42, strikeRate: 146.83, economy: 7.19 },
      { year: 2024, runs: 488, wickets: 17, matches: 15, average: 34.86, strikeRate: 180.74, economy: 6.69 },
    ],
  },
  {
    id: 24, name: 'Mitchell Starc', team: 'KKR', role: 'Bowler',
    matches: 42, runs: 120, average: 10.91, strikeRate: 120.00, wickets: 50, economy: 8.82, fifties: 0, hundreds: 0, bestScore: '29*',
    seasons: [
      { year: 2015, runs: 15, wickets: 8, matches: 7, average: 0, strikeRate: 0, economy: 7.66 },
      { year: 2024, runs: 44, wickets: 17, matches: 14, average: 0, strikeRate: 0, economy: 9.28 },
    ],
  },
  {
    id: 25, name: 'Ruturaj Gaikwad', team: 'CSK', role: 'Batsman',
    matches: 73, runs: 2635, average: 40.54, strikeRate: 136.73, wickets: 0, economy: 0, fifties: 18, hundreds: 1, bestScore: '108',
    seasons: [
      { year: 2020, runs: 204, wickets: 0, matches: 6, average: 51.00, strikeRate: 145.71, economy: 0 },
      { year: 2021, runs: 635, wickets: 0, matches: 16, average: 45.36, strikeRate: 136.48, economy: 0 },
      { year: 2022, runs: 368, wickets: 0, matches: 14, average: 28.31, strikeRate: 126.90, economy: 0 },
      { year: 2023, runs: 590, wickets: 0, matches: 16, average: 39.33, strikeRate: 141.37, economy: 0 },
      { year: 2024, runs: 583, wickets: 0, matches: 14, average: 44.85, strikeRate: 141.41, economy: 0 },
    ],
  },
  {
    id: 26, name: 'Sanju Samson', team: 'RR', role: 'Batsman',
    matches: 158, runs: 4260, average: 29.50, strikeRate: 136.75, wickets: 0, economy: 0, fifties: 22, hundreds: 3, bestScore: '119',
    seasons: [
      { year: 2019, runs: 342, wickets: 0, matches: 13, average: 28.50, strikeRate: 142.50, economy: 0 },
      { year: 2020, runs: 375, wickets: 0, matches: 14, average: 31.25, strikeRate: 158.89, economy: 0 },
      { year: 2021, runs: 484, wickets: 0, matches: 14, average: 40.33, strikeRate: 136.72, economy: 0 },
      { year: 2022, runs: 458, wickets: 0, matches: 17, average: 28.63, strikeRate: 146.63, economy: 0 },
      { year: 2023, runs: 335, wickets: 0, matches: 14, average: 27.92, strikeRate: 130.47, economy: 0 },
      { year: 2024, runs: 531, wickets: 0, matches: 15, average: 48.27, strikeRate: 153.47, economy: 0 },
    ],
  },
  {
    id: 27, name: 'Shreyas Iyer', team: 'KKR', role: 'Batsman',
    matches: 115, runs: 3127, average: 32.24, strikeRate: 126.64, wickets: 0, economy: 0, fifties: 19, hundreds: 1, bestScore: '96',
    seasons: [
      { year: 2019, runs: 463, wickets: 0, matches: 16, average: 30.87, strikeRate: 119.33, economy: 0 },
      { year: 2020, runs: 519, wickets: 0, matches: 17, average: 34.60, strikeRate: 123.57, economy: 0 },
      { year: 2022, runs: 401, wickets: 0, matches: 14, average: 30.85, strikeRate: 124.22, economy: 0 },
      { year: 2023, runs: 506, wickets: 0, matches: 14, average: 42.17, strikeRate: 135.83, economy: 0 },
      { year: 2024, runs: 351, wickets: 0, matches: 14, average: 29.25, strikeRate: 146.25, economy: 0 },
    ],
  },
  {
    id: 28, name: 'Rinku Singh', team: 'KKR', role: 'Batsman',
    matches: 55, runs: 1388, average: 36.53, strikeRate: 149.57, wickets: 0, economy: 0, fifties: 6, hundreds: 0, bestScore: '67*',
    seasons: [
      { year: 2022, runs: 174, wickets: 0, matches: 8, average: 58.00, strikeRate: 148.72, economy: 0 },
      { year: 2023, runs: 474, wickets: 0, matches: 14, average: 59.25, strikeRate: 149.05, economy: 0 },
      { year: 2024, runs: 597, wickets: 0, matches: 15, average: 39.80, strikeRate: 154.01, economy: 0 },
    ],
  },
  {
    id: 29, name: 'Travis Head', team: 'SRH', role: 'Batsman',
    matches: 36, runs: 1092, average: 35.23, strikeRate: 171.70, wickets: 2, economy: 8.50, fifties: 5, hundreds: 3, bestScore: '102',
    seasons: [
      { year: 2023, runs: 264, wickets: 0, matches: 10, average: 29.33, strikeRate: 153.49, economy: 0 },
      { year: 2024, runs: 567, wickets: 1, matches: 15, average: 40.50, strikeRate: 191.55, economy: 8.50 },
    ],
  },
  {
    id: 30, name: 'Phil Salt', team: 'KKR', role: 'Batsman',
    matches: 25, runs: 735, average: 30.63, strikeRate: 182.13, wickets: 0, economy: 0, fifties: 4, hundreds: 1, bestScore: '120',
    seasons: [
      { year: 2023, runs: 89, wickets: 0, matches: 4, average: 22.25, strikeRate: 163.00, economy: 0 },
      { year: 2024, runs: 435, wickets: 0, matches: 14, average: 36.25, strikeRate: 182.01, economy: 0 },
    ],
  },
  {
    id: 31, name: 'Ravichandran Ashwin', team: 'RR', role: 'All-rounder',
    matches: 193, runs: 711, average: 14.22, strikeRate: 117.33, wickets: 175, economy: 6.79, fifties: 0, hundreds: 0, bestScore: '46*',
    seasons: [
      { year: 2018, runs: 46, wickets: 12, matches: 14, average: 0, strikeRate: 0, economy: 6.79 },
      { year: 2020, runs: 20, wickets: 10, matches: 15, average: 0, strikeRate: 0, economy: 7.67 },
      { year: 2022, runs: 69, wickets: 12, matches: 17, average: 0, strikeRate: 0, economy: 7.05 },
      { year: 2023, runs: 22, wickets: 10, matches: 14, average: 0, strikeRate: 0, economy: 6.98 },
    ],
  },
  {
    id: 32, name: 'Kagiso Rabada', team: 'PBKS', role: 'Bowler',
    matches: 68, runs: 146, average: 9.13, strikeRate: 134.26, wickets: 85, economy: 8.20, fifties: 0, hundreds: 0, bestScore: '25*',
    seasons: [
      { year: 2020, runs: 0, wickets: 30, matches: 17, average: 0, strikeRate: 0, economy: 8.34 },
      { year: 2021, runs: 0, wickets: 15, matches: 9, average: 0, strikeRate: 0, economy: 8.91 },
      { year: 2022, runs: 0, wickets: 12, matches: 12, average: 0, strikeRate: 0, economy: 8.02 },
      { year: 2023, runs: 0, wickets: 14, matches: 14, average: 0, strikeRate: 0, economy: 8.63 },
      { year: 2024, runs: 0, wickets: 16, matches: 14, average: 0, strikeRate: 0, economy: 8.60 },
    ],
  },
  {
    id: 33, name: 'Kuldeep Yadav', team: 'DC', role: 'Bowler',
    matches: 80, runs: 66, average: 6.60, strikeRate: 86.84, wickets: 82, economy: 7.82, fifties: 0, hundreds: 0, bestScore: '12',
    seasons: [
      { year: 2019, runs: 0, wickets: 4, matches: 9, average: 0, strikeRate: 0, economy: 7.74 },
      { year: 2022, runs: 0, wickets: 21, matches: 14, average: 0, strikeRate: 0, economy: 7.25 },
      { year: 2023, runs: 0, wickets: 13, matches: 14, average: 0, strikeRate: 0, economy: 8.64 },
      { year: 2024, runs: 0, wickets: 15, matches: 14, average: 0, strikeRate: 0, economy: 8.37 },
    ],
  },
  {
    id: 34, name: 'Axar Patel', team: 'DC', role: 'All-rounder',
    matches: 105, runs: 1185, average: 19.42, strikeRate: 132.55, wickets: 88, economy: 7.24, fifties: 2, hundreds: 0, bestScore: '64*',
    seasons: [
      { year: 2021, runs: 92, wickets: 9, matches: 12, average: 18.40, strikeRate: 125.00, economy: 6.41 },
      { year: 2022, runs: 189, wickets: 10, matches: 14, average: 21.00, strikeRate: 140.00, economy: 6.91 },
      { year: 2023, runs: 127, wickets: 9, matches: 14, average: 21.17, strikeRate: 137.63, economy: 7.61 },
      { year: 2024, runs: 235, wickets: 13, matches: 14, average: 33.57, strikeRate: 146.88, economy: 7.68 },
    ],
  },
  {
    id: 35, name: 'Yashasvi Jaiswal', team: 'RR', role: 'Batsman',
    matches: 50, runs: 1645, average: 34.27, strikeRate: 160.35, wickets: 0, economy: 0, fifties: 11, hundreds: 1, bestScore: '124',
    seasons: [
      { year: 2022, runs: 256, wickets: 0, matches: 10, average: 28.44, strikeRate: 135.45, economy: 0 },
      { year: 2023, runs: 625, wickets: 0, matches: 14, average: 48.08, strikeRate: 163.35, economy: 0 },
      { year: 2024, runs: 435, wickets: 0, matches: 14, average: 33.46, strikeRate: 171.26, economy: 0 },
    ],
  },
  {
    id: 36, name: 'Heinrich Klaasen', team: 'SRH', role: 'Batsman',
    matches: 37, runs: 1210, average: 40.33, strikeRate: 175.36, wickets: 0, economy: 0, fifties: 7, hundreds: 0, bestScore: '80',
    seasons: [
      { year: 2023, runs: 340, wickets: 0, matches: 14, average: 34.00, strikeRate: 172.00, economy: 0 },
      { year: 2024, runs: 479, wickets: 0, matches: 15, average: 47.90, strikeRate: 171.07, economy: 0 },
    ],
  },
  {
    id: 37, name: 'Abhishek Sharma', team: 'SRH', role: 'All-rounder',
    matches: 55, runs: 1205, average: 24.59, strikeRate: 165.30, wickets: 15, economy: 8.50, fifties: 5, hundreds: 2, bestScore: '113',
    seasons: [
      { year: 2022, runs: 191, wickets: 2, matches: 12, average: 17.36, strikeRate: 126.49, economy: 8.50 },
      { year: 2023, runs: 268, wickets: 3, matches: 14, average: 22.33, strikeRate: 155.81, economy: 8.42 },
      { year: 2024, runs: 484, wickets: 7, matches: 16, average: 32.27, strikeRate: 204.22, economy: 8.10 },
    ],
  },
  {
    id: 38, name: 'Harshal Patel', team: 'RCB', role: 'Bowler',
    matches: 105, runs: 325, average: 12.50, strikeRate: 120.37, wickets: 128, economy: 8.64, fifties: 0, hundreds: 0, bestScore: '31*',
    seasons: [
      { year: 2021, runs: 100, wickets: 32, matches: 15, average: 0, strikeRate: 0, economy: 7.73 },
      { year: 2022, runs: 25, wickets: 19, matches: 15, average: 0, strikeRate: 0, economy: 7.66 },
      { year: 2023, runs: 15, wickets: 12, matches: 14, average: 0, strikeRate: 0, economy: 10.25 },
      { year: 2024, runs: 22, wickets: 10, matches: 14, average: 0, strikeRate: 0, economy: 9.14 },
    ],
  },
  {
    id: 39, name: 'Devon Conway', team: 'CSK', role: 'Batsman',
    matches: 38, runs: 1271, average: 37.38, strikeRate: 136.34, wickets: 0, economy: 0, fifties: 7, hundreds: 1, bestScore: '92*',
    seasons: [
      { year: 2023, runs: 672, wickets: 0, matches: 16, average: 44.80, strikeRate: 139.41, economy: 0 },
      { year: 2024, runs: 345, wickets: 0, matches: 12, average: 34.50, strikeRate: 132.44, economy: 0 },
    ],
  },
  {
    id: 40, name: 'Riyan Parag', team: 'RR', role: 'All-rounder',
    matches: 68, runs: 1470, average: 26.18, strikeRate: 141.35, wickets: 10, economy: 8.75, fifties: 5, hundreds: 0, bestScore: '84*',
    seasons: [
      { year: 2022, runs: 183, wickets: 0, matches: 15, average: 13.07, strikeRate: 126.90, economy: 0 },
      { year: 2023, runs: 278, wickets: 5, matches: 14, average: 27.80, strikeRate: 139.70, economy: 8.75 },
      { year: 2024, runs: 573, wickets: 3, matches: 16, average: 52.09, strikeRate: 149.22, economy: 7.90 },
    ],
  },
];


// ─────────────────────────────────────────────────
// 3. TEAMS_DATA (10 current IPL franchises)
// ─────────────────────────────────────────────────
export const TEAMS_DATA = [
  { id: 'mi',   name: 'Mumbai Indians',             shortName: 'MI',   color: '#004BA0', wins: 141, losses: 107, titles: 5, homeGround: 'Wankhede Stadium, Mumbai',              captain: 'Hardik Pandya' },
  { id: 'csk',  name: 'Chennai Super Kings',        shortName: 'CSK',  color: '#F9CD05', wins: 138, losses: 97,  titles: 5, homeGround: 'MA Chidambaram Stadium, Chennai',       captain: 'Ruturaj Gaikwad' },
  { id: 'rcb',  name: 'Royal Challengers Bangalore', shortName: 'RCB', color: '#EC1C24', wins: 114, losses: 122, titles: 0, homeGround: 'M. Chinnaswamy Stadium, Bangalore',     captain: 'Faf du Plessis' },
  { id: 'kkr',  name: 'Kolkata Knight Riders',      shortName: 'KKR',  color: '#3A225D', wins: 123, losses: 115, titles: 3, homeGround: 'Eden Gardens, Kolkata',                  captain: 'Shreyas Iyer' },
  { id: 'dc',   name: 'Delhi Capitals',             shortName: 'DC',   color: '#004C93', wins: 101, losses: 127, titles: 0, homeGround: 'Arun Jaitley Stadium, Delhi',            captain: 'Rishabh Pant' },
  { id: 'pbks', name: 'Punjab Kings',               shortName: 'PBKS', color: '#ED1B24', wins: 99,  losses: 130, titles: 0, homeGround: 'PCA Stadium, Mohali',                     captain: 'Shikhar Dhawan' },
  { id: 'rr',   name: 'Rajasthan Royals',           shortName: 'RR',   color: '#EA1A85', wins: 105, losses: 117, titles: 1, homeGround: 'Sawai Mansingh Stadium, Jaipur',          captain: 'Sanju Samson' },
  { id: 'srh',  name: 'Sunrisers Hyderabad',        shortName: 'SRH',  color: '#FF822A', wins: 90,  losses: 94,  titles: 1, homeGround: 'Rajiv Gandhi Intl Stadium, Hyderabad',    captain: 'Pat Cummins' },
  { id: 'gt',   name: 'Gujarat Titans',             shortName: 'GT',   color: '#1C1C1C', wins: 34,  losses: 19,  titles: 1, homeGround: 'Narendra Modi Stadium, Ahmedabad',        captain: 'Shubman Gill' },
  { id: 'lsg',  name: 'Lucknow Super Giants',       shortName: 'LSG',  color: '#A72056', wins: 25,  losses: 21,  titles: 0, homeGround: 'Ekana Cricket Stadium, Lucknow',          captain: 'KL Rahul' },
];


// ─────────────────────────────────────────────────
// 4. LIVE_MATCHES (3 ticker entries)
// ─────────────────────────────────────────────────
export const LIVE_MATCHES = [
  {
    id: 'live-1',
    team1: 'CSK', team2: 'MI',
    score1: '187/5', score2: '142/3',
    overs1: '20.0', overs2: '15.4',
    status: 'MI need 46 runs from 26 balls',
    target: 188,
  },
  {
    id: 'live-2',
    team1: 'RCB', team2: 'KKR',
    score1: '204/3', score2: '98/4',
    overs1: '20.0', overs2: '11.2',
    status: 'KKR need 107 runs from 52 balls',
    target: 205,
  },
  {
    id: 'live-3',
    team1: 'SRH', team2: 'RR',
    score1: '168/7', score2: '0/0',
    overs1: '20.0', overs2: '0.0',
    status: 'Innings break — RR need 169 to win',
    target: 169,
  },
];


// ─────────────────────────────────────────────────
// 5. SEASON_STATS (2008–2024 aggregates)
// ─────────────────────────────────────────────────
export const SEASON_STATS = [
  { year: 2008, totalMatches: 59, totalRuns: 14727, totalWickets: 426, highestScore: '158*', averageScore: 152, mostRuns: { player: 'Shaun Marsh', runs: 616 }, mostWickets: { player: 'Sohail Tanvir', wickets: 22 } },
  { year: 2009, totalMatches: 57, totalRuns: 13845, totalWickets: 407, highestScore: '105', averageScore: 149, mostRuns: { player: 'Matthew Hayden', runs: 572 }, mostWickets: { player: 'RP Singh', wickets: 23 } },
  { year: 2010, totalMatches: 60, totalRuns: 15042, totalWickets: 435, highestScore: '111', averageScore: 151, mostRuns: { player: 'Sachin Tendulkar', runs: 618 }, mostWickets: { player: 'Pragyan Ojha', wickets: 21 } },
  { year: 2011, totalMatches: 73, totalRuns: 18347, totalWickets: 530, highestScore: '175*', averageScore: 153, mostRuns: { player: 'Chris Gayle', runs: 608 }, mostWickets: { player: 'Lasith Malinga', wickets: 28 } },
  { year: 2012, totalMatches: 74, totalRuns: 18610, totalWickets: 540, highestScore: '128*', averageScore: 155, mostRuns: { player: 'Chris Gayle', runs: 733 }, mostWickets: { player: 'Morne Morkel', wickets: 25 } },
  { year: 2013, totalMatches: 76, totalRuns: 18984, totalWickets: 547, highestScore: '175*', averageScore: 152, mostRuns: { player: 'Michael Hussey', runs: 733 }, mostWickets: { player: 'Dwayne Bravo', wickets: 32 } },
  { year: 2014, totalMatches: 60, totalRuns: 15052, totalWickets: 428, highestScore: '116', averageScore: 154, mostRuns: { player: 'Robin Uthappa', runs: 660 }, mostWickets: { player: 'Mohit Sharma', wickets: 23 } },
  { year: 2015, totalMatches: 59, totalRuns: 15090, totalWickets: 440, highestScore: '114', averageScore: 156, mostRuns: { player: 'David Warner', runs: 562 }, mostWickets: { player: 'Dwayne Bravo', wickets: 26 } },
  { year: 2016, totalMatches: 60, totalRuns: 16134, totalWickets: 454, highestScore: '113', averageScore: 164, mostRuns: { player: 'Virat Kohli', runs: 973 }, mostWickets: { player: 'Bhuvneshwar Kumar', wickets: 23 } },
  { year: 2017, totalMatches: 59, totalRuns: 15477, totalWickets: 441, highestScore: '109*', averageScore: 160, mostRuns: { player: 'David Warner', runs: 641 }, mostWickets: { player: 'Bhuvneshwar Kumar', wickets: 26 } },
  { year: 2018, totalMatches: 60, totalRuns: 16093, totalWickets: 464, highestScore: '118*', averageScore: 163, mostRuns: { player: 'Kane Williamson', runs: 735 }, mostWickets: { player: 'Andrew Tye', wickets: 24 } },
  { year: 2019, totalMatches: 60, totalRuns: 15582, totalWickets: 445, highestScore: '109*', averageScore: 159, mostRuns: { player: 'David Warner', runs: 692 }, mostWickets: { player: 'Imran Tahir', wickets: 26 } },
  { year: 2020, totalMatches: 60, totalRuns: 16163, totalWickets: 455, highestScore: '132*', averageScore: 164, mostRuns: { player: 'KL Rahul', runs: 670 }, mostWickets: { player: 'Kagiso Rabada', wickets: 30 } },
  { year: 2021, totalMatches: 60, totalRuns: 15790, totalWickets: 460, highestScore: '124', averageScore: 161, mostRuns: { player: 'Ruturaj Gaikwad', runs: 635 }, mostWickets: { player: 'Harshal Patel', wickets: 32 } },
  { year: 2022, totalMatches: 74, totalRuns: 20466, totalWickets: 590, highestScore: '116', averageScore: 168, mostRuns: { player: 'Jos Buttler', runs: 863 }, mostWickets: { player: 'Yuzvendra Chahal', wickets: 27 } },
  { year: 2023, totalMatches: 74, totalRuns: 20912, totalWickets: 577, highestScore: '129', averageScore: 172, mostRuns: { player: 'Shubman Gill', runs: 890 }, mostWickets: { player: 'Mohammed Shami', wickets: 28 } },
  { year: 2024, totalMatches: 74, totalRuns: 22802, totalWickets: 568, highestScore: '120', averageScore: 187, mostRuns: { player: 'Virat Kohli', runs: 741 }, mostWickets: { player: 'Harshal Patel', wickets: 24 } },
];


// ─────────────────────────────────────────────────
// Exported functions
// ─────────────────────────────────────────────────

/** Get all players */
export function getAllPlayers() {
  return PLAYERS_DATA;
}

/** Get a single player by id */
export function getPlayer(playerId) {
  return PLAYERS_DATA.find((p) => p.id === Number(playerId)) || null;
}

/**
 * Top batsmen for a given season (or career if season is null),
 * ranked by runs.
 */
export function getTopBatsmen(season = null, limit = 5) {
  if (season) {
    return PLAYERS_DATA
      .filter((p) => p.role !== 'Bowler')
      .map((p) => {
        const s = p.seasons.find((sy) => sy.year === Number(season));
        return s ? { ...p, seasonRuns: s.runs, seasonAvg: s.average, seasonSR: s.strikeRate, seasonMatches: s.matches } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.seasonRuns - a.seasonRuns)
      .slice(0, limit);
  }
  return [...PLAYERS_DATA]
    .filter((p) => p.role !== 'Bowler')
    .sort((a, b) => b.runs - a.runs)
    .slice(0, limit);
}

/**
 * Top bowlers for a given season (or career), ranked by wickets.
 */
export function getTopBowlers(season = null, limit = 5) {
  if (season) {
    return PLAYERS_DATA
      .filter((p) => p.role !== 'Batsman')
      .map((p) => {
        const s = p.seasons.find((sy) => sy.year === Number(season));
        return s ? { ...p, seasonWickets: s.wickets, seasonEconomy: s.economy, seasonMatches: s.matches } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.seasonWickets - a.seasonWickets)
      .slice(0, limit);
  }
  return [...PLAYERS_DATA]
    .filter((p) => p.role !== 'Batsman')
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, limit);
}

/** Get all teams */
export function getTeams() {
  return TEAMS_DATA;
}

/** Get single team by id */
export function getTeam(teamId) {
  return TEAMS_DATA.find((t) => t.id === teamId || t.shortName === teamId) || null;
}

/**
 * Compute win-rate for a team from match data.
 * @param {string} teamName  short name, e.g. 'MI'
 * @returns {{ played: number, won: number, lost: number, winRate: number }}
 */
export function getTeamWinRate(teamName) {
  const played = MATCHES_DATA.filter((m) => m.team1 === teamName || m.team2 === teamName);
  const won = played.filter((m) => m.winner === teamName);
  const lost = played.length - won.length;
  const winRate = played.length ? ((won.length / played.length) * 100).toFixed(1) : 0;
  return { played: played.length, won: won.length, lost, winRate: Number(winRate) };
}

/** Get a player's season-by-season career data */
export function getPlayerCareer(playerId) {
  const player = getPlayer(playerId);
  if (!player) return null;
  return {
    player,
    career: player.seasons,
  };
}

/**
 * Head-to-head record between two teams from match data.
 * @param {string} team1Id  short name
 * @param {string} team2Id  short name
 */
export function getHeadToHead(team1Id, team2Id) {
  const matches = MATCHES_DATA.filter(
    (m) =>
      (m.team1 === team1Id && m.team2 === team2Id) ||
      (m.team1 === team2Id && m.team2 === team1Id)
  );
  const team1Wins = matches.filter((m) => m.winner === team1Id).length;
  const team2Wins = matches.filter((m) => m.winner === team2Id).length;
  return {
    matches: matches.length,
    team1Wins,
    team2Wins,
    noResult: matches.length - team1Wins - team2Wins,
    recentMatches: matches.slice(-5).reverse(),
  };
}

/** Get matches played at a given venue (partial match) */
export function getMatchesByVenue(venue) {
  const lower = venue.toLowerCase();
  return MATCHES_DATA.filter((m) => m.venue.toLowerCase().includes(lower));
}

/** Get season aggregate stats for a specific year */
export function getSeasonStats(year) {
  return SEASON_STATS.find((s) => s.year === Number(year)) || null;
}

/** Get all season aggregate stats */
export function getAllSeasonStats() {
  return SEASON_STATS;
}

/** Get the N most recent matches (by date descending) */
export function getRecentMatches(limit = 5) {
  return [...MATCHES_DATA]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

/** Get the live match ticker data */
export function getLiveMatches() {
  return LIVE_MATCHES;
}

/**
 * Wicket heatmap data — danger level per over (1-20).
 * Higher values = more dangerous overs for batting teams.
 */
export function getOverWiseData() {
  return [
    { over: 1,  wickets: 52,  dangerLevel: 45 },
    { over: 2,  wickets: 48,  dangerLevel: 40 },
    { over: 3,  wickets: 40,  dangerLevel: 34 },
    { over: 4,  wickets: 35,  dangerLevel: 28 },
    { over: 5,  wickets: 32,  dangerLevel: 25 },
    { over: 6,  wickets: 38,  dangerLevel: 32 },
    { over: 7,  wickets: 60,  dangerLevel: 55 },
    { over: 8,  wickets: 55,  dangerLevel: 50 },
    { over: 9,  wickets: 50,  dangerLevel: 45 },
    { over: 10, wickets: 48,  dangerLevel: 42 },
    { over: 11, wickets: 45,  dangerLevel: 38 },
    { over: 12, wickets: 42,  dangerLevel: 35 },
    { over: 13, wickets: 50,  dangerLevel: 45 },
    { over: 14, wickets: 55,  dangerLevel: 52 },
    { over: 15, wickets: 60,  dangerLevel: 58 },
    { over: 16, wickets: 70,  dangerLevel: 68 },
    { over: 17, wickets: 82,  dangerLevel: 78 },
    { over: 18, wickets: 88,  dangerLevel: 85 },
    { over: 19, wickets: 95,  dangerLevel: 92 },
    { over: 20, wickets: 100, dangerLevel: 100 },
  ];
}

/**
 * Search players and teams by name (case-insensitive).
 * @param {string} query
 * @returns {{ players: Array, teams: Array }}
 */
export function searchPlayersAndTeams(query) {
  if (!query || !query.trim()) {
    return { players: [], teams: [] };
  }
  const q = query.toLowerCase().trim();
  const players = PLAYERS_DATA.filter(
    (p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
  );
  const teams = TEAMS_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q)
  );
  return { players, teams };
}

/**
 * Compute strike rate from runs and balls faced.
 * @param {number} runs
 * @param {number} balls
 * @returns {number}
 */
export function computeStrikeRate(runs, balls) {
  if (!balls || balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
}

/**
 * Compute economy rate from runs conceded and overs bowled.
 * @param {number} runs
 * @param {number} overs  e.g. 4.0 = 4 overs, 3.4 = 3 overs 4 balls
 * @returns {number}
 */
export function computeEconomy(runs, overs) {
  if (!overs || overs === 0) return 0;
  // Convert overs notation (e.g. 3.4 = 3 overs 4 balls = 22 balls)
  const fullOvers = Math.floor(overs);
  const remainingBalls = Math.round((overs - fullOvers) * 10);
  const totalBalls = fullOvers * 6 + remainingBalls;
  if (totalBalls === 0) return 0;
  const totalOvers = totalBalls / 6;
  return parseFloat((runs / totalOvers).toFixed(2));
}
