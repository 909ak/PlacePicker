import { useState, useEffect } from 'react';
import Places from './Places.js';
import Error from './Error.js';
import {sortPlacesByDistance} from '../loc.js';
import {fetchAvailablePlaces} from './http.js';
export default function AvailablePlaces({ onSelectPlace }) {
const [isFetching, setIsFetching] = useState(false);
const [availablePlaces, setAvailablePlaces] = useState([]);
const [error, setError] = useState();
useEffect(() => {
async function fetchData(){
  setIsFetching(true);
  
  try{
     
      const response = await fetchAvailablePlaces();

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
        response,
        position.coords.latitude,
        position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);


      });


  } catch(error){
    setError({
         message: 
             error.message || 'Could not fetches places. Please try again later.'
         });
  }
  

}

fetchData();
// fetch('http://localhost:3000/places')
// .then((response) => {
//     return response.json();
// })
// .then((resData) => {
//   setAvailablePlaces(resData.places);
// });
}, []);

  if(error){
    return ( <Error title="An error Occured!" message={error.message}/> );
  }

  return (
    <Places 
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching Place Data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
