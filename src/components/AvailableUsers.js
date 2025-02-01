import {useState, useEffect} from "react";
import UserDetails from './UsersDetails.js';
import Error from './Error.js';
import {fetchAllUserNames} from './http.js';

export default function AvailableUsers({onSelectUser}){
    const [isFetching, setIsFetching] = useState(false);
    const [userNames, setUserNames] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
      async function fetchUserName(){
        setIsFetching(true);
          try{
            const allUsers = await fetchAllUserNames();
            setUserNames(allUsers);
            setIsFetching(false);
          }catch(error){
            setError({
                  message: error.message || 'Failed to fetch user names',
                });
            
          }   
      }
      fetchUserName();
    }, []);
    
     if(error){
        return ( <Error title="An error Occured!" message={error.message}/> );
      }
    
    return(
        <>
        <UserDetails
        title="Available Users"
        users={userNames}
        isLoading={isFetching}
        loadingText="Fetching Place Data..."
        fallbackText="No places available."
        onSelectPlace={onSelectUser}
      />
</>
    )
}