import Link from 'next/link'

export const NextLink = (props: { children: React.ReactNode; href: URL; as?: string }) => {
  return (
    <Link href={props.href} as={props.as} passHref>
      {props.children}
    </Link>
  )
}
