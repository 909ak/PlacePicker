import { useEffect } from "react";
export default function UserDetails({ title, users, fallbackText, onSelectPlace, isLoading, loadingText }) {

  useEffect(() =>{
function getFetch(expression){
const test = {
     1: 'Ankush',
     2: 'Ankit',
     3: 'Maanu',
}

return test[expression] || 'Users';

}

console.log(getFetch(1));
console.log(getFetch(2));
console.log(getFetch(3));
console.log(getFetch(4));
},[]);
  return (
    <section className="places-category">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {!isLoading && users.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isLoading && users.length > 0 && (
        <ul className="places">
          {users.map((user) => 
            (
            <li key={user.id} className="place-item1">
              <button onClick={() => onSelectPlace(users)}>
                <h3>{user.name}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
