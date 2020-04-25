import React from 'react'
import '../components/all.sass'
import Layout from '../components/Layout'
import ProjectRoll from '../components/ProjectRoll'
import { Link, graphql, useStaticQuery } from "gatsby";

const ProjectsIndexPage =() => {
  



      const data = useStaticQuery(graphql`
    query{
  allContentfulBlogPost{
    edges{
      node{
        semesteryear
      }
    }
    }
  }
  `)
    
    return (
      <Layout>
        <div
          className="full-width-image-container margin-top-0"
          style={{
            backgroundImage: `url('/img/screen-web-design-developing-codes-1936299.jpg')`,
          }}
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
              backgroundColor: '#f40',
              color: 'white',
              padding: '1rem',
            }}
          >
            Latest Projects
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">

              <ProjectRoll />

            </div>
          </div>
        </section>
      </Layout>
    )
  }

  export default ProjectsIndexPage
