import parse from 'html-react-parser'

export type HtmlViewProps = {
  html: string
}

export const HtmlView = ({html}: HtmlViewProps) => <>{parse(html)}</>
