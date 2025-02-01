import { useState, useEffect } from "react";
import UserDetails from "./UsersDetails";
import Error from './Error.js';

export default function SelectedUsers(){
    const [isFetching, setIsFetching] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState();
 
    useEffect(() => {
      async function getSelectedUsers(){
        setIsFetching(true);
        try{
            const response = await fetch('http://localhost:3000/selected-users');
            const redData = await response.json();
            if(!response.ok){
                throw new Error('Failed to fetch details');
            }
            setSelectedUsers(redData.names);
            setIsFetching(false);

        }catch(error){
            setError({
                method: error.message || 'Failed to fetch details',
            })
        }
       
      }

      getSelectedUsers();

     },[]);

     
     function onSelectUser(){
        console.log('this is testing');
     }
     if(error){
        return ( <Error title="An error Occured!" message={error.message}/> );
      }

    return(

        <UserDetails
        title="Available Users"
        users={selectedUsers}
        isLoading={isFetching}
        loadingText="Fetching Place Data..."
        fallbackText="No places available."
        onSelectUser={onSelectUser}
        />
    )
}