import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Application } from '../backend';

export function useCreateApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; amount: bigint; country: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createApplication(data.name, data.email, data.amount, data.country);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useGetApplicationStatus(applicationId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Application | null>({
    queryKey: ['application', applicationId?.toString()],
    queryFn: async () => {
      if (!actor || !applicationId) return null;
      return actor.getApplicationStatus(applicationId);
    },
    enabled: !!actor && !isFetching && applicationId !== null,
  });
}

export function useGetProcessingFee(applicationId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['processingFee', applicationId?.toString()],
    queryFn: async () => {
      if (!actor || !applicationId) return null;
      return actor.getProcessingFee(applicationId);
    },
    enabled: !!actor && !isFetching && applicationId !== null,
  });
}

export function useGetPaymentInstructions(applicationId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['paymentInstructions', applicationId?.toString()],
    queryFn: async () => {
      if (!actor || !applicationId) return null;
      return actor.getPaymentInstructions(applicationId);
    },
    enabled: !!actor && !isFetching && applicationId !== null,
  });
}
