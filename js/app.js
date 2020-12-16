var config = {
  apiKey: "AIzaSyC2jQdfRDyLZGvsS1KQ4yKlgWc83EaZkl8",
  authDomain: "rnfbshop.firebaseapp.com",
  databaseURL: "https://rnfbshop.firebaseio.com",
  projectId: "rnfbshop",
  storageBucket: "rnfbshop.appspot.com",
  messagingSenderId: "1048239497831",
  appId: "1:1048239497831:web:242d9b768fd1fd1ecdeac2"
};
firebase.initializeApp(config);
var db = firebase.firestore();
const auth = firebase.auth();
var storage = firebase.storage();

//products crm
// Create a storage reference from our storage service
var storageRef = storage.ref();

var subida = document.getElementById("subir");
var archivo = document
  .getElementById("archivo")
  .addEventListener("change", subir);
var URL;
var file;

function subir(e) {
  file = e.target.files[0]; // use the Blob or File API
  var spaceRef = storageRef.child("images/" + file.name).put(file);
  spaceRef.on(
    "state_changed",
    function (snapshot) {
      var progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      subida.style.width = progreso + "%";
    },
    function (error) {
      // Handle unsuccessful uploads
    },
    function () {
      URL = spaceRef.snapshot.downloadURL;
      console.log(URL);
      console.log(file.name);
    }
  );
}

btnGuardar = document
  .getElementById("guardar")
  .addEventListener("click", guardar);
function guardar() {
  var primerNombre = document.getElementById("pnombre").value;
  var segundoNombre = document.getElementById("snombre").value;

  const newId = Math.random().toString(36).substring(0);
  db.collection("products")
    .doc(newId)
    .set({
      name: primerNombre,
      price: segundoNombre,
      thumbnail: URL,
      image: file.name,
      productId: newId
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      document.getElementById("pnombre").value = "";
      document.getElementById("snombre").value = "";
    })
    .catch(function (error) {});
}

var tabla = document.getElementById("tabla");
db.collection("products").onSnapshot((querySnapshot) => {
  tabla.innerHTML = "";
  querySnapshot.forEach((doc) => {
    tabla.innerHTML += `
        <tr>
        <td>${doc.id}</td>
        <td>${doc.data().name}</td>
        <td>${doc.data().price}</td>
        <td><img width=10% src=${doc.data().thumbnail} alt=""></td>
        <td>
        <button onclick="borrar('${doc.id}', '${
      doc.data().name
    }')"><i class="material-icons blue-text">delete</i></button>
        </td>
        </tr>
        `;
  });
});

function borrar(id, key) {
  db.collection("products")
    .doc(id)
    .delete()
    .then(function () {
      var desertRef = storageRef.child("images/" + key);

      // Delete the file
      desertRef
        .delete()
        .then(function () {
          console.log("Archivo borrado");
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
        });
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
}

//orders crm
var orders = document.getElementById("orders");
db.collection("orders").onSnapshot((querySnapshot) => {
  orders.innerHTML = "";
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    var cartItems = doc.data().cartItems;
    cartItems.forEach((item) => {
      orders.innerHTML += `
            <tr>
            <td>${item.productId}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${doc.data().cartTotal}</td>
            <td>${doc.data().uid}</td>
            `;
    });
  });
});

//users crm
var users = document.getElementById("users");
db.collection("users").onSnapshot((querySnapshot) => {
  users.innerHTML = "";
  querySnapshot.forEach((doc) => {
    //console.log(doc.data());
    users.innerHTML += `
            <tr>
            <td>${doc.data().id}</td>
            <td>${doc.data().fullName}</td>
            <td>${doc.data().email}</td>
            `;
  });
});

//auth firebase
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
    document.getElementById("data").style.display = "block";
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
    document.getElementById("data").style.display = "none";
  }
};

const signinForm = document.querySelector("#login-form");

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
    //clear form
    signinForm.reset();
    //close the modal
    $("#signinModal").modal("hide");
  });
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();

  auth.signOut().then(() => {
    console.log("sign out");
  });
});

//Events
//List for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    loginCheck(user);
  } else {
    loginCheck(user);
  }
});
