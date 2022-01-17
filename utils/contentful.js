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
        frontPageBgPosterCollection (where: { title: "bg-poster-large-webp" }) {
            items {
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
                video {
                    url
                }
            }
        }
    }  
`
export default client;