import {IntroScreenContent} from '@/components/infroScreenContent'
import {isReload, isRobot} from '@/components/introScreenActions'

export async function IntroScreen() {
  const reload = await isReload()
  const robot = await isRobot()
  if (reload || robot) return null

  return <IntroScreenContent />
}
