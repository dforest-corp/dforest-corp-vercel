import dynamic from 'next/dynamic'

function Fallback() {
  return <div className="fixed left-0 top-0 h-full w-full bg-white" />
}

const IntroScreen = dynamic(() => import('@/components/introScreen'), {
  ssr: false,
  loading: () => <Fallback />,
})

export function IntroScreenDynamic() {
  return <IntroScreen />
}
