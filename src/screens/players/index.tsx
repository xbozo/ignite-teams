import { Player } from '@/@types/player'
import { Team } from '@/@types/team'
import { EmptyList } from '@/components/empty-list'
import { Header } from '@/components/header'
import { LucidePlus } from '@/components/icons'
import { DefaultLayout } from '@/components/layouts/default'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Players } from '@/data/players'
import { Teams } from '@/data/teams'
import { addPlayerByGroup } from '@/storage/player/add-player-by-group'
import { AppError } from '@/utils/app-error'
import { useRoute } from '@react-navigation/native'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { PlayerCard } from './player-card'

type RouteParams = {
  group: string
}

export const PlayersScreen = () => {
  const [players, setPlayers] = useState<Player[]>(Players)
  const [teams, setTeams] = useState<Team[]>(Teams)
  const [newPlayerName, setNewPlayerName] = useState('')

  const route = useRoute()
  const { group } = route.params as RouteParams

  const handleAddPlayerOnTeam = async () => {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Erro', 'Informe o nome do participante do time.')
    }

    const newPlayer = {
      name: newPlayerName,
      team: teams.filter((team) => team.isActive)[0].name,
    }

    try {
      await addPlayerByGroup({
        newPlayer,
        group,
      })

      return Alert.alert('Sucesso', 'Jogador adicionado com sucesso.')

      // const players = await getPlayersByGroup(group)
    } catch (err) {
      if (err instanceof AppError) {
        return Alert.alert('Erro', err.message)
      }

      console.log(err)
      return Alert.alert('Erro', 'Ocorreu um erro ao adicionar o participante.')
    }
  }

  const handleSetActiveTeam = (teamIndex: number) => {
    const newTeams = teams.map((team, index) => {
      if (index === teamIndex) {
        return {
          ...team,
          isActive: !team.isActive,
        }
      }

      return {
        ...team,
        isActive: false,
      }
    })

    setTeams(newTeams)
  }

  useEffect(() => {
    handleSetActiveTeam(0)
  }, [])

  return (
    <DefaultLayout>
      <Header showBackButton />

      <Title
        title={JSON.stringify(group)}
        subtitle='adicione os participantes e separe os times'
      />

      <View className='flex gap-4 w-full'>
        <View className='bg-background rounded-md border pr-3 border-input w-full items-center flex flex-row'>
          <Input
            placeholder='Nome do participante'
            className='flex-1 border-transparent pl-3'
            onChangeText={setNewPlayerName}
          />

          <TouchableOpacity onPress={handleAddPlayerOnTeam}>
            <LucidePlus
              className='size-6 text-primary'
              width={24}
              height={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className='flex flex-row gap-4 my-6 w-full justify-between items-center'>
        <FlatList
          data={teams}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          className='w-full'
          contentContainerClassName='flex flex-row gap-4'
          renderItem={({ item: team, index }) => {
            return (
              <Button
                variant='ghost'
                key={index}
                className={clsx('border border-transparent', team.isActive && 'border-primary')}
                onPress={() => handleSetActiveTeam(index)}
              >
                <Text className='uppercase text-foreground text-sm'>{team.name}</Text>
              </Button>
            )
          }}
        />

        <Text className='text-foreground text-sm'>{teams.length}</Text>
      </View>

      <FlatList
        data={players}
        keyExtractor={(_, index) => index.toString()}
        className='w-full mb-10'
        contentContainerClassName='gap-4 pb-5 items-center w-full'
        ListEmptyComponent={() => (
          <EmptyList
            title='Nenhum jogador nesse grupo...'
            description='Que tal adicionar o primeiro jogador?'
          />
        )}
        renderItem={({ item: player, index }) => (
          <PlayerCard
            key={index}
            name={player.name}
          />
        )}
      />

      <Text className='text-foreground text-sm'>{teams.length}</Text>
    </DefaultLayout>
  )
}
