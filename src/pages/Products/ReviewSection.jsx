import React, { useEffect, useState } from "react";
import { fetchUserById } from "../../services/userServices";

const ReviewSection = ({ reviews }) => {
  const [usersData, setUsersData] = useState({});
  
  useEffect(() => {
    const fetchUsersData = async () => {
      // Only fetch if reviews exist and is an array
      if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return;
      
      try {
        // Fetch user data for all reviews
        const userPromises = reviews.map(review => 
          fetchUserById(review.uid)
        );
        const usersArray = await Promise.all(userPromises);
        
        // Create a map of user data by UID
        const usersMap = {};
        usersArray.forEach((userData, index) => {
          if (userData && Array.isArray(userData) && userData.length > 0) {
            // Access the first element of the array
            usersMap[reviews[index].uid] = userData[0];
          } else if (userData && !Array.isArray(userData)) {
            // In case the API returns a single object instead of array
            usersMap[reviews[index].uid] = userData;
          }
        });
        
        setUsersData(usersMap);
        console.log("Fetched user data for reviews:", usersMap);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUsersData();
  }, [reviews]);
  
  console.log("Rendering ReviewSection with reviews:", reviews);
  
  // Handle case where reviews is not an array
  if (!reviews || !Array.isArray(reviews)) {
    return (
      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Customer Reviews
        </h2>
        <p className="text-gray-500 italic">No reviews yet.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Customer Reviews
      </h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {usersData[review.uid]?.name || review.name || 'Anonymous'}
                  </h3> 
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewSection;