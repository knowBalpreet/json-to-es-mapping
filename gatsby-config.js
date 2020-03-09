module.exports = {
  siteMetadata: {
    title: `Elasticsearch mapping creator`,
    description: `A web application to create and edit elasticsearch mappings from raw json on the go. Just copy and paste raw json and see the mappings. Edit them on live editor as per the use case, and just copy.`,
    author: `@knowbalpreet`,
    githubUrl: 'https://github.com/knowBalpreet/json-to-es-mapping',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    'gatsby-plugin-pnpm',
    `gatsby-plugin-sharp`,
    `gatsby-plugin-antd`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `json-to-es-mapping`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
