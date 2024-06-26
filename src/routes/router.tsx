import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './app.routes'

export const MainRouter = () => {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  )
}
