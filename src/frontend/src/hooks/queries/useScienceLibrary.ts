import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ScienceExplanation } from '../../backend';

export function useGetAllScienceExplanations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScienceExplanation[]>({
    queryKey: ['scienceExplanations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScienceExplanations();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useGetScienceExplanation(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScienceExplanation | null>({
    queryKey: ['scienceExplanation', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getScienceExplanation(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetExplanationsByCategory(category: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScienceExplanation[]>({
    queryKey: ['scienceExplanations', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getExplanationsByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
    staleTime: 1000 * 60 * 5,
  });
}
