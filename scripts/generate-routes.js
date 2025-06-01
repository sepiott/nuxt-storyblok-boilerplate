#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get Storyblok token from environment or use default
const token = process.env.STORYBLOK_TOKEN
const version = 'published'

async function generateRoutes() {
  try {
    if (!token) {
      console.error(
        '🔴 Error: STORYBLOK_TOKEN environment variable is not set.',
      )
      console.log('Please set it before running the script.')
      console.log(
        'Example: STORYBLOK_TOKEN="your_actual_token" npm run generate:routes',
      )
      process.exit(1)
    }
    console.log('Fetching routes from Storyblok...')

    // Get space info for cache version
    const spaceResponse = await axios.get(
      `https://api.storyblok.com/v1/cdn/spaces/me?token=${token}`,
    )
    const cacheVersion = spaceResponse.data.space.version

    // First get all links including folder information
    console.log('Fetching links to identify folders...')
    const linksResponse = await axios.get(
      `https://api.storyblok.com/v1/cdn/links?token=${token}&version=${version}&cv=${cacheVersion}`,
    )

    // Identify folder paths from the Links API
    const folderPaths = new Set()
    Object.values(linksResponse.data.links).forEach((link) => {
      if (link.is_folder) {
        folderPaths.add(link.slug)
      }
    })

    console.log(
      `Identified ${folderPaths.size} folder paths: ${Array.from(folderPaths).join(', ')}`,
    )

    // Use the Stories API to get actual content pages
    console.log('Fetching stories with actual content...')
    const storiesResponse = await axios.get(
      `https://api.storyblok.com/v1/cdn/stories?token=${token}&version=${version}&cv=${cacheVersion}&per_page=100`,
    )

    // Create routes array from stories that have actual content
    const routes = []

    // Log some debug info
    console.log(`Found ${storiesResponse.data.stories.length} stories in Storyblok`)

    storiesResponse.data.stories.forEach((story) => {
      // Check if this is a content page (not a folder)
      if (
        story.full_slug !== 'home'
        && story.full_slug !== ''
        && !folderPaths.has(story.full_slug)
      ) {
        routes.push('/' + story.full_slug)
        console.log(`Adding route: /${story.full_slug} (${story.content.component})`)
      }
      else if (story.full_slug === 'home' || story.full_slug === '') {
        // Handle homepage
        routes.push('/')
        console.log(`Adding route: / (homepage)`)
      }
      else {
        console.log(`Skipping folder path: /${story.full_slug}`)
      }
    })

    // Check for pagination in the Stories API
    const total = storiesResponse.headers.total
    const perPage = 100
    const pages = Math.ceil(total / perPage)

    console.log(`Total stories: ${total}, Pages: ${pages}`)

    // If there are more pages, fetch them
    if (pages > 1) {
      for (let page = 2; page <= pages; page++) {
        try {
          const pageResponse = await axios.get(
            `https://api.storyblok.com/v1/cdn/stories?token=${token}&version=${version}&cv=${cacheVersion}&per_page=${perPage}&page=${page}`,
          )

          pageResponse.data.stories.forEach((story) => {
            if (
              story.full_slug !== 'home'
              && story.full_slug !== ''
              && !folderPaths.has(story.full_slug)
            ) {
              routes.push('/' + story.full_slug)
              console.log(`Adding route: /${story.full_slug} (${story.content.component})`)
            }
            else if (story.full_slug !== 'home' && story.full_slug !== '') {
              console.log(`Skipping folder path: /${story.full_slug}`)
            }
          })
        }
        catch (pageError) {
          console.warn(`Error fetching page ${page}: ${pageError.message}`)
        }
      }
    }

    // Create a routes.js file that can be imported
    const routesFilePath = path.resolve(__dirname, '../.routes.js')
    const fileContent = `export default ${JSON.stringify(routes, null, 2)}`

    fs.writeFileSync(routesFilePath, fileContent)

    console.log(`✅ Generated ${routes.length} routes from Storyblok`)
    console.log(`Routes written to: ${routesFilePath}`)
  }
  catch (error) {
    console.error('Error generating routes from Storyblok:', error)
    process.exit(1)
  }
}

generateRoutes()
