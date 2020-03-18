# Flatten the Curve

This is a work in progress GatsbyJS application for using time-series data from https://github.com/CSSEGISandData/COVID-19

This site is aimed at motivating non technical or non scientific users to start taking the COVID-19 threat seriously, especially if their in a country that currently has a low case load. 

Even though it making projections based on other countries historical changes is a flawed method it could make more intuitive sense to a non technical user, and therefore motivate change.


## Processing the data
The node data processing script may be useful for someone.
```
cd processing
npm install 
node get.py
```
This will create an output.json array of countries in the format. 
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


# To do

### Next Up
- Create Graph that outputs your countries various projected outcomes from the top 6 - 12 countries.
- Give ability for user to filter the comparable countries by population range
- Dynamically route to pre-select country based on slug for easier sharing to non NZ populations
- PurgeCSS

### Later
- Add meta data to countries about climate / social economical status and region, and allow the frontend user to also filter by these fields.
- Rewrite the app to prevent unnesccary re-renders.
- Rewrite app to actually use components.
- Make app usable offline

