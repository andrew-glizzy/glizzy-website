import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE}`;

const httpLink = createHttpLink({
  fetch,
  uri: CONTENTFUL_URL,
  headers: {
    authorization: `Bearer ${TOKEN}`, 
    'Content-Language': 'en-us',
   },
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});


// QUERIES
export const frontPagePosterQuery = gql`
    query {
        frontPageBgPosterCollection {
            items {
                isMobile
                contentType
                image {
                    url
                }
            }
        }
    }
`
export const frontPageAnimationQuery = gql`
    query {
        frontPageBgAnimationCollection {
            items {
                title
                isMobile
                contentType
                video {
                    url
                }
            }
        }
    }  
`

export const frontPageSketchQuery = gql`
    query {
        frontPageBgSketchCollection {
            items {
                title
                isMobile
                contentType
                image {
                    url
                }
            }
        }
    }
`

export const frontPageArrowQuery = gql`
    query {
        frontPageBgArrowCollection {
            items {
                title
                contentType
                image {
                    url
                }
            }
        }
    }
`

export default client;