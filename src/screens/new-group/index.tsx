import { Header } from '@/components/header'
import { LucideUsers } from '@/components/icons'
import { DefaultLayout } from '@/components/layouts/default'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Text, View } from 'react-native'

export const NewGroupScreen = () => {
  const [groupName, setGroupName] = useState('')

  const { navigate } = useNavigation()

  return (
    <DefaultLayout>
      <Header showBackButton />

      <View className='flex-1 justify-center w-full'>
        <LucideUsers
          width={32}
          height={32}
          className='text-primary self-center'
        />

        <Title
          title='Adicionar novo grupo'
          subtitle='crie um novo grupo'
        />

        <View className='flex flex-col gap-4 mt-4'>
          <Input
            placeholder='Nome do grupo'
            onChangeText={setGroupName}
            value={groupName}
          />

          <Button className='flex-row flex w-full justify-center items-center'>
            <Text
              className='text-foreground'
              onPress={() => navigate('players', { group: groupName })}
            >
              Criar
            </Text>
          </Button>
        </View>
      </View>
    </DefaultLayout>
  )
}
