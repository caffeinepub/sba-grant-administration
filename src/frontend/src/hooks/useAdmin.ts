import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ApplicationStatus, AccountType } from '../backend';

export function useGetAllApplications() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { applicationId: bigint; status: ApplicationStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(data.applicationId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
  });
}

export function useSetProcessingFee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { appId: bigint; fee: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProcessingFee(data.appId, data.fee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processingFee'] });
    },
  });
}

export function useRemoveProcessingFee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeProcessingFee(appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processingFee'] });
    },
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

export function useGetAllReceivingAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['receivingAccounts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllReceivingAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReceivingAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { accountType: AccountType; accountName: string; accountDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReceivingAccount(data.accountType, data.accountName, data.accountDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivingAccounts'] });
    },
  });
}

export function useUpdateReceivingAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { accountId: bigint; accountType: AccountType; accountName: string; accountDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReceivingAccount(data.accountId, data.accountType, data.accountName, data.accountDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivingAccounts'] });
    },
  });
}

export function useAssignReceivingAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { applicationId: bigint; accountId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignReceivingAccount(data.applicationId, data.accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentInstructions'] });
    },
  });
}
