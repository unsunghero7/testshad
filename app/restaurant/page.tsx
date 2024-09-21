import Link from "next/link";
import { getRestaurants } from "../api/restaurant/route";

export default async function RestaurantListPage() {
  const restaurants = await getRestaurants();

  return (
    <div>
      <h1>Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.slug}>
            <Link href={`/restaurant/${restaurant.slug}`}>
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
