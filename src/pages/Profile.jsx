import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Busca dados extras no Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setExtraData(docSnap.data());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="container mt-5 text-white">
      <h2>Perfil</h2>
      {user ? (
        <div className="bg-dark p-4 rounded">
          <p><b>Email:</b> {user.email}</p>
          {extraData && (
            <>
              <p><b>Firstname:</b> {extraData.firstname}</p>
              <p><b>Lastname:</b> {extraData.lastname}</p>
            </>
          )}
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Sair
          </button>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default Profile;
