import { useQuery } from '@tanstack/react-query';
import { Navigate, redirect } from 'react-router-dom';

export default function Protected ({children}) {
    const {data, isPending, isError, error } = useQuery({
        queryKey: ['session'],
        queryFn: getSession
    });

    let content;

    if (isPending) {
      content = (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
  
    if (isError) {
      content = (
        <div>
          <ErrorBlock
            title="Failed to load message."
            message={error.info?.message || "Error when fetching data."}
          />
        </div>
      );
    }

    if (data && !data.isAuthenticated){
        return <Navigate to='/auth?mode=login' />
    }

    if (data && data.isAuthenticated){
        content = children;
    }

    return content;
}