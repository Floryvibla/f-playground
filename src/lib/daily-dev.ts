import axios from "axios";

export async function dailyDevByTagFeed({
  tag,
  limite = 14,
}: {
  tag: string;
  limite?: number;
}) {
  try {
    const response = await axios.post("https://api.daily.dev/graphql", {
      query: `
          query TagFeed(
            $tag: String!
            $first: Int
            $after: String
            $ranking: Ranking
            $supportedTypes: [String!] = ["article",]
          ) {
            page: tagFeed(tag: $tag, first: $first, after: $after, ranking: $ranking, supportedTypes: $supportedTypes) {
              ...FeedPostConnection
            }
          }
          
          fragment FeedPostConnection on PostConnection {
            edges {
              node {
                ...FeedPost
              }
            }
          }
          
          fragment FeedPost on Post {
            ...FeedPostInfo
            slug
          }
          
          fragment FeedPostInfo on Post {
            id
            title
            image
            readTime
            permalink
            createdAt
            numUpvotes
            numComments
            summary
            type
            tags
            source {
              name
              permalink
              image
            }
            slug
          }
        `,
      variables: {
        tag,
        ranking: "TIME",
        first: limite,
        after: "",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching tag feed:", error);
  }
}

// TIME
// POPULARITY
// "share", "freeform", "video:youtube", "collection"

// career, react, tech-news, chatgpt, ai, nextjs,
