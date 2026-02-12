import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { FoodPreservationTip } from '../../backend';
import type { Principal } from '@dfinity/principal';

export function useGetUserTips(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FoodPreservationTip[]>({
    queryKey: ['userTips', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getUserTips(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useGetTip(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FoodPreservationTip | null>({
    queryKey: ['tip', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTip(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}
