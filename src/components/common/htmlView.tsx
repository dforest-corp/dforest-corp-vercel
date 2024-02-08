import parse from 'html-react-parser'

export type HtmlViewProps = {
  html: string
}

const HtmlView = ({html}: HtmlViewProps) => <>{parse(html)}</>

export default HtmlView
