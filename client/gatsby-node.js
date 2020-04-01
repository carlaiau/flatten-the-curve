/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it


exports.createPages = async ({ actions, graphql, reporter }) => {
    const result = await graphql(`
      query {
        allCountriesJson( filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
            nodes {
              name
              highest_confirmed
            }
          }
      }
    `);
  
    if (result.errors)
      reporter.panic('error loading docs', result.errors);
    
    const countries = result.data.allCountriesJson.nodes;
    
    const advanced_countries = [
      {
        slug: 'australia',
        name: 'Australia',
        checkedAreas: ['New South Wales', 'Victoria', 'Queensland'],
        show_grid: true,
        hide_deaths: true
      },
      {
        slug: 'china',
        name: 'China',
        checkedAreas: ['Hubei', 'Hong Kong', 'Guangdong', 'British Henan']
      },
      {
        slug: 'canada',
        name: 'Canada',
        checkedAreas: ['Ontario', 'Saskatchewan', 'Quebec', 'British Columbia'],
        area_label: "province or territory",
        show_grid: true
        
      },
      {
        slug: 'united-states',
        name: 'United States',
        checkedAreas: ['NY', 'NJ', 'CA', 'MI', 'MA', 'WA']
      }
    ]

    // Create basic page for each country not in the advanced countries array
    countries.filter(c => {
      return ! advanced_countries.map(adv_c => adv_c.name).includes(c.name)
    })
    .forEach(c => {
      actions.createPage({
        path: '/' + c.name.toLowerCase().replace(/\s+/g, "-"),
        component: require.resolve('./src/templates/country-template.js'),
        context: {
          country: c.name,
        },
      });
    });

    advanced_countries.forEach( p => {
      actions.createPage({
        path: '/' + p.slug,
        component: require.resolve('./src/templates/advanced-country-template.js'),
        context: p // Each countries object gets passed in as context object
      });
    })

    // Create Index Page
    actions.createPage({path: '/', component: require.resolve('./src/templates/index-template.js') });

    


  };