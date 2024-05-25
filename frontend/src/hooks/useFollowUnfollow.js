import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch("http://localhost:5000/api/users/follow/${user._id}", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			if (following) {
				showToast("Success", `Unfollowed ${user.name}`, "success");
				user.followers.pop(); // simulate removing from followers
			} else {
				showToast("Success", `Followed ${user.name}`, "success");
				user.followers.push(currentUser?._id); // simulate adding to followers
			}
			setFollowing(!following);

			console.log(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

	return { handleFollowUnfollow, updating, following };
};
// const useFollowUnfollow = (user) => {
//     const currentUser = useRecoilValue(userAtom);
//     const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
//     const [updating, setUpdating] = useState(false);
//     const showToast = useShowToast();

//     const handleFollowUnfollow = async () => {
//         if (!currentUser) {
//             showToast("Error", "Please login to follow", "error");
//             return;
//         }
//         if (updating) return;

//         setUpdating(true);
//         try {
//             console.log("User ID before validation:", user._id); // Debugging statement
//             if (!mongoose.Types.ObjectId.isValid(user._id)) {
//                 showToast("Error", "Invalid user ID format", "error");
//                 return;
//             }

//             console.log("User ID before API call:", user._id); // Debugging statement
//             const res = await fetch(`http://localhost:5000/api/users/follow/${encodeURIComponent(user._id)}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ userId: user._id }) // Pass user._id in the request body
//             });
//             const data = await res.json();
//             if (data.error) {
//                 showToast("Error", data.error, "error");
//                 return;
//             }

//             if (following) {
//                 showToast("Success", `Unfollowed ${user.name}`, "success");
//                 user.followers.pop(); // simulate removing from followers
//             } else {
//                 showToast("Success", `Followed ${user.name}`, "success");
//                 user.followers.push(currentUser?._id); // simulate adding to followers
//             }
//             setFollowing(!following);

//             console.log(data);
//         } catch (error) {
//             showToast("Error", error, "error");
//         } finally {
//             setUpdating(false);
//         }
//     };

//     return { handleFollowUnfollow, updating, following };
// };

export default useFollowUnfollow;
