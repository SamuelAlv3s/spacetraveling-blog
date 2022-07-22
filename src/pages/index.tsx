import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  async function handleNextPagePosts() {
    let newPosts = [...posts];

    const response = await fetch(postsPagination.next_page);
    const data = await response.json();

    const formatedPosts = data.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy'
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    newPosts = [...newPosts, ...formatedPosts];

    setPosts(newPosts);
    setNextPage(data.next_page);
  }
  return (
    <>
      <Head>
        <title>spacetraveling | blog</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.postsContainer}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a className={styles.post}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <span>
                  <small>
                    <FiCalendar></FiCalendar>
                    {post.first_publication_date}
                  </small>
                  <small>
                    <FiUser></FiUser>
                    {post.data.author}
                  </small>
                </span>
              </a>
            </Link>
          ))}

          {nextPage ? (
            <button
              className={styles.morePostsButton}
              onClick={() => handleNextPagePosts()}
            >
              Carregar mais posts
            </button>
          ) : (
            ''
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 3,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy'
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};
