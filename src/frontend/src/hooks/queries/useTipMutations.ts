import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';

interface CreateTipParams {
  title: string;
  content: string;
  tags: string[] | null;
}

interface UpdateTipParams {
  id: bigint;
  title: string;
  content: string;
  tags: string[] | null;
}

export function useCreateTip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, tags }: CreateTipParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTip(title, content, tags);
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal();
      queryClient.invalidateQueries({ queryKey: ['userTips', principal?.toString()] });
    },
  });
}

export function useUpdateTip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content, tags }: UpdateTipParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTip(id, title, content, tags);
    },
    onSuccess: (_, variables) => {
      const principal = identity?.getPrincipal();
      queryClient.invalidateQueries({ queryKey: ['userTips', principal?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tip', variables.id.toString()] });
    },
  });
}

export function useDeleteTip() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTip(id);
    },
    onSuccess: (_, id) => {
      const principal = identity?.getPrincipal();
      queryClient.invalidateQueries({ queryKey: ['userTips', principal?.toString()] });
      queryClient.removeQueries({ queryKey: ['tip', id.toString()] });
    },
  });
}
