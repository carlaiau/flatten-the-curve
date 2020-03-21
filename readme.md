# Flatten the Curve

This is a work in progress GatsbyJS application for using time-series data from https://github.com/CSSEGISandData/COVID-19

This site is aimed at motivating non technical or non scientific users to start taking the COVID-19 threat seriously, especially if their in a country that currently has a low case load. 

The ability to compare your own countries current case level and see how another country's infection has spread from a similar level seems to "click" for a lot of people, and therefore motivate change. 

The site has had over 1,000 visits in two days, and often has 10 - 30 people active at any given time, so hopefully we can create some impact.

I understand that the comparisons/projections are not the best way of looking at the outbreaks and could let to incorrect outcomes, so I am actively working on getting data reformulated into culmulative confirmed / death so they can be used on the log graphs that are commonly seen. These graphs will replace what is currently getting output on the index.

Because the site is statically generated we have zero infrastructure costs. This is just a conversion of our time into potentially saved lifes by avoiding healthcare system overload.

### Availability
I am on leave from my day job until Monday so I can fully commit (no pun intended) to working towards something that can create more impact.

### What I'm Working On
- ~~Turn huge `index.js` file into components, so state changes of specific components don't effect global scope and trigger a full app re-render.~~
- ~~Split site into multiple pages, with each country page (similar to current index) available at `c/new-zealand` or `c/australia`~~
- ~~Show well performing comparisons to give people hope~~ (Can now sort by worst or best)
- ~~Global State (without redux). The graphQL query on evey route is stupid~~
- ~~Add real data to the start of projection graphs~~
- ~~Create two new **Graph Components**  that showcases:~~
  - ~~Cumulative number of deaths, by number of days since 10th deaths~~
  - ~~Culumlative number of cases, by number of days since 100th case~~
  - ~~Allow This component to be passed in array of countries so that user can choose to compare their country to any other countries.~~
- ~~Create Index Page that showcases the top outbreaks in the world, using the above Graph component, and table of results~~
- Incorporate fancy styling for home page tool tip, and link to countries from tool tip
- Incorporate the cumulative graph on country pages where it is applicable.
- Backend: Write logic to pull Taiwan and Hong Kong out of China


### Nice To Haves
- Allow filtering of countries by meta data: *population, GDP, climate*
- Ability for site to function offline
- Context about each country, such as when restrictions were enforced
- Perserve Regional Data for specific countries and enhance their dashboard accordingly

# Get Involved
Open to all collaboration. I specifically need:
- Help with content and communicating ideas concisely
- UI/UX
- Cleaner / Refactorisation of code. Everything is hacked together at the moment

# How To
If you want to play with the "stack" it is pretty simple  assuming that you have node and npm installed.

## Processing the data
The node data processing script may be useful for someone.
```
cd processing
npm install 
node get.py
```
This will create an countries.json array of countries in the format. 
```
{
    "country_name": "New Zealand",
    "time_series": [
      {
        "date": "3/15/20",
        "confirmed": 8,
        "confirmed_per_mil": 1.6374987207041243
      },
      {
        "date": "3/16/20",
        "confirmed": 8,
        "confirmed_per_mil": 1.6374987207041243
      },
      {
        "date": "3/17/20",
        "confirmed": 12,
        "confirmed_per_mil": 2.4562480810561866
      },
      {
        "date": "3/18/20",
        "confirmed": 20,
        "confirmed_per_mil": 4.093746802
      }
    ],
    "highest_confirmed": 20,
    "population": 4885500
  },
```
Countries that show multiple provinces in the John Hopkins data are merged together, and country population data is merged from `/processing/data/population_world_bank.csv`

## Client
Built in gatsby, pretty hacky react.

To run local development:
```
cd client
npm install
npm run develop
``` 
Gatsby will automatically load the countries data into GraphQL based on what file is sitting at `/client/data/output.json`


