import {twMerge} from 'tailwind-merge'

type ClassInput = string | number | boolean | null | undefined

export default function clsx(...inputs: ClassInput[]) {
  const classes = inputs.filter(Boolean).join(' ')
  return twMerge(classes)
}
