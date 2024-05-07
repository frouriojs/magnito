import { APP_NAME } from 'api/@constants';
import { Head, Html, Main, NextScript } from 'next/document';
import { staticPath } from 'utils/$path';
import { GA_ID } from 'utils/gtag';

function Document() {
  return (
    <Html lang="ja">
      <Head>
        <title>{APP_NAME}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href={staticPath.favicon_png} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
