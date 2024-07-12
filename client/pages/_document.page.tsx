import { APP_NAME } from 'common/constants';
import { Head, Html, Main, NextScript } from 'next/document';
import { staticPath } from 'utils/$path';

function Document() {
  return (
    <Html lang="ja">
      <Head>
        <title>{APP_NAME}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href={staticPath.favicon_png} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
