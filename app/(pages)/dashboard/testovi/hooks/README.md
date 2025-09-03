# Test Batches React Query Hooks

This directory contains React Query hooks for managing test batches and tests data.

## Hooks

### `useTestBatches()`
Fetches all test batches with caching and error handling.

**Returns:**
- `data`: Array of test batches
- `isLoading`: Loading state
- `error`: Error state
- `refetch`: Function to manually refetch data

**Features:**
- Automatic caching (5 minutes stale time)
- Error handling with retry functionality
- Loading states with skeleton UI

### `useTestsByBatchId(batchId: number)`
Fetches tests for a specific batch ID.

**Parameters:**
- `batchId`: The ID of the test batch

**Returns:**
- `data`: Array of tests for the batch
- `isLoading`: Loading state
- `error`: Error state

**Features:**
- Only runs when batchId is provided
- Separate cache key for each batch
- Optimized for individual batch views

### `useCreateTestBatch()`
Mutation hook for creating new test batches.

**Returns:**
- `mutate`: Function to create test batch
- `isPending`: Loading state
- `error`: Error state

**Features:**
- Automatic cache invalidation after successful creation
- Error handling
- Optimistic updates

### `useUpdateTestBatch()`
Mutation hook for updating existing test batches.

**Returns:**
- `mutate`: Function to update test batch
- `isPending`: Loading state
- `error`: Error state

**Features:**
- Automatic cache invalidation after successful update
- Updates both test batches list and individual batch views
- Error handling

### `useUpdateTest()`
Mutation hook for updating individual tests.

**Returns:**
- `mutate`: Function to update test
- `isPending`: Loading state
- `error`: Error state

**Features:**
- Automatic cache invalidation after successful update
- Updates test lists in batch views
- Error handling

### `useDeleteTest()`
Mutation hook for deleting tests.

**Returns:**
- `mutate`: Function to delete test
- `isPending`: Loading state
- `error`: Error state

**Features:**
- Automatic cache invalidation after successful deletion
- Updates test lists in batch views
- Error handling

## Usage Example

```tsx
import { useTestBatches } from './hooks/use-test-batches';

function TestBatchesList() {
  const { data: testBatches, isLoading, error, refetch } = useTestBatches();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {testBatches?.map(batch => (
        <div key={batch.id}>{batch.name}</div>
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

## Cache Management

The hooks use React Query's built-in caching with the following configuration:
- **Stale Time**: 5 minutes (data considered fresh for 5 minutes)
- **GC Time**: 10 minutes (data kept in cache for 10 minutes after becoming stale)
- **Automatic Invalidation**: Cache is automatically invalidated when new data is created
