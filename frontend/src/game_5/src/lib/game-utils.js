import {
  FaApple,
  FaBeer,
  FaBicycle,
  FaBirthdayCake,
  FaCar,
  FaCat,
  FaCoffee,
  FaDog,
  FaFootballBall,
  FaGamepad,
  FaGuitar,
  FaHeart,
  FaHome,
  FaIceCream,
  FaMusic,
  FaPizzaSlice,
  FaPlane,
  FaRobot,
  FaRocket,
  FaShip,
  FaSnowflake,
  FaStar,
  FaSun,
  FaTree,
  FaTrophy,
  FaUmbrella,
  FaVolleyballBall,
  FaWineGlassAlt } from
"react-icons/fa";











export const ICONS = [
FaApple,
FaBeer,
FaBicycle,
FaBirthdayCake,
FaCar,
FaCat,
FaCoffee,
FaDog,
FaFootballBall,
FaGamepad,
FaGuitar,
FaHeart,
FaHome,
FaIceCream,
FaMusic,
FaPizzaSlice,
FaPlane,
FaRobot,
FaRocket,
FaShip,
FaSnowflake,
FaStar,
FaSun,
FaTree,
FaTrophy,
FaUmbrella,
FaVolleyballBall,
FaWineGlassAlt];


export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateCards(count = 12) {
  const pairsNeeded = count / 2;
  const uniqueIcons = shuffle([...ICONS]).slice(0, pairsNeeded);
  const iconPairs = [...uniqueIcons, ...uniqueIcons];

  return shuffle(
    iconPairs.map((icon, idx) => ({
      id: idx,
      flipped: false,
      matched: false,
      icon
    }))
  );
}