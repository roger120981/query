import { afterEach, beforeEach, describe, expectTypeOf, it, vi } from 'vitest'
import { InfiniteQueryObserver } from '..'
import { createQueryClient, queryKey } from './utils'
import type { InfiniteData, QueryClient } from '..'

describe('InfiniteQueryObserver', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createQueryClient()
    queryClient.mount()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('should be inferred as a correct result type', () => {
    const next: number | undefined = 2
    const queryFn = vi.fn(({ pageParam }) => String(pageParam))
    const observer = new InfiniteQueryObserver(queryClient, {
      queryKey: queryKey(),
      queryFn,
      initialPageParam: 1,
      getNextPageParam: () => next,
    })

    const result = observer.getCurrentResult()

    if (result.isPending) {
      expectTypeOf(result.data).toEqualTypeOf<undefined>()
      expectTypeOf(result.error).toEqualTypeOf<null>()
      expectTypeOf(result.isLoading).toEqualTypeOf<boolean>()
      expectTypeOf(result.status).toEqualTypeOf<'pending'>()
      expectTypeOf(result.isPlaceholderData).toEqualTypeOf<false>()
    }

    if (result.isLoading) {
      expectTypeOf(result.data).toEqualTypeOf<undefined>()
      expectTypeOf(result.error).toEqualTypeOf<null>()
      expectTypeOf(result.isPending).toEqualTypeOf<true>()
      expectTypeOf(result.status).toEqualTypeOf<'pending'>()
      expectTypeOf(result.isPlaceholderData).toEqualTypeOf<false>()
    }

    if (result.isLoadingError) {
      expectTypeOf(result.data).toEqualTypeOf<undefined>()
      expectTypeOf(result.error).toEqualTypeOf<Error>()
      expectTypeOf(result.status).toEqualTypeOf<'error'>()
      expectTypeOf(result.isPlaceholderData).toEqualTypeOf<false>()
    }

    if (result.isRefetchError) {
      expectTypeOf(result.data).toEqualTypeOf<InfiniteData<string, unknown>>()
      expectTypeOf(result.error).toEqualTypeOf<Error>()
      expectTypeOf(result.status).toEqualTypeOf<'error'>()
      expectTypeOf(result.isFetchNextPageError).toEqualTypeOf<boolean>()
      expectTypeOf(result.isFetchPreviousPageError).toEqualTypeOf<boolean>()
      expectTypeOf(result.isPlaceholderData).toEqualTypeOf<false>()
    }

    if (result.isSuccess) {
      expectTypeOf(result.data).toEqualTypeOf<InfiniteData<string, unknown>>()
      expectTypeOf(result.error).toEqualTypeOf<null>()
      expectTypeOf(result.status).toEqualTypeOf<'success'>()
      expectTypeOf(result.isPlaceholderData).toEqualTypeOf<boolean>()
    }

    if (result.isPlaceholderData) {
      expectTypeOf(result.data).toEqualTypeOf<InfiniteData<string, unknown>>()
      expectTypeOf(result.error).toEqualTypeOf<null>()
      expectTypeOf(result.status).toEqualTypeOf<'success'>()
    }
  })
})
