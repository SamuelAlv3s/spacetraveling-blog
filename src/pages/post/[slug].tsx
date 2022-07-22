import { format } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter();

  const totalWords = post.data.content.reduce((total, item) => {
    total += item.heading.split(' ').length;

    item.body.forEach(body => {
      total += body.text.split(' ').length;
    });

    return total;
  }, 0);

  const readTime =
    Math.ceil(totalWords / 200) > 1 ? Math.ceil(totalWords / 200) : 1;

  return (
    <>
      {isFallback ? <h1>Carregando...</h1> : ''}
      {post.data.banner.url ? (
        <div className={styles.imageContainer}>
          <img src={post.data.banner.url} alt={`banner ${post.data.title}`} />
        </div>
      ) : (
        ''
      )}

      <main className={styles.postContainer}>
        <div className={styles.postHeader}>
          <strong>{post.data.title}</strong>
          <div>
            <small>
              <FiCalendar></FiCalendar>
              {post.first_publication_date}
            </small>
            <small>
              <FiUser></FiUser>
              {post.data.author}
            </small>
            <small>
              <FiClock></FiClock>
              {readTime} min
            </small>
          </div>
        </div>
        {post.data.content.map(content => {
          return (
            <article className={styles.post} key={content.heading}>
              <h4>{content.heading}</h4>
              {content.body.map((body, index) => {
                return (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: body.text }}
                  ></div>
                );
              })}
            </article>
          );
        })}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 3,
  });

  const paramsPosts = postsResponse.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: [...paramsPosts],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug as string);

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy'
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(body => {
            return {
              text: RichText.asHtml([body]),
            };
          }),
        };
      }),
    },
  };

  return {
    props: { post },
    revalidate: 60 * 60 * 5, // 5 hours
  };
};
