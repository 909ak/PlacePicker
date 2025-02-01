import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.js';
import Modal from './components/Modal.js';
import DeleteConfirmation from './components/DeleteConfirmation.js';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.js';
import AvailableUsers from './components/AvailableUsers.js';
import {updateUserPlaces} from './components/http.js';
import {updateUserDetailFile} from './components/http.js';
import Error from './components/Error.js';
import {fetchUserPlaces} from './components/http.js';
import SelectedUsers from './components/SelectedUsers.js';
function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();


  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(() => {
     async function fetchdata(){
      setIsFetching(true);
        try{
          const places = await fetchUserPlaces();
          setUserPlaces(places);
        }catch(error){
          setError({
               method: error.message || 'Failed to fetch user places',
              });
        }
        setIsFetching(false);
     }
     fetchdata();
  },[]);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try{ 
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    }
    catch(error){
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
                   message: 
                      error.message || 'Faild to update the places',
                    });
    }

  }


  async function handleSelectUser(selectedUser) {
    alert('this is testing'); return; 
    setUserPlaces((prevPickedUser) => {
      if (!prevPickedUser) {
        prevPickedUser = [];
      }
      if (prevPickedUser.some((place) => place.id === selectedUser.id)) {
        return prevPickedUser;
      }
      return [selectedUser, ...prevPickedUser];
    });

    try{ 
      await updateUserDetailFile([selectedUser, ...userDetails]);
    }
    catch(error){
      setUserDetails(userPlaces);
      setErrorUpdatingPlaces({
                   message: 
                      error.message || 'Faild to update the places',
                    });
    }

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try{
     
     await updateUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      )

    }catch(error){
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || 'Faild to delete the place',
         });

        
    }
    

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError(){
    setErrorUpdatingPlaces(undefined);
    setError(undefined);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError} >
         <Error title="An error Occured!" message={errorUpdatingPlaces ? errorUpdatingPlaces.message : ""} onConfirm={handleError}/>
      </Modal >
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && (<Error title="An Error Occured!" message={error.message} onConfirm={handleError}/>)}
        {!error && (<Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          isLoading={isFetching}
          fallbacktext="No place available"
          onSelectPlace={handleStartRemovePlace}
        />)}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
        <AvailableUsers onSelectUser={handleSelectUser} />
      </main>
    </>
  );
}

export default App;
