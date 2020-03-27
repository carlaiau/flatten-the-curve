# Flatten the Curve

This is a work in progress GatsbyJS application for using time-series data from https://github.com/CSSEGISandData/COVID-19

This site is aimed at motivating non technical or non scientific users to start taking the COVID-19 threat seriously, especially if they're in a country that currently has a low case load. 

The ability to compare your own countries current case level and see how another country's infection has spread from a similar level seems to "click" for a lot of people, and therefore motivate change. 

The site has had over 3,000 visits in five days, and often has 10 - 30 people active at any given time, so hopefully we can create some impact.

I understand that the comparisons/projections are not the best way of looking at the outbreaks and could lead to incorrect outcomes, so I am actively working on getting data reformulated into culmulative confirmed / death so they can be used on the log graphs that are commonly seen.

Because the site is statically generated we have zero infrastructure costs. This is just a conversion of our time into potentially saved lifes by avoiding healthcare system overload.

### Availability
I am still on temporary leave from my day job to commit to this project.

### What I'm Working On
-- US Index Page: Table and State Level data obtained from http://covidtracking.com/
-- Insure that the componentry for this is easily extendable to other countries with more granular data, such as **Canada** and **Australia** from the **JHU** dataset
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
- ~~Incorporate fancy styling for home page tool tip, and link to countries from tool tip~~
- ~~Ability for site to function offline~~
- ~~Incorporate table of regions on country page (In current us-index branch).~~ 
- 'connect' this table to a comparison graph.

- Flip / Flop country overview graph to cumulative view.
- Allow adding other countries to country overview cumulative graph if applicable.
- ~~Allow cumulative graphs to have dynamic constraints such as:~~
  - ~~**Confirmed:**: 50th, 100th, 500th, 1000th~~
  - ~~**Deaths**: 10th, 50th, 100th~~
- Backend: Write logic to pull Taiwan and Hong Kong out of China


### Nice To Haves
- Allow filtering of countries by meta data: *population, GDP, climate*
- Context about each country, such as when restrictions were enforced

# Get Involved / Support
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
sh run.sh
```
Countries that show multiple provinces in the John Hopkins data are merged together and country population data is appended from `/processing/data/population_world_bank.csv`

This will create `countries.json` and `cumulative.json` files in `client/data` the formats are:

### Countries.json
```
[
{
    "country_name": "Spain",
    "time_series": [
      ...,
      {
        "date": "2020-03-18T11:00:00.000Z",
        "confirmed": 17963,
        "deaths": 830,
        "recovered": 1107,
        "confirmed_per_mil": 384.45117064557473,
        "deaths_per_mil": 17.763985505529533,
        "recovered_per_mil": 23.692448138097824
      },
      {
        "date": "2020-03-19T11:00:00.000Z",
        "confirmed": 20410,
        "deaths": 1043,
        "recovered": 1588,
        "confirmed_per_mil": 436.82282429862386,
        "deaths_per_mil": 22.32269503887627,
        "recovered_per_mil": 33.98699877443482
      },
      {
        "date": "2020-03-20T11:00:00.000Z",
        "confirmed": 25374,
        "deaths": 1375,
        "recovered": 2125,
        "confirmed_per_mil": 543.0642990569957,
        "deaths_per_mil": 29.428289241088084,
        "recovered_per_mil": 45.48008337259067
      },
      {
        "date": "2020-03-21T11:00:00.000Z",
        "confirmed": 28768,
        "deaths": 1772,
        "recovered": 2575,
        "confirmed_per_mil": 615.7040181000887,
        "deaths_per_mil": 37.925038934696786,
        "recovered_per_mil": 55.111159851492225
      }
    ],
    "highest_confirmed": 28768,
    "highest_deaths": 1772,
    "highest_recovered": 2575,
    "population": 46723749
  },
]
```
### Cumulative.json
```
[
  {
    "highest_confirmed": 28768,
    "population": 46723749,
    "country_name": "Spain",
    "confirmed": [
      ...,
      {
        "num_day": 18,
        "date": "2020-03-19T11:00:00.000Z",
        "confirmed": 20410
      },
      {
        "num_day": 19,
        "date": "2020-03-20T11:00:00.000Z",
        "confirmed": 25374
      },
      {
        "num_day": 20,
        "date": "2020-03-21T11:00:00.000Z",
        "confirmed": 28768
      }
    ],
    "deaths": [
      ...,
      {
        "num_day": 13,
        "date": "2020-03-19T11:00:00.000Z",
        "deaths": 1043
      },
      {
        "num_day": 14,
        "date": "2020-03-20T11:00:00.000Z",
        "deaths": 1375
      },
      {
        "num_day": 15,
        "date": "2020-03-21T11:00:00.000Z",
        "deaths": 1772
      }
   ]
}
```
## Client
Built in gatsby, pretty hacky react.

To run local development:
```
cd client
npm install
npm run develop
``` 
Gatsby will automatically load the countries data into GraphQL based on the above two files


