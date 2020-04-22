const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

module.exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const blogTemplate = path.resolve('./src/templates/blog-post.js')

  const res = await graphql(`
          query{
              allContentfulBlogPost{
                  edges{
                      node{
                          slug
                      }
                  }
              }
          }`
      )

res.data.allContentfulBlogPost.edges.forEach((edge)=> {
  createPage ({
      component: blogTemplate,
      path: `blog/${edge.node.slug}`,
      context: {
          slug: edge.node.slug
      }
  })
})


  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(edge => {
      const id = edge.node.id
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach(tag => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

// module.exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions

//   const blogTemplate = path.resolve('./src/templates/blog-post.js')

//   const res = await graphql(`
//           query{
//               allContentfulBlogPost{
//                   edges{
//                       node{
//                           slug
//                       }
//                   }
//               }
//           }`
//       )

// res.data.allContentfulBlogPost.edges.forEach((edge)=> {
//   createPage ({
//       component: blogTemplate,
//       path: `blog/${edge.node.slug}`,
//       context: {
//           slug: edge.node.slug
//       }
//   })
// })

// }
