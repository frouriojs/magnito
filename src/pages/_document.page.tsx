import { createGetInitialProps } from '@mantine/next'
import { Head, Html, Main, NextScript } from 'next/document'
import { GA_ID } from 'src/utils/gtag'

function Document() {
  return (
    <Html lang="ja">
      <Head>
        <title>next-frourio-starter</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="next-frourio-starter" />
        <link rel="icon" href="favicon.ico" />
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
  )
}

Document.getInitialProps = createGetInitialProps()

export default Document
