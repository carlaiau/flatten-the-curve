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
  
    if (result.errors) {
      reporter.panic('error loading docs', result.errors);
    }
  
    const countries = result.data.allCountriesJson.nodes;
  
    countries.forEach(c => {
      if(c.name != "United States"){ // Custom Structure
        actions.createPage({
          path: '/' + c.name.toLowerCase().replace(/\s+/g, "-"),
          component: require.resolve('./src/templates/country-template.js'),
          context: {
            country: c.name,
          },
        });
      }
    });

  };