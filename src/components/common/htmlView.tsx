import parse from 'html-react-parser'
import {sanitize} from '@/utils/sanitize'

export type HtmlViewProps = {
  html: string
}

const HtmlView = ({html}: HtmlViewProps) => <>{parse(sanitize(html))}</>

export default HtmlView
